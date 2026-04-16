export default function BottomLeftPanel({ unlocked, ions, positions, onMove, tutorialHighlighted, tutorialDimmed }) {
  const hl = tutorialHighlighted ? ' tutorial-highlight' : ''
  const dim = tutorialDimmed ? ' tutorial-dimmed' : ''
  return (
    <div className={`panel bottom-left-panel${!unlocked ? ' locked' : ''}${hl}${dim}`}>
      <div className="panel-label">Aqueous Solution — Reactants</div>
      {!unlocked && (
        <div className="locked-overlay">
          <span>Add ions above to populate the solution</span>
        </div>
      )}
      <div className="ion-workspace">
        {ions.map((ion) => {
          const pos = positions[ion.id] || { x: 20, y: 20 }
          return (
            <div
              key={ion.id}
              className="draggable-ion"
              style={{
                left: pos.x,
                top: pos.y,
                backgroundColor: ion.color,
                cursor: 'default',
              }}
              dangerouslySetInnerHTML={{
                __html: buildIonHTML(ion.symbolHTML, ion.charge),
              }}
            />
          )
        })}
      </div>
      <p className="hint-text">
        ② Dissociated ions in aqueous solution.
      </p>
    </div>
  )
}

function buildIonHTML(symbolHTML, charge) {
  if (charge === 0) return symbolHTML
  const sign = charge > 0 ? '+' : '−'
  const abs = Math.abs(charge)
  const sup = abs === 1 ? sign : `${abs}${sign}`
  return `${symbolHTML}<sup>${sup}</sup>`
}
