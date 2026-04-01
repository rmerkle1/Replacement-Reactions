import { useState, useCallback } from 'react'
import { PRESET_REACTIONS } from './data/chemistry.js'
import {
  uid, deriveProducts, buildMoleculeFromMembers, getMembers,
  dist, autoCoeff, gridPosition,
} from './utils/chemUtils.js'
import TopLeftPanel from './components/TopLeftPanel.jsx'
import BottomLeftPanel from './components/BottomLeftPanel.jsx'
import BottomRightPanel from './components/BottomRightPanel.jsx'
import TopRightPanel from './components/TopRightPanel.jsx'
import './App.css'

const SNAP_DISTANCE = 64

export default function App() {
  const [reactionIdx, setReactionIdx] = useState(0)
  const reaction = PRESET_REACTIONS[reactionIdx]

  const [selectedCharges, setSelectedCharges] = useState({
    c1cation: null, c1anion: null,
    c2cation: null, c2anion: null,
  })

  // Master list of added ions: { id, ionKey, symbol, symbolHTML, charge, color }
  const [addedIons, setAddedIons] = useState([])

  // Bottom-left positions: { [ionId]: { x, y } }
  const [leftPositions, setLeftPositions] = useState({})

  // Bottom-right items: ion | molecule
  const [rightItems, setRightItems] = useState([])

  // State-of-matter selections for products
  const [productStates, setProductStates] = useState({})

  const [submitResult, setSubmitResult] = useState(null)

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const bottomUnlocked = addedIons.length > 0
  const products = deriveProducts(rightItems)
  const topRightUnlocked = products.length > 0

  // Auto-calculated reactant coefficients
  const c1Coeff = autoCoeff(addedIons, 'c1cation',
    reaction.compound1.cation.charge, reaction.compound1.anion.charge)
  const c2Coeff = autoCoeff(addedIons, 'c2cation',
    reaction.compound2.cation.charge, reaction.compound2.anion.charge)

  // ─── Handlers ────────────────────────────────────────────────────────────────

  function handleSelectCharge(ionKey, charge) {
    setSelectedCharges((prev) => ({ ...prev, [ionKey]: charge }))
    setSubmitResult(null)
  }

  function handleAddIon(ionKey, ionData) {
    const id = uid()
    const newIon = { id, ionKey, ...ionData }

    // Calculate grouped grid position for bottom-left
    const leftPos = gridPosition(ionKey, addedIons)
    // Offset slightly for bottom-right so they don't perfectly overlap
    const rightPos = { x: leftPos.x + 12, y: leftPos.y + 10 }

    setAddedIons((prev) => [...prev, newIon])
    setLeftPositions((prev) => ({ ...prev, [id]: leftPos }))
    setRightItems((prev) => [
      ...prev,
      { id, kind: 'ion', x: rightPos.x, y: rightPos.y, ...ionData },
    ])
    setSubmitResult(null)
  }

  function handleRemoveIon(ionKey) {
    setAddedIons((prev) => {
      const revIdx = [...prev].reverse().findIndex((i) => i.ionKey === ionKey)
      if (revIdx === -1) return prev
      const realIdx = prev.length - 1 - revIdx
      const removed = prev[realIdx]
      const next = [...prev]
      next.splice(realIdx, 1)

      setLeftPositions((lp) => {
        const copy = { ...lp }
        delete copy[removed.id]
        return copy
      })

      setRightItems((ri) => {
        const newRi = []
        for (const item of ri) {
          if (item.kind === 'ion' && item.id === removed.id) {
            // drop it
          } else if (item.kind === 'molecule') {
            const hasMember = item.members?.some((m) => m.id === removed.id)
            if (hasMember) {
              // Explode molecule, keep survivors
              const survivors = item.members.filter((m) => m.id !== removed.id)
              survivors.forEach((m, i) => {
                newRi.push({
                  id: m.id,
                  kind: 'ion',
                  x: item.x + (i - survivors.length / 2) * 70,
                  y: item.y + i * 18,
                  symbol: m.symbol,
                  symbolHTML: m.symbolHTML,
                  charge: m.charge,
                  color: m.color,
                })
              })
            } else {
              newRi.push(item)
            }
          } else {
            newRi.push(item)
          }
        }
        return newRi
      })

      setSubmitResult(null)
      return next
    })
  }

  // Bottom-left drag
  const handleLeftMove = useCallback((id, x, y) => {
    setLeftPositions((prev) => ({ ...prev, [id]: { x, y } }))
  }, [])

  // Bottom-right drag
  const handleRightMove = useCallback((id, x, y) => {
    setRightItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item))
    )
  }, [])

  // Bottom-right drop — check for snap-to-combine
  const handleRightDrop = useCallback((droppedId, x, y) => {
    setRightItems((prev) => {
      const dropped = prev.find((i) => i.id === droppedId)
      if (!dropped) return prev

      const target = prev.find((item) => {
        if (item.id === droppedId) return false
        return dist(x, y, item.x, item.y) < SNAP_DISTANCE
      })

      if (!target) {
        return prev.map((i) => (i.id === droppedId ? { ...i, x, y } : i))
      }

      // Merge all members from both items
      const allMembers = [...getMembers(dropped), ...getMembers(target)]
      const { formulaHTML, netCharge, ions } = buildMoleculeFromMembers(allMembers)

      const newMolecule = {
        id: uid(),
        kind: 'molecule',
        x: target.x,
        y: target.y,
        members: allMembers,
        ions,
        formulaHTML,
        netCharge,
        state: '',
      }

      return [
        ...prev.filter((i) => i.id !== droppedId && i.id !== target.id),
        newMolecule,
      ]
    })
    setSubmitResult(null)
  }, [])

  // Click on molecule → break apart into individual ions
  const handleBreakMolecule = useCallback((molId) => {
    setRightItems((prev) => {
      const mol = prev.find((i) => i.id === molId)
      if (!mol || mol.kind !== 'molecule') return prev
      const freed = mol.members.map((m, i) => ({
        id: m.id,
        kind: 'ion',
        x: mol.x + (i - (mol.members.length - 1) / 2) * 68,
        y: mol.y + (i % 2 === 0 ? -20 : 20),
        symbol: m.symbol,
        symbolHTML: m.symbolHTML,
        charge: m.charge,
        color: m.color,
      }))
      return [...prev.filter((i) => i.id !== molId), ...freed]
    })
    setSubmitResult(null)
  }, [])

  function handleProductStateChange(formulaHTML, state) {
    setProductStates((prev) => ({ ...prev, [formulaHTML]: state }))
  }

  function handleReactionChange(idx) {
    setReactionIdx(idx)
    setSelectedCharges({ c1cation: null, c1anion: null, c2cation: null, c2anion: null })
    setAddedIons([])
    setLeftPositions({})
    setRightItems([])
    setProductStates({})
    setSubmitResult(null)
  }

  function handleSubmit() {
    const correct = reaction.correctProducts
    const corrCoeff = reaction.correctReactantCoeff
    const feedback = []
    let allGood = true

    // Check auto-calculated reactant coefficients
    const rc1 = c1Coeff ?? 0
    const rc2 = c2Coeff ?? 0
    if (rc1 !== corrCoeff.c1 || rc2 !== corrCoeff.c2) {
      allGood = false
      feedback.push(
        `Reactant coefficients should be ${corrCoeff.c1} and ${corrCoeff.c2} — adjust how many ions you add.`
      )
    }

    // Check products
    for (const cp of correct) {
      const found = products.find((p) => ionsMatch(p.ions, cp.ions))
      if (!found) {
        allGood = false
        feedback.push(`Missing a product — check your ion combinations.`)
        continue
      }
      if (found.coefficient !== cp.coefficient) {
        allGood = false
        feedback.push(
          `A product's coefficient should be ${cp.coefficient} — try combining more molecules.`
        )
      }
      const chosenState = productStates[found.formulaHTML] || ''
      if (chosenState !== cp.state) {
        allGood = false
        feedback.push(`A product's state should be (${cp.state}).`)
      }
    }

    for (const p of products) {
      if (!correct.some((cp) => ionsMatch(p.ions, cp.ions))) {
        allGood = false
        feedback.push(`An unexpected product was formed — check your combinations.`)
      }
    }

    setSubmitResult({ correct: allGood, feedback })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Replacement Reactions</h1>
        <div className="reaction-selector">
          <label>Reaction:</label>
          <select
            value={reactionIdx}
            onChange={(e) => handleReactionChange(Number(e.target.value))}
          >
            {PRESET_REACTIONS.map((r, i) => (
              <option key={r.id} value={i}>Reaction {i + 1}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="app-grid">
        <TopLeftPanel
          reaction={reaction}
          c1Coeff={c1Coeff}
          c2Coeff={c2Coeff}
          selectedCharges={selectedCharges}
          onSelectCharge={handleSelectCharge}
          addedIons={addedIons}
          onAddIon={handleAddIon}
          onRemoveIon={handleRemoveIon}
        />

        <div className="arrow-column">
          <div className="reaction-arrow-wrapper">
            <span className="reaction-arrow">⟶</span>
          </div>
          <div className="reaction-arrow-wrapper">
            <span className="reaction-arrow">⟶</span>
          </div>
        </div>

        <TopRightPanel
          unlocked={topRightUnlocked}
          products={products}
          productStates={productStates}
          onStateChange={handleProductStateChange}
          onSubmit={handleSubmit}
          submitResult={submitResult}
        />

        <BottomLeftPanel
          unlocked={bottomUnlocked}
          ions={addedIons}
          positions={leftPositions}
          onMove={handleLeftMove}
        />

        <BottomRightPanel
          unlocked={bottomUnlocked}
          items={rightItems}
          onMove={handleRightMove}
          onDrop={handleRightDrop}
          onBreakMolecule={handleBreakMolecule}
        />
      </div>
    </div>
  )
}

function ionsMatch(a, b) {
  if (!a || !b || a.length !== b.length) return false
  const key = (ion) => `${ion.symbol}:${ion.charge}:${ion.count}`
  return [...a].map(key).sort().join('|') === [...b].map(key).sort().join('|')
}
