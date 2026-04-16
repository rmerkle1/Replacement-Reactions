import { useState } from 'react'

// Mini panel diagram: which quadrant(s) to highlight per step
// Values: 'header' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'both-right' | 'all'
function PanelDiagram({ highlight }) {
  const hlRight = (name) => highlight === name || highlight === 'both-right' || highlight === 'all'
    ? 'diagram-cell active' : 'diagram-cell'
  const hlLeft = (name) => highlight === name || highlight === 'both-left' || highlight === 'all'
    ? 'diagram-cell active' : 'diagram-cell'

  return (
    <div className="panel-diagram">
      {highlight === 'header' ? (
        <div className="diagram-header active">Header bar</div>
      ) : (
        <div className="diagram-header">Header bar</div>
      )}
      <div className="diagram-grid">
        <div className={hlLeft('top-left')}>Top Left<br /><span>Reactants &amp; charges</span></div>
        <div className="diagram-arrow">⟶</div>
        <div className={hlRight('top-right')}>Top Right<br /><span>Products</span></div>
        <div className={hlLeft('bottom-left')}>Bottom Left<br /><span>Aqueous ions</span></div>
        <div className="diagram-arrow">⟶</div>
        <div className={hlRight('bottom-right')}>Bottom Right<br /><span>Workspace</span></div>
      </div>
    </div>
  )
}

const STEPS = [
  {
    title: 'Choose a Reaction Type',
    highlight: 'header',
    content: (
      <>
        <p>
          Use the <strong>Single / Double</strong> toggle in the header to switch between
          single replacement (one metal displaces another) and double replacement
          (two ionic compounds swap partners).
        </p>
        <p>
          Then pick a specific reaction from the <strong>Reaction</strong> dropdown in the header.
        </p>
      </>
    ),
  },
  {
    title: 'Select Ion Charges',
    highlight: 'top-left',
    content: (
      <>
        <p>
          Each reactant has charge dropdowns beneath its formula. Select the correct
          charge for every ion — the formula button will turn <strong>amber</strong> once
          all charges are chosen.
        </p>
        <p>
          In <em>Single Replacement</em>, only the metal's ionization charge needs to be selected.
        </p>
      </>
    ),
  },
  {
    title: 'Add Formula Units to the Workspace',
    highlight: 'top-left',
    content: (
      <>
        <p>
          Click the <strong>amber formula button</strong> to dissociate one formula unit
          into the workspace. The coefficient tracks how many units you've added.
        </p>
        <p>
          Click <strong>✕</strong> to remove the last unit if you added too many.
          Add enough formula units so your ion counts let you build balanced products.
        </p>
      </>
    ),
  },
  {
    title: 'Aqueous Ions (Reference)',
    highlight: 'bottom-left',
    content: (
      <>
        <p>
          The bottom-left panel shows all dissociated ions in aqueous solution —
          one colored tile per ion.
        </p>
        <p>
          This is a <strong>reference display</strong> only. Your hands-on work happens
          in the panel to the right.
        </p>
      </>
    ),
  },
  {
    title: 'Combine Ions into Molecules',
    highlight: 'bottom-right',
    content: (
      <>
        <p>
          The bottom-right panel is your workspace. <strong>Drag</strong> any ion tile
          close to another and they will <strong>snap together</strong> to form a molecule.
        </p>
        <p>
          Keep dragging more ions onto that molecule to build larger compounds.
          The formula and net charge are shown on the combined tile.
        </p>
      </>
    ),
  },
  {
    title: 'Break a Molecule Apart',
    highlight: 'bottom-right',
    content: (
      <>
        <p>
          Changed your mind? <strong>Click</strong> any molecule (without dragging) and
          it will pop back into its individual ions.
        </p>
        <p>
          You can then recombine them differently to get the product you want.
        </p>
      </>
    ),
  },
  {
    title: 'Balance the Equation',
    highlight: 'both-left',
    content: (
      <>
        <p>
          Form enough molecules so that <em>every ion you added has been used</em>.
          The coefficient boxes in the top-left update automatically as you add units.
        </p>
        <p>
          If the counts don't work out, go back to step 3 and add or remove formula
          units until the coefficients balance.
        </p>
      </>
    ),
  },
  {
    title: 'Select States of Matter',
    highlight: 'top-right',
    content: (
      <>
        <p>
          Each product that appears in the top-right panel needs a state of matter.
          Use the dropdown next to each formula to choose{' '}
          <strong>(aq)</strong>, <strong>(s)</strong>, <strong>(l)</strong>, or <strong>(g)</strong>.
        </p>
        <p>
          Use the <strong>Solubility Table</strong> or <strong>Activity Series</strong> buttons
          for reference. Solid metals in single replacement are labeled (s) automatically.
        </p>
      </>
    ),
  },
  {
    title: 'Submit Your Answer',
    highlight: 'top-right',
    content: (
      <>
        <p>
          Click <strong>Submit</strong> when you're happy with your products and states.
          If the reaction doesn't actually occur, click <strong>NR</strong> (No Reaction) instead.
        </p>
        <p>
          Feedback will appear telling you what to fix or confirming a correct answer.
          Use <strong>Next →</strong> to move on to the next reaction.
        </p>
      </>
    ),
  },
]

export default function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0)
  const total = STEPS.length
  const current = STEPS[step]
  const isLast = step === total - 1

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tutorial-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="tutorial-header">
          <h2>How to Use Replacement Reactions</h2>
          <div className="tutorial-step-counter">{step + 1} / {total}</div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* ── Progress bar ── */}
        <div className="tutorial-progress-track">
          <div
            className="tutorial-progress-fill"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>

        {/* ── Body ── */}
        <div className="tutorial-body">
          <PanelDiagram highlight={current.highlight} />
          <div className="tutorial-step-content">
            <div className="tutorial-step-title">{current.title}</div>
            <div className="tutorial-step-text">{current.content}</div>
          </div>
        </div>

        {/* ── Footer / Navigation ── */}
        <div className="tutorial-footer">
          <button
            className="tutorial-nav-btn"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            ← Back
          </button>

          <div className="tutorial-dots">
            {STEPS.map((_, i) => (
              <button
                key={i}
                className={`tutorial-dot ${i === step ? 'active' : ''}`}
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {isLast ? (
            <button className="submit-btn tutorial-finish-btn" onClick={onClose}>
              Let's go!
            </button>
          ) : (
            <button
              className="tutorial-nav-btn tutorial-nav-next"
              onClick={() => setStep(s => s + 1)}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
