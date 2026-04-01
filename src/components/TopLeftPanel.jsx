import { chargeOptions, ionDisplayHTML } from '../utils/chemUtils.js'
import { SLOT_COLORS } from '../data/chemistry.js'

export default function TopLeftPanel({
  reaction,
  c1Coeff, c2Coeff,
  selectedCharges, onSelectCharge,
  addedIons,
  onAddCompound, onRemoveCompound,
}) {
  const { compound1, compound2 } = reaction
  return (
    <div className="panel top-left-panel">
      <div className="panel-label">Reactants</div>
      <div className="reactants-equation-row">
        <CompoundBlock
          compound={compound1}
          coeff={c1Coeff}
          compoundKey="compound1"
          cationKey="c1cation"
          anionKey="c1anion"
          selectedCharges={selectedCharges}
          onSelectCharge={onSelectCharge}
          addedIons={addedIons}
          onAdd={onAddCompound}
          onRemove={onRemoveCompound}
        />
        <span className="eq-plus">+</span>
        <CompoundBlock
          compound={compound2}
          coeff={c2Coeff}
          compoundKey="compound2"
          cationKey="c2cation"
          anionKey="c2anion"
          selectedCharges={selectedCharges}
          onSelectCharge={onSelectCharge}
          addedIons={addedIons}
          onAdd={onAddCompound}
          onRemove={onRemoveCompound}
        />
      </div>
      <p className="hint-text">
        ① Select the charge for each ion, then click the molecule formula to add it to the workspace.
      </p>
    </div>
  )
}

function CompoundBlock({
  compound, coeff, compoundKey, cationKey, anionKey,
  selectedCharges, onSelectCharge, addedIons,
  onAdd, onRemove,
}) {
  const catCharge = selectedCharges[cationKey]
  const aniCharge = selectedCharges[anionKey]
  const bothSelected = catCharge !== null && aniCharge !== null
  const unitCount = coeff ?? 0

  return (
    <div className="compound-block">
      {/* Formula row — the formula itself is the "add" button */}
      <div className="compound-formula-row">
        <span className={`coeff-box ${unitCount > 0 ? 'coeff-active' : ''}`}>
          {unitCount > 0 ? unitCount : ''}
        </span>

        <button
          className={`compound-add-btn ${bothSelected ? 'ready' : 'not-ready'}`}
          onClick={() => onAdd(compoundKey)}
          disabled={!bothSelected}
          title={bothSelected
            ? 'Click to dissociate one formula unit into the workspace'
            : 'Select the charge for each ion below first'}
        >
          <span dangerouslySetInnerHTML={{
            __html: compound.formulaHTML + `<span class="state">(${compound.state})</span>`,
          }} />
        </button>

        <button
          className="remove-btn"
          disabled={unitCount === 0}
          onClick={() => onRemove(compoundKey)}
          title="Remove last formula unit"
        >✕</button>
      </div>

      {/* Ion charge selectors directly below, side by side */}
      <div className="ion-pair-row">
        <IonSelector
          ion={compound.cation}
          ionKey={cationKey}
          isAnion={false}
          selectedCharge={catCharge}
          onSelectCharge={onSelectCharge}
        />
        <IonSelector
          ion={compound.anion}
          ionKey={anionKey}
          isAnion={true}
          selectedCharge={aniCharge}
          onSelectCharge={onSelectCharge}
        />
      </div>
    </div>
  )
}

function IonSelector({ ion, ionKey, isAnion, selectedCharge, onSelectCharge }) {
  const options = chargeOptions(ion.symbolHTML, isAnion)
  const hasSelection = selectedCharge !== null
  const color = SLOT_COLORS[ionKey]
  const ionHtml = hasSelection ? ionDisplayHTML(ion.symbolHTML, selectedCharge) : null

  return (
    <div className="ion-selector-cell">
      <select
        className="ion-charge-select"
        value={selectedCharge ?? ''}
        onChange={e => {
          const val = e.target.value === '' ? null : Number(e.target.value)
          onSelectCharge(ionKey, val)
        }}
      >
        <option value="">— select —</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {htmlToText(opt.html)}
          </option>
        ))}
      </select>

      {/* Small colored badge confirming the selected ion */}
      {hasSelection && (
        <div
          className="ion-selected-badge"
          style={{ backgroundColor: color }}
          dangerouslySetInnerHTML={{ __html: ionHtml }}
        />
      )}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const SUB = '₀₁₂₃₄₅₆₇₈₉'
const SUP_NUM = '⁰¹²³⁴⁵⁶⁷⁸⁹'

/** Convert HTML sub/sup tags to Unicode equivalents for <option> text */
function htmlToText(html) {
  return html
    .replace(/<sub>(\d+)<\/sub>/g, (_, n) =>
      [...n].map(c => SUB[+c]).join('')
    )
    .replace(/<sup>([^<]+)<\/sup>/g, (_, s) =>
      s
        .replace(/\d/g, c => SUP_NUM[+c])
        .replace(/\+/g, '⁺')
        .replace(/[-−]/g, '⁻')
    )
    .replace(/<[^>]+>/g, '')
    .replace(/−/g, '⁻')
}
