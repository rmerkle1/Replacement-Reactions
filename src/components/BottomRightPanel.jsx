import { useRef, useCallback } from 'react'

const DRAG_THRESHOLD = 6 // px — below this counts as a click, not a drag

export default function BottomRightPanel({
  unlocked,
  items,
  onMove,
  onDrop,
  onBreakMolecule,
}) {
  const panelRef = useRef(null)
  const dragging = useRef(null)

  const handlePointerDown = useCallback(
    (e, id) => {
      if (!unlocked) return
      e.stopPropagation()
      e.currentTarget.setPointerCapture(e.pointerId)
      const rect = panelRef.current.getBoundingClientRect()
      const item = items.find((i) => i.id === id)
      if (!item) return
      dragging.current = {
        id,
        offsetX: e.clientX - rect.left - item.x,
        offsetY: e.clientY - rect.top - item.y,
        startClientX: e.clientX,
        startClientY: e.clientY,
        moved: false,
      }
    },
    [unlocked, items]
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging.current) return
      const dx = Math.abs(e.clientX - dragging.current.startClientX)
      const dy = Math.abs(e.clientY - dragging.current.startClientY)
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        dragging.current.moved = true
      }
      if (!dragging.current.moved) return
      const rect = panelRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - dragging.current.offsetX
      const y = e.clientY - rect.top - dragging.current.offsetY
      onMove(dragging.current.id, x, y)
    },
    [onMove]
  )

  const handlePointerUp = useCallback(
    (e) => {
      if (!dragging.current) return
      const { id, moved, offsetX, offsetY } = dragging.current

      if (!moved) {
        // Treat as a click — break molecule if applicable
        const item = items.find((i) => i.id === id)
        if (item?.kind === 'molecule') {
          onBreakMolecule(id)
        }
      } else {
        const rect = panelRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - offsetX
        const y = e.clientY - rect.top - offsetY
        onDrop(id, x, y)
      }
      dragging.current = null
    },
    [items, onDrop, onBreakMolecule]
  )

  return (
    <div className={`panel bottom-right-panel ${!unlocked ? 'locked' : ''}`}>
      <div className="panel-label">Product Formation</div>
      {!unlocked && (
        <div className="locked-overlay">
          <span>Add ions above to begin forming products</span>
        </div>
      )}
      <div
        ref={panelRef}
        className="ion-workspace"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {items.map((item) =>
          item.kind === 'ion' ? (
            <SingleIon key={item.id} item={item} onPointerDown={handlePointerDown} />
          ) : (
            <MoleculeItem key={item.id} item={item} onPointerDown={handlePointerDown} />
          )
        )}
      </div>
      <p className="hint-text">
        ③ Drag ions together to snap them into molecules. Click a molecule to break it apart.
      </p>
    </div>
  )
}

function SingleIon({ item, onPointerDown }) {
  return (
    <div
      className="draggable-ion"
      style={{ left: item.x, top: item.y, backgroundColor: item.color }}
      onPointerDown={(e) => onPointerDown(e, item.id)}
      dangerouslySetInnerHTML={{ __html: ionHTML(item.symbolHTML, item.charge) }}
    />
  )
}

function MoleculeItem({ item, onPointerDown }) {
  const isNeutral = item.netCharge === 0
  return (
    <div
      className={`draggable-molecule ${isNeutral ? 'molecule-neutral' : 'molecule-charged'}`}
      style={{ left: item.x, top: item.y }}
      onPointerDown={(e) => onPointerDown(e, item.id)}
      title="Click to break apart"
    >
      <span dangerouslySetInnerHTML={{ __html: item.formulaHTML }} />
      {!isNeutral && (
        <span className="molecule-charge-badge">
          {item.netCharge > 0 ? `+${item.netCharge}` : item.netCharge}
        </span>
      )}
    </div>
  )
}

function ionHTML(symbolHTML, charge) {
  if (charge === 0) return symbolHTML
  const sign = charge > 0 ? '+' : '−'
  const abs = Math.abs(charge)
  return `${symbolHTML}<sup>${abs === 1 ? sign : abs + sign}</sup>`
}
