import { useState, useCallback } from 'react'
import { PRESET_REACTIONS } from './data/chemistry.js'
import { uid, deriveProducts, buildMolecule, mergeItems, dist } from './utils/chemUtils.js'
import TopLeftPanel from './components/TopLeftPanel.jsx'
import BottomLeftPanel from './components/BottomLeftPanel.jsx'
import BottomRightPanel from './components/BottomRightPanel.jsx'
import TopRightPanel from './components/TopRightPanel.jsx'
import './App.css'

const SNAP_DISTANCE = 64 // px, center-to-center

export default function App() {
  const [reactionIdx, setReactionIdx] = useState(0)
  const reaction = PRESET_REACTIONS[reactionIdx]

  // Coefficients for the two reactants (user-entered)
  const [reactantCoeff, setReactantCoeff] = useState({ c1: '', c2: '' })

  // Selected charges from the four dropdowns: null | number
  const [selectedCharges, setSelectedCharges] = useState({
    c1cation: null, c1anion: null,
    c2cation: null, c2anion: null,
  })

  // Master list of added ions (each ion added by the user creates an entry here)
  // { id, ionKey, symbol, symbolHTML, charge, color }
  const [addedIons, setAddedIons] = useState([])

  // Positions in the bottom-left panel: { [ionId]: { x, y } }
  const [leftPositions, setLeftPositions] = useState({})

  // Items in the bottom-right panel
  // Each item: { id, kind:'ion'|'molecule', x, y, ...ionOrMoleculeData }
  const [rightItems, setRightItems] = useState([])

  // State-of-matter for products: { [formulaHTML]: 'aq'|'s'|'l'|'g' }
  const [productStates, setProductStates] = useState({})

  // Submit feedback
  const [submitResult, setSubmitResult] = useState(null) // null | 'correct' | 'incorrect' | {feedback}

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const bottomUnlocked = addedIons.length > 0
  const products = deriveProducts(rightItems)
  const topRightUnlocked = products.length > 0

  // ─── Handlers ────────────────────────────────────────────────────────────────

  function handleSelectCharge(ionKey, charge) {
    setSelectedCharges((prev) => ({ ...prev, [ionKey]: charge }))
    setSubmitResult(null)
  }

  function handleAddIon(ionKey, ionData) {
    const id = uid()
    const newIon = { id, ionKey, ...ionData }
    setAddedIons((prev) => [...prev, newIon])

    // Random start position in each panel (will be overridden if panel is smaller)
    const randPos = () => ({
      x: 60 + Math.random() * 240,
      y: 40 + Math.random() * 140,
    })
    setLeftPositions((prev) => ({ ...prev, [id]: randPos() }))
    const rp = randPos()
    setRightItems((prev) => [
      ...prev,
      { id, kind: 'ion', x: rp.x, y: rp.y, ...ionData },
    ])
    setSubmitResult(null)
  }

  function handleRemoveIon(ionKey) {
    // Remove the most recently added ion of this ionKey
    setAddedIons((prev) => {
      const idx = [...prev].reverse().findIndex((i) => i.ionKey === ionKey)
      if (idx === -1) return prev
      const realIdx = prev.length - 1 - idx
      const removed = prev[realIdx]
      const next = [...prev]
      next.splice(realIdx, 1)

      // Clean up positions
      setLeftPositions((lp) => {
        const copy = { ...lp }
        delete copy[removed.id]
        return copy
      })

      // Remove from right panel — if it's part of a molecule, break the molecule
      setRightItems((ri) => {
        // Find the item containing this ion id
        const newRi = []
        for (const item of ri) {
          if (item.kind === 'ion' && item.id === removed.id) {
            // skip (remove it)
          } else if (item.kind === 'molecule') {
            // Check if this molecule contains the removed ion by id
            const hasMember = item.memberIds?.includes(removed.id)
            if (hasMember) {
              // Explode the molecule back into individual ions minus the removed one
              const survivors = item.memberIds.filter((mid) => mid !== removed.id)
              survivors.forEach((mid, i) => {
                const src = item.ions.find((ion) => ion._id === mid)
                if (src) {
                  newRi.push({
                    id: mid,
                    kind: 'ion',
                    x: item.x + i * 70,
                    y: item.y + i * 20,
                    symbol: src.symbol,
                    symbolHTML: src.symbolHTML,
                    charge: src.charge,
                    color: src.color,
                  })
                }
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

  // Bottom-right drag + snap
  const handleRightMove = useCallback((id, x, y) => {
    setRightItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item))
    )
  }, [])

  const handleRightDrop = useCallback((droppedId, x, y) => {
    setRightItems((prev) => {
      // Find the dropped item
      const dropped = prev.find((i) => i.id === droppedId)
      if (!dropped) return prev

      // Check for a nearby item to snap to
      const target = prev.find((item) => {
        if (item.id === droppedId) return false
        return dist(x, y, item.x, item.y) < SNAP_DISTANCE
      })

      if (!target) {
        // Just update position
        return prev.map((i) => (i.id === droppedId ? { ...i, x, y } : i))
      }

      // Merge dropped + target
      const mergedIons = mergeItems(dropped, target)
      const { formulaHTML, netCharge } = buildMolecule(mergedIons)

      // Gather all member ids
      const droppedIds = dropped.memberIds ?? [dropped.id]
      const targetIds = target.memberIds ?? [target.id]
      const memberIds = [...droppedIds, ...targetIds]

      // Tag each ion with its _id for later breakout
      const taggedIons = mergedIons.map((ion, i) => ({ ...ion, _id: memberIds[i] }))

      const newMolecule = {
        id: uid(),
        kind: 'molecule',
        x: target.x,
        y: target.y,
        ions: taggedIons,
        memberIds,
        formulaHTML,
        netCharge,
        state: '',
      }

      const remaining = prev.filter(
        (i) => i.id !== droppedId && i.id !== target.id
      )
      return [...remaining, newMolecule]
    })
    setSubmitResult(null)
  }, [])

  // Break a molecule apart by double-clicking it
  const handleBreakMolecule = useCallback((molId) => {
    setRightItems((prev) => {
      const mol = prev.find((i) => i.id === molId)
      if (!mol || mol.kind !== 'molecule') return prev
      const freed = mol.ions.map((ion, i) => ({
        id: ion._id || uid(),
        kind: 'ion',
        x: mol.x + (i - mol.ions.length / 2) * 70,
        y: mol.y + i * 20,
        symbol: ion.symbol,
        symbolHTML: ion.symbolHTML,
        charge: ion.charge,
        color: ion.color,
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
    setReactantCoeff({ c1: '', c2: '' })
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

    // Check reactant coefficients
    const rc1 = parseInt(reactantCoeff.c1) || 1
    const rc2 = parseInt(reactantCoeff.c2) || 1
    if (rc1 !== corrCoeff.c1 || rc2 !== corrCoeff.c2) {
      allGood = false
      feedback.push(`Reactant coefficients should be ${corrCoeff.c1} and ${corrCoeff.c2}.`)
    }

    // Check products: every correct product must appear with right coefficient and state
    for (const cp of correct) {
      const found = products.find((p) => {
        // Compare by checking that the ion sets match (symbol + charge + count)
        return ionsMatch(p.ions, cp.ions)
      })
      if (!found) {
        allGood = false
        feedback.push(`Missing product: <span style="font-family:serif" dangerouslySetInnerHTML not available — see below">` + cp.formulaHTML + `</span>`)
        continue
      }
      if (found.coefficient !== cp.coefficient) {
        allGood = false
        feedback.push(`Coefficient for a product should be ${cp.coefficient}.`)
      }
      const chosenState = productStates[found.formulaHTML] || ''
      if (chosenState !== cp.state) {
        allGood = false
        feedback.push(`State for a product should be (${cp.state}).`)
      }
    }

    // Check for extra products not in the correct list
    for (const p of products) {
      const isExpected = correct.some((cp) => ionsMatch(p.ions, cp.ions))
      if (!isExpected) {
        allGood = false
        feedback.push(`An unexpected product was formed — check your ion combinations.`)
      }
    }

    setSubmitResult({ correct: allGood, feedback })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Replacement Reactions</h1>
        <div className="reaction-selector">
          <label>Reaction: </label>
          <select value={reactionIdx} onChange={(e) => handleReactionChange(Number(e.target.value))}>
            {PRESET_REACTIONS.map((r, i) => (
              <option key={r.id} value={i}>Reaction {i + 1}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="app-grid">
        {/* ── Top Left ── */}
        <TopLeftPanel
          reaction={reaction}
          reactantCoeff={reactantCoeff}
          onCoeffChange={(key, val) => setReactantCoeff((p) => ({ ...p, [key]: val }))}
          selectedCharges={selectedCharges}
          onSelectCharge={handleSelectCharge}
          addedIons={addedIons}
          onAddIon={handleAddIon}
          onRemoveIon={handleRemoveIon}
        />

        {/* ── Center arrows ── */}
        <div className="arrow-column">
          <div className="reaction-arrow-wrapper top">
            <span className="reaction-arrow">⟶</span>
          </div>
          <div className="reaction-arrow-wrapper bottom">
            <span className="reaction-arrow">⟶</span>
          </div>
        </div>

        {/* ── Top Right ── */}
        <TopRightPanel
          unlocked={topRightUnlocked}
          products={products}
          productStates={productStates}
          onStateChange={handleProductStateChange}
          onSubmit={handleSubmit}
          submitResult={submitResult}
        />

        {/* ── Bottom Left ── */}
        <BottomLeftPanel
          unlocked={bottomUnlocked}
          ions={addedIons}
          positions={leftPositions}
          onMove={handleLeftMove}
        />

        {/* ── Bottom Right ── */}
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

// ─── helpers ─────────────────────────────────────────────────────────────────

function ionsMatch(a, b) {
  if (!a || !b || a.length !== b.length) return false
  const sortKey = (ion) => `${ion.symbol}:${ion.charge}:${ion.count}`
  const sa = [...a].map(sortKey).sort().join('|')
  const sb = [...b].map(sortKey).sort().join('|')
  return sa === sb
}
