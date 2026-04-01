import { useState } from 'react'
import { PRESET_REACTIONS } from './data/chemistry.js'
import { getIonColor } from './data/chemistry.js'
import {
  uid, deriveProducts, buildMoleculeFromMembers, getMembers,
  dist, autoCoeff, gridPosition, stoichCounts,
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

  // Master ion list: { id, ionKey, symbol, symbolHTML, charge, color }
  const [addedIons, setAddedIons] = useState([])

  // Bottom-left positions: { [ionId]: { x, y } }
  const [leftPositions, setLeftPositions] = useState({})

  // Bottom-right items
  const [rightItems, setRightItems] = useState([])

  // State-of-matter for products
  const [productStates, setProductStates] = useState({})

  const [submitResult, setSubmitResult] = useState(null)

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const bottomUnlocked = addedIons.length > 0
  const products = deriveProducts(rightItems)
  const topRightUnlocked = products.length > 0

  const c1Coeff = autoCoeff(addedIons, 'c1cation',
    reaction.compound1.cation.charge, reaction.compound1.anion.charge)
  const c2Coeff = autoCoeff(addedIons, 'c2cation',
    reaction.compound2.cation.charge, reaction.compound2.anion.charge)

  // ─── Handlers ────────────────────────────────────────────────────────────────

  function handleSelectCharge(ionKey, charge) {
    setSelectedCharges(prev => ({ ...prev, [ionKey]: charge }))
    setSubmitResult(null)
  }

  /**
   * Add one full formula unit of a compound to both bottom panels.
   * Uses correct stoich counts from the compound definition, but
   * applies the student's selected charges.
   */
  function handleAddCompound(compoundKey) {
    const compound = reaction[compoundKey]
    const isC1 = compoundKey === 'compound1'
    const cationKey = isC1 ? 'c1cation' : 'c2cation'
    const anionKey  = isC1 ? 'c1anion'  : 'c2anion'

    const catCharge = selectedCharges[cationKey]
    const aniCharge = selectedCharges[anionKey]
    if (catCharge === null || aniCharge === null) return

    const catColor = getIonColor(catCharge)
    const aniColor = getIonColor(aniCharge)

    const { cation: catStoich, anion: aniStoich } =
      stoichCounts(compound.cation.charge, compound.anion.charge)

    // Build list of individual ions to add (cations then anions)
    const templates = [
      ...Array(catStoich).fill(null).map(() => ({
        ionKey: cationKey,
        symbol: compound.cation.symbol,
        symbolHTML: compound.cation.symbolHTML,
        charge: catCharge,
        color: catColor,
      })),
      ...Array(aniStoich).fill(null).map(() => ({
        ionKey: anionKey,
        symbol: compound.anion.symbol,
        symbolHTML: compound.anion.symbolHTML,
        charge: aniCharge,
        color: aniColor,
      })),
    ]

    const newIons = []
    const newLeftPos = {}
    const newRight = []
    const workingIons = [...addedIons]

    for (const tmpl of templates) {
      const id = uid()
      const ion = { id, ...tmpl }
      const lp = gridPosition(ion.ionKey, workingIons)
      const rp = { x: lp.x + 14, y: lp.y + 12 }
      newIons.push(ion)
      newLeftPos[id] = lp
      newRight.push({ id, kind: 'ion', x: rp.x, y: rp.y, ...tmpl })
      workingIons.push(ion)
    }

    setAddedIons(prev => [...prev, ...newIons])
    setLeftPositions(prev => ({ ...prev, ...newLeftPos }))
    setRightItems(prev => [...prev, ...newRight])
    setSubmitResult(null)
  }

  /**
   * Remove the most recently added formula unit of a compound.
   */
  function handleRemoveCompound(compoundKey) {
    const compound = reaction[compoundKey]
    const isC1 = compoundKey === 'compound1'
    const cationKey = isC1 ? 'c1cation' : 'c2cation'
    const anionKey  = isC1 ? 'c1anion'  : 'c2anion'

    const { cation: catStoich, anion: aniStoich } =
      stoichCounts(compound.cation.charge, compound.anion.charge)

    const cations = addedIons.filter(i => i.ionKey === cationKey)
    const anions  = addedIons.filter(i => i.ionKey === anionKey)

    if (cations.length < catStoich || anions.length < aniStoich) return

    const toRemove = new Set([
      ...cations.slice(-catStoich).map(i => i.id),
      ...anions.slice(-aniStoich).map(i => i.id),
    ])

    setAddedIons(prev => prev.filter(i => !toRemove.has(i.id)))

    setLeftPositions(prev => {
      const copy = { ...prev }
      toRemove.forEach(id => delete copy[id])
      return copy
    })

    setRightItems(prev => {
      const next = []
      for (const item of prev) {
        if (item.kind === 'ion' && toRemove.has(item.id)) {
          // drop
        } else if (item.kind === 'molecule') {
          const removed = item.members.filter(m => toRemove.has(m.id))
          if (removed.length > 0) {
            const survivors = item.members.filter(m => !toRemove.has(m.id))
            survivors.forEach((m, i) => next.push({
              id: m.id, kind: 'ion',
              x: item.x + (i - survivors.length / 2) * 70,
              y: item.y + i * 18,
              symbol: m.symbol, symbolHTML: m.symbolHTML,
              charge: m.charge, color: m.color,
            }))
          } else {
            next.push(item)
          }
        } else {
          next.push(item)
        }
      }
      return next
    })

    setSubmitResult(null)
  }

  // Bottom-left drag
  function handleLeftMove(id, x, y) {
    setLeftPositions(prev => ({ ...prev, [id]: { x, y } }))
  }

  // Bottom-right drag
  function handleRightMove(id, x, y) {
    setRightItems(prev => prev.map(item => item.id === id ? { ...item, x, y } : item))
  }

  // Bottom-right drop — snap to combine
  function handleRightDrop(droppedId, x, y) {
    setRightItems(prev => {
      const dropped = prev.find(i => i.id === droppedId)
      if (!dropped) return prev

      const target = prev.find(item =>
        item.id !== droppedId && dist(x, y, item.x, item.y) < SNAP_DISTANCE
      )

      if (!target) {
        return prev.map(i => i.id === droppedId ? { ...i, x, y } : i)
      }

      const allMembers = [...getMembers(dropped), ...getMembers(target)]
      const { formulaHTML, netCharge, ions } = buildMoleculeFromMembers(allMembers)

      const newMolecule = {
        id: uid(), kind: 'molecule',
        x: target.x, y: target.y,
        members: allMembers, ions,
        formulaHTML, netCharge, state: '',
      }

      return [
        ...prev.filter(i => i.id !== droppedId && i.id !== target.id),
        newMolecule,
      ]
    })
    setSubmitResult(null)
  }

  // Click molecule → break apart
  function handleBreakMolecule(molId) {
    setRightItems(prev => {
      const mol = prev.find(i => i.id === molId)
      if (!mol || mol.kind !== 'molecule') return prev
      const freed = mol.members.map((m, i) => ({
        id: m.id, kind: 'ion',
        x: mol.x + (i - (mol.members.length - 1) / 2) * 68,
        y: mol.y + (i % 2 === 0 ? -22 : 22),
        symbol: m.symbol, symbolHTML: m.symbolHTML,
        charge: m.charge, color: m.color,
      }))
      return [...prev.filter(i => i.id !== molId), ...freed]
    })
    setSubmitResult(null)
  }

  function handleProductStateChange(formulaHTML, state) {
    setProductStates(prev => ({ ...prev, [formulaHTML]: state }))
  }

  function resetReaction(idx) {
    setReactionIdx(idx)
    setSelectedCharges({ c1cation: null, c1anion: null, c2cation: null, c2anion: null })
    setAddedIons([])
    setLeftPositions({})
    setRightItems([])
    setProductStates({})
    setSubmitResult(null)
  }

  function handleNextReaction() {
    resetReaction((reactionIdx + 1) % PRESET_REACTIONS.length)
  }

  function handleSubmit() {
    const correct = reaction.correctProducts
    const corrCoeff = reaction.correctReactantCoeff
    const feedback = []
    let allGood = true

    const rc1 = c1Coeff ?? 0
    const rc2 = c2Coeff ?? 0
    if (rc1 !== corrCoeff.c1 || rc2 !== corrCoeff.c2) {
      allGood = false
      feedback.push(
        `Reactant coefficients should be ${corrCoeff.c1} and ${corrCoeff.c2} — adjust how many formula units you add.`
      )
    }

    for (const cp of correct) {
      const found = products.find(p => ionsMatch(p.ions, cp.ions))
      if (!found) {
        allGood = false
        feedback.push(`Missing a product — check your ion combinations.`)
        continue
      }
      if (found.coefficient !== cp.coefficient) {
        allGood = false
        feedback.push(`A product's coefficient should be ${cp.coefficient}.`)
      }
      const chosenState = productStates[found.formulaHTML] || ''
      if (chosenState !== cp.state) {
        allGood = false
        feedback.push(`A product's state should be (${cp.state}).`)
      }
    }

    for (const p of products) {
      if (!correct.some(cp => ionsMatch(p.ions, cp.ions))) {
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
          <select value={reactionIdx} onChange={e => resetReaction(Number(e.target.value))}>
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
          onAddCompound={handleAddCompound}
          onRemoveCompound={handleRemoveCompound}
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
          onNext={handleNextReaction}
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
  const key = ion => `${ion.symbol}:${ion.charge}:${ion.count}`
  return [...a].map(key).sort().join('|') === [...b].map(key).sort().join('|')
}
