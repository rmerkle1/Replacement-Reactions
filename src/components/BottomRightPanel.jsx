import { useRef, useCallback } from 'react'

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
      }
    },
    [unlocked, items]
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging.current) return
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
      const rect = panelRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - dragging.current.offsetX
      const y = e.clientY - rect.top - dragging.current.offsetY
      onDrop(dragging.current.id, x, y)
      dragging.current = null
    },
    [onDrop]
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
        {items.map((item) => {
          if (item.kind === 'ion') {
            return (
              <SingleIon
                key={item.id}
                item={item}
                onPointerDown={handlePointerDown}
              />
            )
          } else {
            return (
              <MoleculeItem
                key={item.id}
                item={item}
                onPointerDown={handlePointerDown}
                onDoubleClick={onBreakMolecule}
              />
            )
          }
        })}
      </div>
      <p className="hint-text">
        ③ Drag ions together to combine them. Double-click a molecule to break it apart.
      </p>
    </div>
  )
}

function SingleIon({ item, onPointerDown }) {
  return (
    <div
      className="draggable-ion"
      style={{
        left: item.x,
        top: item.y,
        backgroundColor: item.color,
        cursor: 'grab',
      }}
      onPointerDown={(e) => onPointerDown(e, item.id)}
      dangerouslySetInnerHTML={{
        __html: buildIonHTML(item.symbolHTML, item.charge),
      }}
    />
  )
}

function MoleculeItem({ item, onPointerDown, onDoubleClick }) {
  const isNeutral = item.netCharge === 0
  return (
    <div
      className={`draggable-molecule ${isNeutral ? 'molecule-neutral' : 'molecule-charged'}`}
      style={{ left: item.x, top: item.y, cursor: 'grab' }}
      onPointerDown={(e) => onPointerDown(e, item.id)}
      onDoubleClick={() => onDoubleClick(item.id)}
      title="Double-click to break apart"
    >
      <span
        dangerouslySetInnerHTML={{ __html: item.formulaHTML }}
      />
      {!isNeutral && (
        <span className="molecule-charge-badge">
          {item.netCharge > 0 ? `+${item.netCharge}` : item.netCharge}
        </span>
      )}
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
