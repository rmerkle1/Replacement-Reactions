export default function SolubilityModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>Solubility Rules</span>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <section className="solubility-section">
            <h3 className="sol-heading sol-soluble">Generally Soluble (aq)</h3>
            <table className="sol-table">
              <thead>
                <tr><th>Ion</th><th>Soluble with</th><th>Exceptions (insoluble)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>NO₃⁻ (nitrate)</td>
                  <td>All cations</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td>Cl⁻ (chloride)</td>
                  <td>Most cations</td>
                  <td>Ag⁺, Pb²⁺</td>
                </tr>
                <tr>
                  <td>Br⁻ (bromide)</td>
                  <td>Most cations</td>
                  <td>Ag⁺, Pb²⁺</td>
                </tr>
                <tr>
                  <td>I⁻ (iodide)</td>
                  <td>Most cations</td>
                  <td>Ag⁺, Pb²⁺</td>
                </tr>
                <tr>
                  <td>SO₄²⁻ (sulfate)</td>
                  <td>Most cations</td>
                  <td>Ba²⁺, Pb²⁺, Ca²⁺ (slightly)</td>
                </tr>
                <tr>
                  <td>Na⁺, K⁺, Li⁺, NH₄⁺</td>
                  <td>All anions</td>
                  <td>None</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="solubility-section">
            <h3 className="sol-heading sol-insoluble">Generally Insoluble (s)</h3>
            <table className="sol-table">
              <thead>
                <tr><th>Ion</th><th>Insoluble with most</th><th>Exceptions (soluble)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>OH⁻ (hydroxide)</td>
                  <td>Most cations</td>
                  <td>Na⁺, K⁺, Li⁺, Ba²⁺</td>
                </tr>
                <tr>
                  <td>CO₃²⁻ (carbonate)</td>
                  <td>Most cations</td>
                  <td>Na⁺, K⁺, NH₄⁺</td>
                </tr>
                <tr>
                  <td>PO₄³⁻ (phosphate)</td>
                  <td>Most cations</td>
                  <td>Na⁺, K⁺, NH₄⁺</td>
                </tr>
                <tr>
                  <td>SO₃²⁻ (sulfite)</td>
                  <td>Most cations</td>
                  <td>Na⁺, K⁺, NH₄⁺</td>
                </tr>
                <tr>
                  <td>S²⁻ (sulfide)</td>
                  <td>Most cations</td>
                  <td>Na⁺, K⁺, NH₄⁺</td>
                </tr>
                <tr>
                  <td>CrO₄²⁻ (chromate)</td>
                  <td>Most cations</td>
                  <td>Na⁺, K⁺, NH₄⁺</td>
                </tr>
              </tbody>
            </table>
          </section>

          <p className="sol-footnote">
            Use these rules to determine the state of matter <em>(aq)</em> or <em>(s)</em> for each product.
          </p>
        </div>
      </div>
    </div>
  )
}
