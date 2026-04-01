import { useRef, useCallback } from 'react'

export default function BottomLeftPanel({ unlocked, ions, positions, onMove }) {
  const panelRef = useRef(null)
  const dragging = useRef(null)

  const handlePointerDown = useCallback((e, id) => {
    if (!unlocked) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = panelRef.current.getBoundingClientRect()
    const pos = positions[id] || { x: 0, y: 0 }
    dragging.current = {
      id,
      offsetX: e.clientX - rect.left - pos.x,
      offsetY: e.clientY - rect.top - pos.y,
    }
  }, [unlocked, positions])

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return
    const rect = panelRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragging.current.offsetX
    const y = e.clientY - rect.top - dragging.current.offsetY
    onMove(dragging.current.id, x, y)
  }, [onMove])

  const handlePointerUp = useCallback(() => {
    dragging.current = null
  }, [])

  return (
    <div className={`panel bottom-left-panel ${!unlocked ? 'locked' : ''}`}>
      <div className="panel-label">Aqueous Solution — Reactants</div>
      {!unlocked && (
        <div className="locked-overlay">
          <span>Add ions above to populate the solution</span>
        </div>
      )}
      <div
        ref={panelRef}
        className="ion-workspace"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
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
                cursor: 'grab',
              }}
              onPointerDown={(e) => handlePointerDown(e, ion.id)}
              dangerouslySetInnerHTML={{
                __html: buildIonHTML(ion.symbolHTML, ion.charge),
              }}
            />
          )
        })}
      </div>
      <p className="hint-text">
        ② These are your dissociated ions. Drag them to rearrange.
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
