export default function TutorialModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tutorial-modal" onClick={e => e.stopPropagation()}>
        <div className="tutorial-header">
          <h2>How to Use Replacement Reactions</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="tutorial-body">
          <ol className="tutorial-steps">

            <li>
              <div className="tutorial-step-title">Choose a Reaction Type</div>
              <p>
                Use the <strong>Single / Double</strong> toggle in the header to switch between
                single replacement (one metal displaces another) and double replacement
                (two ionic compounds swap partners). Then pick a specific reaction from the
                <strong> Reaction</strong> dropdown.
              </p>
            </li>

            <li>
              <div className="tutorial-step-title">Select Ion Charges (Top Left)</div>
              <p>
                Each reactant has dropdowns beneath it for each ion's charge. Select the
                correct charge for every ion — the formula button will turn teal once all
                charges are chosen. In <em>Single Replacement</em>, only the metal's
                ionization charge needs to be selected.
              </p>
            </li>

            <li>
              <div className="tutorial-step-title">Add Formula Units to the Workspace</div>
              <p>
                Click the <strong>teal formula button</strong> to dissociate one formula unit
                into the workspace. The coefficient in front of the formula tracks how many
                units you've added. Click <strong>✕</strong> to remove the last unit if you
                added too many. Add enough formula units so that your ion counts allow you to
                build balanced products.
              </p>
            </li>

            <li>
              <div className="tutorial-step-title">Aqueous Ions (Bottom Left)</div>
              <p>
                The bottom-left panel shows all dissociated ions in aqueous solution —
                one colored tile per ion. This is a reference display; you'll do your work
                in the panel to the right.
              </p>
            </li>

            <li>
              <div className="tutorial-step-title">Combine Ions into Molecules (Bottom Right)</div>
              <p>
                Drag any ion tile close to another and they will <strong>snap together</strong>
                to form a molecule. Keep dragging ions onto that molecule to build larger
                compounds. The formula and net charge are shown on the combined tile.
              </p>
            </li>

            <li>
              <div className="tutorial-step-title">Break a Molecule Apart</div>
              <p>
                Changed your mind? <strong>Click</strong> any molecule (without dragging)
                and it will pop back into its individual ions so you can recombine them
                differently.
              </p>
            </li>

            <li>
              <div className="tutorial-step-title">Balance the Equation</div>
              <p>
                Form enough molecules so that <em>every ion you added has been used</em>.
                If the counts don't work out, go back and add or remove formula units
                (step 3) until the coefficients balance.
              </p>
            </li>

            <li>
              <div className="tutorial-step-title">Select States of Matter (Top Right)</div>
              <p>
                Each product that appears in the top-right panel needs a state of matter.
                Use the dropdown next to each formula to choose <strong>(aq)</strong>,
                <strong> (s)</strong>, <strong>(l)</strong>, or <strong>(g)</strong>.
                Solid metals produced in single replacement are automatically labeled (s).
                Use the <strong>Solubility Table</strong> or <strong>Activity Series</strong>
                button for reference.
              </p>
            </li>

            <li>
              <div className="tutorial-step-title">Submit Your Answer</div>
              <p>
                Click <strong>Submit</strong> when you're happy with your products and
                states. If the reaction doesn't actually occur, click <strong>NR</strong>
                (No Reaction) instead. Feedback will appear telling you what to fix or
                confirming a correct answer. Use <strong>Next →</strong> to move on.
              </p>
            </li>

          </ol>
        </div>

        <div className="tutorial-footer">
          <button className="submit-btn" onClick={onClose}>Got it — let's go!</button>
        </div>
      </div>
    </div>
  )
}
