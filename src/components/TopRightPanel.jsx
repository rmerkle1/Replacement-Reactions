import { useState } from 'react'
import SolubilityModal from './SolubilityModal.jsx'

const STATE_OPTIONS = ['', 'aq', 's', 'l', 'g']

export default function TopRightPanel({
  unlocked,
  products,
  productStates,
  onStateChange,
  onSubmit,
  onNext,
  submitResult,
}) {
  const [showSolubility, setShowSolubility] = useState(false)

  return (
    <div className={`panel top-right-panel ${!unlocked ? 'locked' : ''}`}>
      <div className="panel-header-row">
        <div className="panel-label" style={{ borderBottom: 'none', paddingBottom: 0 }}>Products</div>
        <div className="panel-action-btns">
          <button
            className="tool-btn solubility-btn"
            onClick={() => setShowSolubility(true)}
            title="View solubility rules"
          >
            Solubility Table
          </button>
          <button
            className="tool-btn next-btn"
            onClick={onNext}
            title="Move to the next reaction"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="panel-divider" />

      {!unlocked && (
        <div className="locked-overlay">
          <span>Combine ions in the product panel to see molecules here</span>
        </div>
      )}

      {/* Inline product equation */}
      <div className="products-equation-row">
        {products.map((product, i) => (
          <span key={product.formulaHTML + i} className="product-inline-group">
            {i > 0 && <span className="eq-plus">+</span>}
            <span className="coeff-box coeff-active">
              {product.coefficient}
            </span>
            <span
              className="compound-formula"
              dangerouslySetInnerHTML={{ __html: product.formulaHTML }}
            />
            <select
              className="state-select"
              value={productStates[product.formulaHTML] || ''}
              onChange={e => onStateChange(product.formulaHTML, e.target.value)}
            >
              {STATE_OPTIONS.map(s => (
                <option key={s} value={s}>{s === '' ? '(state)' : `(${s})`}</option>
              ))}
            </select>
          </span>
        ))}
      </div>

      {unlocked && (
        <div className="submit-area">
          <button className="submit-btn" onClick={onSubmit}>Check Answer</button>
          {submitResult && (
            <div className={`submit-feedback ${submitResult.correct ? 'correct' : 'incorrect'}`}>
              {submitResult.correct ? (
                <span>✓ Correct! The equation is balanced.</span>
              ) : (
                <>
                  <strong>Not quite — check the following:</strong>
                  <ul>
                    {submitResult.feedback.map((msg, i) => <li key={i}>{msg}</li>)}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <p className="hint-text">
        ④ Molecules formed below appear here. Select each state of matter, then check your answer.
      </p>

      {showSolubility && <SolubilityModal onClose={() => setShowSolubility(false)} />}
    </div>
  )
}
