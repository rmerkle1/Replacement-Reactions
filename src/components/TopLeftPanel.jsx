import { chargeOptions, ionDisplayHTML } from '../utils/chemUtils.js'
import { getIonColor } from '../data/chemistry.js'

const ION_KEYS = [
  { key: 'c1cation', label: 'Cation 1', compoundKey: 'compound1', ionType: 'cation' },
  { key: 'c1anion',  label: 'Anion 1',  compoundKey: 'compound1', ionType: 'anion'  },
  { key: 'c2cation', label: 'Cation 2', compoundKey: 'compound2', ionType: 'cation' },
  { key: 'c2anion',  label: 'Anion 2',  compoundKey: 'compound2', ionType: 'anion'  },
]

export default function TopLeftPanel({
  reaction,
  reactantCoeff,
  onCoeffChange,
  selectedCharges,
  onSelectCharge,
  addedIons,
  onAddIon,
  onRemoveIon,
}) {
  const { compound1, compound2 } = reaction

  function renderCompound(compound, coeffKey) {
    return (
      <div className="compound-row">
        <input
          className="coeff-input"
          type="number"
          min="1"
          max="9"
          placeholder="1"
          value={reactantCoeff[coeffKey]}
          onChange={(e) => onCoeffChange(coeffKey, e.target.value)}
        />
        <span
          className="compound-formula"
          dangerouslySetInnerHTML={{ __html: compound.formulaHTML + `<span class="state">(${compound.state})</span>` }}
        />
      </div>
    )
  }

  return (
    <div className="panel top-left-panel">
      <div className="panel-label">Reactants</div>

      {/* Compound display */}
      <div className="compounds-display">
        {renderCompound(compound1, 'c1')}
        <span className="plus-sign">+</span>
        {renderCompound(compound2, 'c2')}
      </div>

      {/* Ion selector grid */}
      <div className="ion-selector-grid">
        {ION_KEYS.map(({ key, label, compoundKey, ionType }) => {
          const compound = reaction[compoundKey]
          const ion = compound[ionType]
          const isAnion = ionType === 'anion'
          const options = chargeOptions(ion.symbolHTML, isAnion)
          const selectedCharge = selectedCharges[key]
          const hasSelection = selectedCharge !== null
          const color = hasSelection ? getIonColor(selectedCharge) : null
          const ionDisplayHtml = hasSelection
            ? ionDisplayHTML(ion.symbolHTML, selectedCharge)
            : null

          const countAdded = addedIons.filter((i) => i.ionKey === key).length

          return (
            <div key={key} className="ion-selector-cell">
              <div className="ion-selector-label">{label}</div>
              <select
                className="ion-charge-select"
                value={selectedCharge ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? null : Number(e.target.value)
                  onSelectCharge(key, val)
                }}
              >
                <option value="">— select —</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {/* Stripping HTML for option text — use label fallback */}
                    {stripHTML(opt.html)}
                  </option>
                ))}
              </select>

              {hasSelection && (
                <div className="ion-button-row">
                  <button
                    className="ion-box-btn"
                    style={{ backgroundColor: color, borderColor: darken(color) }}
                    title="Click to add this ion to the workspace"
                    onClick={() =>
                      onAddIon(key, {
                        symbol: ion.symbol,
                        symbolHTML: ion.symbolHTML,
                        charge: selectedCharge,
                        color,
                      })
                    }
                    dangerouslySetInnerHTML={{ __html: ionDisplayHtml }}
                  />
                  <button
                    className="remove-btn"
                    disabled={countAdded === 0}
                    onClick={() => onRemoveIon(key)}
                    title="Remove last added ion"
                  >
                    ✕
                  </button>
                  {countAdded > 0 && (
                    <span className="ion-count">×{countAdded}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="hint-text">
        ① Select the correct charge for each ion, then click the colored box to add ions to the workspace below.
      </p>
    </div>
  )
}

function stripHTML(html) {
  return html.replace(/<[^>]*>/g, '').replace('−', '-')
}

function darken(hex) {
  // Crude darkening — just add '99' alpha overlay effect via border
  return hex
}
