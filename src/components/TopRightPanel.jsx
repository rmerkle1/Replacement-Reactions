const STATE_OPTIONS = ['', 'aq', 's', 'l', 'g']

export default function TopRightPanel({
  unlocked,
  products,
  productStates,
  onStateChange,
  onSubmit,
  submitResult,
}) {
  return (
    <div className={`panel top-right-panel ${!unlocked ? 'locked' : ''}`}>
      <div className="panel-label">Products</div>
      {!unlocked && (
        <div className="locked-overlay">
          <span>Combine ions in the product panel to see molecules here</span>
        </div>
      )}

      <div className="products-list">
        {products.map((product, i) => (
          <div key={product.formulaHTML + i} className="product-row">
            {product.coefficient > 1 && (
              <span className="product-coeff">{product.coefficient}</span>
            )}
            <span
              className="product-formula"
              dangerouslySetInnerHTML={{ __html: product.formulaHTML }}
            />
            <select
              className="state-select"
              value={productStates[product.formulaHTML] || ''}
              onChange={(e) => onStateChange(product.formulaHTML, e.target.value)}
            >
              {STATE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === '' ? '(state)' : `(${s})`}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {unlocked && (
        <div className="submit-area">
          <button className="submit-btn" onClick={onSubmit}>
            Check Answer
          </button>
          {submitResult && (
            <div className={`submit-feedback ${submitResult.correct ? 'correct' : 'incorrect'}`}>
              {submitResult.correct ? (
                <span>✓ Correct! The equation is balanced.</span>
              ) : (
                <div>
                  <strong>Not quite. Check the following:</strong>
                  <ul>
                    {submitResult.feedback.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <p className="hint-text">
        ④ Molecules formed in the product panel appear here. Select their state of matter, then check your answer.
      </p>
    </div>
  )
}
