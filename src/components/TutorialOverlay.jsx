// ── Step definitions ─────────────────────────────────────────────────────────
// highlight: 'header'|'top-left'|'top-right'|'bottom-left'|'bottom-right'|'action'|null
// dimOthers: true → all panels except the highlighted one are greyed out
// advanceOn(appState): returns true when step is complete (null = manual Next button)
// dynamicBody(appState): optional fn returning override text for live feedback

export const TUTORIAL_STEPS = [
  {
    id: 'intro',
    highlight: null,
    dimOthers: false,
    title: "Let's balance a reaction!",
    body: "This tutorial walks you through completing a double replacement reaction step by step. Follow the glowing areas — the tutorial advances automatically as you complete each action.",
    advanceOn: null,
  },
  {
    id: 'mode',
    highlight: 'mode-switch',
    dimOthers: false,
    title: "Double Replacement Mode",
    body: 'This tutorial uses double replacement reactions. The "Double" toggle is already selected — just take a look at the header, then click Next.',
    advanceOn: null,
  },
  {
    id: 'charges',
    highlight: 'top-left',
    dimOthers: false,
    title: "Select Ion Charges",
    body: 'Use the dropdowns beneath each formula to pick the charge carried by every ion. The molecular formula will turn yellow once all charges are set.',
    advanceOn: s => s.reactionType === 'double'
      ? s.c1cation !== null && s.c1anion !== null && s.c2cation !== null && s.c2anion !== null
      : s.metalcharge !== null && s.c2cation !== null && s.c2anion !== null,
  },
  {
    id: 'check-ions',
    highlight: 'top-left',
    dimOthers: false,
    title: "Check Your Ion Charges",
    body: 'Click the "Check Ions" button to verify your selections. Green = correct, pink = wrong. Fix any pink dropdowns and click Check Ions again.',
    advanceOn: s => {
      if (!s.ionCheckResult) return false
      const vals = Object.values(s.ionCheckResult)
      return vals.length > 0 && vals.every(v => v === 'correct')
    },
    dynamicBody: s => {
      if (!s.ionCheckResult) return null
      if (Object.values(s.ionCheckResult).some(v => v === 'incorrect')) {
        return '⚠ Some charges are wrong. Fix the pink dropdowns and click "Check Ions" again.'
      }
      return null
    },
  },
  {
    id: 'add-first',
    highlight: 'top-left',
    dimOthers: false,
    title: "Add Formula Units",
    body: 'Click on the molecular formula boxed in yellow for each compound to add a formula unit to the workspace. Make sure you click both formulas at least once.',
    advanceOn: s => s.addedIons.some(i => i.ionKey === 'c1cation') && s.addedIons.some(i => i.ionKey === 'c2cation'),
  },
  {
    id: 'balance-units',
    highlight: 'top-left',
    dimOthers: false,
    title: "Balance the Reactant Ratio",
    body: 'This reaction needs 2 units of NaI for every 1 unit of Pb(NO\u2083)\u2082. Click the NaI formula again to add a second unit — watch the coefficient box change to 2.',
    advanceOn: s => s.c1Coeff === 2 && s.c2Coeff === 1,
    dynamicBody: s => {
      if (s.c1Coeff === 2 && s.c2Coeff === 1) return null
      if ((s.c1Coeff ?? 0) > 2) return '⚠ Too many NaI units added. Click ✕ next to NaI to remove the extra.'
      if ((s.c2Coeff ?? 0) > 1) return '⚠ Only 1 Pb(NO\u2083)\u2082 unit is needed. Click ✕ next to it to remove the extra.'
      return null
    },
  },
  {
    id: 'aqueous-ions',
    highlight: 'bottom-left',
    dimOthers: true,
    title: "Ions in Solution",
    body: 'These colored tiles show all your dissociated ions in aqueous solution. This panel is for reference — your product-building happens in the panel to the right.',
    advanceOn: null,
  },
  {
    id: 'combine',
    highlight: 'bottom-right',
    dimOthers: true,
    title: "Form Molecules",
    body: 'Drag ion tiles close together in this workspace — they will snap into a molecule. Click any formed molecule to break it apart and try a different combination. Combine all ions before continuing.',
    advanceOn: s => {
      if (s.rightItems.length === 0) return false
      return s.rightItems.every(i => i.kind === 'molecule' || (i.kind === 'ion' && i.isNeutralSolid))
    },
  },
  {
    id: 'states',
    highlight: 'top-right',
    dimOthers: true,
    title: "Select States of Matter",
    body: 'Products appear here as you form molecules. Use the dropdown next to each formula to choose its state: (aq), (s), (l), or (g). Set both products before continuing.',
    advanceOn: s => {
      if (!s.products || s.products.length < 2) return false
      return s.products.every(p => s.productStates[p.formulaHTML] && s.productStates[p.formulaHTML] !== '')
    },
    dynamicBody: s => {
      if (!s.products || s.products.length === 0) return null
      const missing = s.products.filter(p => !s.productStates[p.formulaHTML] || s.productStates[p.formulaHTML] === '')
      if (missing.length > 0) return `Select a state for all ${s.products.length} products to continue.`
      return null
    },
  },
  {
    id: 'check-reaction',
    highlight: 'action',
    dimOthers: false,
    title: "Check Your Answer",
    body: 'Click "Check Reaction" to see if your equation is balanced and all states are correct. If the reaction doesn\'t occur at all, click "No Reaction" instead.',
    advanceOn: s => s.submitResult !== null,
  },
  {
    id: 'complete',
    highlight: null,
    dimOthers: false,
    title: "Tutorial Complete!",
    body: 'You balanced a double replacement reaction! Click "Next →" for a new problem, or "Reset" to redo this one. The "?" button reopens this tutorial anytime.',
    advanceOn: null,
    isLast: true,
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function TutorialOverlay({ stepIndex, totalSteps, appState, onAdvance, onExit }) {
  const step = TUTORIAL_STEPS[stepIndex]
  if (!step) return null

  const isLast = !!step.isLast
  const isManual = step.advanceOn === null
  const dynamicBody = step.dynamicBody?.(appState) ?? null
  const displayBody = dynamicBody ?? step.body
  const progressPct = ((stepIndex + 1) / totalSteps) * 100
  const hasWarning = !!dynamicBody

  return (
    <div className="tutorial-card">
      {/* Progress bar */}
      <div className="tutorial-card-progress-track">
        <div className="tutorial-card-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Header row */}
      <div className="tutorial-card-header">
        <span className="tutorial-card-step-num">Step {stepIndex + 1} of {totalSteps}</span>
        <button className="tutorial-card-exit-btn" onClick={onExit}>✕ Exit</button>
      </div>

      {/* Content */}
      <div className="tutorial-card-title">{step.title}</div>
      <div className={`tutorial-card-body${hasWarning ? ' tutorial-card-body-warn' : ''}`}>
        {displayBody}
      </div>

      {/* Footer */}
      <div className="tutorial-card-footer">
        {isManual ? (
          isLast ? (
            <button className="tutorial-card-btn" onClick={onExit}>
              Done — let's go! →
            </button>
          ) : (
            <button className="tutorial-card-btn" onClick={onAdvance}>
              Got it — Next →
            </button>
          )
        ) : (
          <span className="tutorial-card-waiting">
            {hasWarning ? '↑ Fix errors above to continue' : '↑ Complete the action above to continue'}
          </span>
        )}
      </div>
    </div>
  )
}
