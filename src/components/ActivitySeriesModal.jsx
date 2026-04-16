export default function ActivitySeriesModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>Activity Series</span>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="sol-footnote" style={{ borderTop: 'none', paddingTop: 0, marginBottom: 4 }}>
            Most Active → Least Active
          </p>

          <div className="activity-list">
            <div className="activity-group">
              <div className="activity-group-label react-water">React with cold water</div>
              {['Li', 'K', 'Ba', 'Ca', 'Na'].map(m => (
                <div key={m} className="activity-row">
                  <span className="activity-metal">{m}</span>
                </div>
              ))}
            </div>

            <div className="activity-group">
              <div className="activity-group-label react-acid">React with acids</div>
              {['Mg', 'Al', 'Zn', 'Cr', 'Fe', 'Co', 'Ni', 'Sn', 'Pb'].map(m => (
                <div key={m} className="activity-row">
                  <span className="activity-metal">{m}</span>
                </div>
              ))}
            </div>

            <div className="activity-row activity-reference">
              <span className="activity-metal activity-h2">H₂</span>
              <span className="activity-note">— Reference point</span>
            </div>

            <div className="activity-group">
              <div className="activity-group-label no-react">Do not react with acids</div>
              {['Cu', 'Hg', 'Ag', 'Pt', 'Au'].map(m => (
                <div key={m} className="activity-row">
                  <span className="activity-metal">{m}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="sol-footnote">
            <strong>Rule:</strong> A metal will displace any metal <em>below</em> it in the series from a solution of its salt.
          </p>
        </div>
      </div>
    </div>
  )
}
