import { useState, useEffect } from 'react'
import { PRESET_REACTIONS, SINGLE_REACTIONS } from './data/chemistry.js'
import { SLOT_COLORS } from './data/chemistry.js'
import {
  uid, deriveProducts, buildMoleculeFromMembers, getMembers,
  dist, autoCoeff, gridPosition, stoichCounts,
} from './utils/chemUtils.js'
import TopLeftPanel from './components/TopLeftPanel.jsx'
import BottomLeftPanel from './components/BottomLeftPanel.jsx'
import BottomRightPanel from './components/BottomRightPanel.jsx'
import TopRightPanel from './components/TopRightPanel.jsx'
import TutorialOverlay, { TUTORIAL_STEPS } from './components/TutorialOverlay.jsx'
import './App.css'

const SNAP_DISTANCE = 64

export default function App() {
  // -1 = not active; 0..N = active step index
  const [tutorialStep, setTutorialStep] = useState(
    () => localStorage.getItem('tutorialSeen') ? -1 : 0
  )
  const tutorialActive = tutorialStep >= 0

  const [reactionType, setReactionType] = useState('double') // 'single' | 'double'
  const [singleIdx, setSingleIdx] = useState(0)
  const [doubleIdx, setDoubleIdx] = useState(0)

  const reactionIdx = reactionType === 'double' ? doubleIdx : singleIdx
  const reactionList = reactionType === 'double' ? PRESET_REACTIONS : SINGLE_REACTIONS
  const reaction = reactionList[reactionIdx]

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
  const [ionCheckResult, setIonCheckResult] = useState(null)

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const bottomUnlocked = addedIons.length > 0
  const products = deriveProducts(rightItems)
  const topRightUnlocked = products.length > 0

  // Coefficients — mode-aware
  let c1Coeff = null
  let c2Coeff = null
  let metalCoeff = null

  if (reactionType === 'double') {
    c1Coeff = autoCoeff(addedIons, 'c1cation',
      reaction.compound1.cation.charge, reaction.compound1.anion.charge)
    c2Coeff = autoCoeff(addedIons, 'c2cation',
      reaction.compound2.cation.charge, reaction.compound2.anion.charge)
  } else {
    metalCoeff = addedIons.filter(i => i.ionKey === 'metalion').length || null
    c2Coeff = autoCoeff(addedIons, 'saltcation',
      reaction.salt.cation.charge, reaction.salt.anion.charge)
  }

  // ─── Handlers ────────────────────────────────────────────────────────────────

  function handleSelectCharge(ionKey, charge) {
    setSelectedCharges(prev => ({ ...prev, [ionKey]: charge }))
    setSubmitResult(null)
    setIonCheckResult(null)
  }

  function handleCheckIons() {
    const result = {}
    if (reactionType === 'double') {
      const { compound1, compound2 } = reaction
      if (selectedCharges.c1cation !== null)
        result.c1cation = selectedCharges.c1cation === compound1.cation.charge ? 'correct' : 'incorrect'
      if (selectedCharges.c1anion !== null)
        result.c1anion = selectedCharges.c1anion === compound1.anion.charge ? 'correct' : 'incorrect'
      if (selectedCharges.c2cation !== null)
        result.c2cation = selectedCharges.c2cation === compound2.cation.charge ? 'correct' : 'incorrect'
      if (selectedCharges.c2anion !== null)
        result.c2anion = selectedCharges.c2anion === compound2.anion.charge ? 'correct' : 'incorrect'
    } else {
      if (selectedCharges.metalcharge !== null)
        result.metalcharge = selectedCharges.metalcharge === reaction.metal.correctCharge ? 'correct' : 'incorrect'
      if (selectedCharges.c2cation !== null)
        result.c2cation = selectedCharges.c2cation === reaction.salt.cation.charge ? 'correct' : 'incorrect'
      if (selectedCharges.c2anion !== null)
        result.c2anion = selectedCharges.c2anion === reaction.salt.anion.charge ? 'correct' : 'incorrect'
    }
    setIonCheckResult(result)
  }

  /**
   * Add one full formula unit of a compound to both bottom panels.
   * Mode-aware for single vs double replacement.
   */
  function handleAddCompound(compoundKey) {
    if (reactionType === 'single') {
      if (compoundKey === 'compound1') {
        // Metal: add a single metal ion
        const metalCharge = selectedCharges['metalcharge']
        if (metalCharge === null) return
        const id = uid()
        const ion = {
          id,
          ionKey: 'metalion',
          symbol: reaction.metal.symbol,
          symbolHTML: reaction.metal.symbolHTML,
          charge: metalCharge,
          color: SLOT_COLORS.metalion,
        }
        const lp = gridPosition('metalion', addedIons)
        const rp = { x: lp.x + 14, y: lp.y + 12 }
        setAddedIons(prev => [...prev, ion])
        setLeftPositions(prev => ({ ...prev, [id]: lp }))
        setRightItems(prev => [...prev, { id, kind: 'ion', x: rp.x, y: rp.y, ionKey: 'metalion', symbol: ion.symbol, symbolHTML: ion.symbolHTML, charge: ion.charge, color: ion.color }])
        setSubmitResult(null)
      } else {
        // Salt (compound2): use saltcation/saltanion keys
        const catCharge = selectedCharges['c2cation']
        const aniCharge = selectedCharges['c2anion']
        if (catCharge === null || aniCharge === null) return

        const salt = reaction.salt
        const { cation: catStoich, anion: aniStoich } = stoichCounts(salt.cation.charge, salt.anion.charge)

        const templates = [
          ...Array(catStoich).fill(null).map(() => ({
            ionKey: 'saltcation',
            symbol: salt.cation.symbol,
            symbolHTML: salt.cation.symbolHTML,
            charge: catCharge,
            color: SLOT_COLORS.saltcation,
          })),
          ...Array(aniStoich).fill(null).map(() => ({
            ionKey: 'saltanion',
            symbol: salt.anion.symbol,
            symbolHTML: salt.anion.symbolHTML,
            charge: aniCharge,
            color: SLOT_COLORS.saltanion,
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
    } else {
      // Double replacement (original behavior)
      const compound = reaction[compoundKey]
      const isC1 = compoundKey === 'compound1'
      const cationKey = isC1 ? 'c1cation' : 'c2cation'
      const anionKey  = isC1 ? 'c1anion'  : 'c2anion'

      const catCharge = selectedCharges[cationKey]
      const aniCharge = selectedCharges[anionKey]
      if (catCharge === null || aniCharge === null) return

      const catColor = SLOT_COLORS[cationKey]
      const aniColor = SLOT_COLORS[anionKey]

      const { cation: catStoich, anion: aniStoich } =
        stoichCounts(compound.cation.charge, compound.anion.charge)

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
  }

  /**
   * Remove the most recently added formula unit of a compound.
   * Mode-aware for single vs double replacement.
   */
  function handleRemoveCompound(compoundKey) {
    if (reactionType === 'single') {
      if (compoundKey === 'compound1') {
        // Remove last metalion
        const metals = addedIons.filter(i => i.ionKey === 'metalion')
        if (metals.length === 0) return
        const toRemove = new Set([metals[metals.length - 1].id])
        _removeIons(toRemove)
      } else {
        // Remove last salt formula unit (saltcation + stoich saltanion)
        const salt = reaction.salt
        const { cation: catStoich, anion: aniStoich } = stoichCounts(salt.cation.charge, salt.anion.charge)
        const cations = addedIons.filter(i => i.ionKey === 'saltcation')
        const anions  = addedIons.filter(i => i.ionKey === 'saltanion')
        if (cations.length < catStoich || anions.length < aniStoich) return
        const toRemove = new Set([
          ...cations.slice(-catStoich).map(i => i.id),
          ...anions.slice(-aniStoich).map(i => i.id),
        ])
        _removeIons(toRemove)
      }
    } else {
      // Double replacement (original behavior)
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
      _removeIons(toRemove)
    }
    setSubmitResult(null)
  }

  function _removeIons(toRemove) {
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

      let updatedItems = [
        ...prev.filter(i => i.id !== droppedId && i.id !== target.id),
        newMolecule,
      ]

      // In single replacement mode, auto-convert free saltcation ions to neutral solid state
      // after a neutral molecule is formed
      if (reactionType === 'single' && netCharge === 0) {
        updatedItems = updatedItems.map(item => {
          if (item.kind === 'ion' && item.ionKey === 'saltcation' && !item.isNeutralSolid) {
            return { ...item, isNeutralSolid: true, charge: 0, color: '#4f5b6f' }
          }
          return item
        })
      }

      return updatedItems
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

  function handleNoReaction() {
    if (reaction.noReaction) {
      setSubmitResult({ correct: true, feedback: [], wasNoReaction: true })
    } else {
      setSubmitResult({ correct: false, feedback: ['This reaction does occur — try completing it instead of selecting No Reaction.'] })
    }
  }

  function resetReaction(idx) {
    if (reactionType === 'double') {
      setDoubleIdx(idx)
      setSelectedCharges({ c1cation: null, c1anion: null, c2cation: null, c2anion: null })
    } else {
      setSingleIdx(idx)
      setSelectedCharges({ metalcharge: null, c2cation: null, c2anion: null })
    }
    setAddedIons([])
    setLeftPositions({})
    setRightItems([])
    setProductStates({})
    setSubmitResult(null)
    setIonCheckResult(null)
  }

  function handleModeSwitch(newMode) {
    setReactionType(newMode)
    if (newMode === 'double') {
      setSelectedCharges({ c1cation: null, c1anion: null, c2cation: null, c2anion: null })
    } else {
      setSelectedCharges({ metalcharge: null, c2cation: null, c2anion: null })
    }
    setAddedIons([])
    setLeftPositions({})
    setRightItems([])
    setProductStates({})
    setSubmitResult(null)
    setIonCheckResult(null)
  }

  function handleNextReaction() {
    if (reactionList.length <= 1) {
      resetReaction(0)
      return
    }
    const options = reactionList.map((_, i) => i).filter(i => i !== reactionIdx)
    resetReaction(options[Math.floor(Math.random() * options.length)])
  }

  function handleReset() {
    resetReaction(reactionIdx)
  }

  function handleSubmit() {
    const correct = reaction.correctProducts
    const corrCoeff = reaction.correctReactantCoeff
    const feedback = []
    let allGood = true

    // If this is a no-reaction case, tell the user to click No Reaction
    if (reaction.noReaction) {
      setSubmitResult({ correct: false, feedback: ['This reaction does not occur — click "No Reaction" instead.'] })
      return
    }

    if (reactionType === 'double') {
      const rc1 = c1Coeff ?? 0
      const rc2 = c2Coeff ?? 0
      if (rc1 !== corrCoeff.c1 || rc2 !== corrCoeff.c2) {
        allGood = false
        feedback.push(
          `Reactant coefficients should be ${corrCoeff.c1} and ${corrCoeff.c2} — adjust how many formula units you add.`
        )
      }
    } else {
      const rm = metalCoeff ?? 0
      const rs = c2Coeff ?? 0
      if (rm !== corrCoeff.metal || rs !== corrCoeff.salt) {
        allGood = false
        feedback.push(
          `Reactant coefficients should be ${corrCoeff.metal} and ${corrCoeff.salt} — adjust how many formula units you add.`
        )
      }
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

  // ─── Tutorial auto-advance ────────────────────────────────────────────────
  const tutorialAppState = {
    reactionType,
    c1cation: selectedCharges.c1cation,
    c1anion: selectedCharges.c1anion,
    c2cation: selectedCharges.c2cation,
    c2anion: selectedCharges.c2anion,
    metalcharge: selectedCharges.metalcharge,
    ionCheckResult,
    addedIons,
    rightItems,
    products,
    productStates,
    submitResult,
    c1Coeff,
    c2Coeff,
  }

  useEffect(() => {
    if (!tutorialActive || tutorialStep >= TUTORIAL_STEPS.length) return
    const step = TUTORIAL_STEPS[tutorialStep]
    if (step.advanceOn && step.advanceOn(tutorialAppState)) {
      setTutorialStep(s => Math.min(s + 1, TUTORIAL_STEPS.length - 1))
    }
  }) // no deps array — runs after every render for reactive advance

  const currentTutorialStep = tutorialActive ? TUTORIAL_STEPS[tutorialStep] : null
  const tutorialHighlight = currentTutorialStep?.highlight ?? null
  const tutorialDimOthers = currentTutorialStep?.dimOthers ?? false

  // Returns true if a named panel should be visually dimmed
  const panelDimmed = (name) => tutorialDimOthers && tutorialHighlight !== name

  function handleTutorialAdvance() {
    setTutorialStep(s => Math.min(s + 1, TUTORIAL_STEPS.length - 1))
  }

  function handleTutorialExit() {
    localStorage.setItem('tutorialSeen', '1')
    setTutorialStep(-1)
  }

  function handleTutorialStart() {
    // Always reset to the tutorial reaction: r1 (NaI + Pb(NO3)2, double replacement)
    setReactionType('double')
    setDoubleIdx(0)
    setSelectedCharges({ c1cation: null, c1anion: null, c2cation: null, c2anion: null })
    setAddedIons([])
    setLeftPositions({})
    setRightItems([])
    setProductStates({})
    setSubmitResult(null)
    setIonCheckResult(null)
    setTutorialStep(0)
  }

  return (
    <div className="app">
      <header className={`app-header${tutorialHighlight === 'header' ? ' tutorial-highlight' : ''}`}>
        <h1>Replacement Reactions</h1>

        <div className={`mode-switch${tutorialHighlight === 'mode-switch' ? ' tutorial-highlight' : ''}`}>
          <button
            className={`mode-switch-btn ${reactionType === 'single' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('single')}
          >Single</button>
          <button
            className={`mode-switch-btn ${reactionType === 'double' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('double')}
          >Double</button>
        </div>

        <button
          className="tutorial-help-btn"
          onClick={handleTutorialStart}
          title="How to use this app"
        >?</button>
      </header>

      <div className="app-grid">
        <TopLeftPanel
          reaction={reaction}
          reactionType={reactionType}
          c1Coeff={c1Coeff}
          c2Coeff={c2Coeff}
          metalCoeff={metalCoeff}
          selectedCharges={selectedCharges}
          onSelectCharge={handleSelectCharge}
          addedIons={addedIons}
          onAddCompound={handleAddCompound}
          onRemoveCompound={handleRemoveCompound}
          ionCheckResult={ionCheckResult}
          onCheckIons={handleCheckIons}
          tutorialHighlighted={tutorialHighlight === 'top-left'}
          tutorialDimmed={panelDimmed('top-left')}
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
          submitResult={submitResult}
          reactionType={reactionType}
          tutorialHighlighted={tutorialHighlight === 'top-right'}
          tutorialDimmed={panelDimmed('top-right')}
        />

        <BottomLeftPanel
          unlocked={bottomUnlocked}
          ions={addedIons}
          positions={leftPositions}
          onMove={handleLeftMove}
          tutorialHighlighted={tutorialHighlight === 'bottom-left'}
          tutorialDimmed={panelDimmed('bottom-left')}
        />

        <BottomRightPanel
          unlocked={bottomUnlocked}
          items={rightItems}
          onMove={handleRightMove}
          onDrop={handleRightDrop}
          onBreakMolecule={handleBreakMolecule}
          tutorialHighlighted={tutorialHighlight === 'bottom-right'}
          tutorialDimmed={panelDimmed('bottom-right')}
        />

        <div className={`action-column${tutorialHighlight === 'action' ? ' tutorial-highlight' : ''}${panelDimmed('action') ? ' tutorial-dimmed' : ''}`}>
          <button className="action-btn action-btn-check" onClick={handleSubmit}>
            Check Reaction
          </button>
          <button className="action-btn action-btn-nr" onClick={handleNoReaction}>
            No Reaction
          </button>
          <div className="action-divider" />
          <button className="action-btn action-btn-next" onClick={handleNextReaction}>
            Next →
          </button>
          <button className="action-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {tutorialActive && (
        <TutorialOverlay
          stepIndex={tutorialStep}
          totalSteps={TUTORIAL_STEPS.length}
          appState={tutorialAppState}
          onAdvance={handleTutorialAdvance}
          onExit={handleTutorialExit}
        />
      )}
    </div>
  )
}

function ionsMatch(a, b) {
  if (!a || !b || a.length !== b.length) return false
  const key = ion => `${ion.symbol}:${ion.charge}:${ion.count}`
  return [...a].map(key).sort().join('|') === [...b].map(key).sort().join('|')
}
