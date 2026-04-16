import { chargeOptions, ionDisplayHTML } from '../utils/chemUtils.js'
import { SLOT_COLORS } from '../data/chemistry.js'

export default function TopLeftPanel({
  reaction,
  reactionType,
  c1Coeff, c2Coeff,
  metalCoeff,
  selectedCharges, onSelectCharge,
  addedIons,
  onAddCompound, onRemoveCompound,
  ionCheckResult, onCheckIons,
  tutorialHighlighted, tutorialDimmed,
}) {
  const hl = tutorialHighlighted ? ' tutorial-highlight' : ''
  const dim = tutorialDimmed ? ' tutorial-dimmed' : ''
  if (reactionType === 'single') {
    const { metal, salt } = reaction
    return (
      <div className={`panel top-left-panel${hl}${dim}`}>
        <div className="panel-header-row">
          <div className="panel-label" style={{ borderBottom: 'none', paddingBottom: 0 }}>Reactants</div>
          <button className="check-ions-btn" onClick={onCheckIons}>Check Ions</button>
        </div>
        <div className="panel-divider" />
        <div className="reactants-equation-row">
          <MetalBlock
            metal={metal}
            coeff={metalCoeff}
            metalCharge={selectedCharges.metalcharge}
            onSelectCharge={onSelectCharge}
            onAdd={() => onAddCompound('compound1')}
            onRemove={() => onRemoveCompound('compound1')}
            ionCheckResult={ionCheckResult}
          />
          <span className="eq-plus">+</span>
          <CompoundBlock
            compound={salt}
            coeff={c2Coeff}
            compoundKey="compound2"
            cationKey="c2cation"
            anionKey="c2anion"
            selectedCharges={selectedCharges}
            onSelectCharge={onSelectCharge}
            addedIons={addedIons}
            onAdd={onAddCompound}
            onRemove={onRemoveCompound}
            ionCheckResult={ionCheckResult}
          />
        </div>
        <p className="hint-text">
          ① Select the charge for each ion, then click the formula to add it to the workspace.
        </p>
      </div>
    )
  }

  // Double replacement
  const { compound1, compound2 } = reaction
  return (
    <div className={`panel top-left-panel${hl}${dim}`}>
      <div className="panel-header-row">
        <div className="panel-label" style={{ borderBottom: 'none', paddingBottom: 0 }}>Reactants</div>
        <button className="check-ions-btn" onClick={onCheckIons}>Check Ions</button>
      </div>
      <div className="panel-divider" />
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
          ionCheckResult={ionCheckResult}
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
          ionCheckResult={ionCheckResult}
        />
      </div>
      <p className="hint-text">
        ① Select the charge for each ion, then click the molecule formula to add it to the workspace.
      </p>
    </div>
  )
}

function MetalBlock({ metal, coeff, metalCharge, onSelectCharge, onAdd, onRemove, ionCheckResult }) {
  const isReady = metalCharge !== null
  const unitCount = coeff ?? 0

  return (
    <div className="compound-block">
      <div className="compound-formula-row">
        <span className={`coeff-box ${unitCount > 0 ? 'coeff-active' : ''}`}>
          {unitCount > 0 ? unitCount : ''}
        </span>

        <button
          className={`compound-add-btn ${isReady ? 'ready' : 'not-ready'}`}
          onClick={onAdd}
          disabled={!isReady}
          title={isReady
            ? 'Click to add one metal atom to the workspace'
            : 'Select the charge for the metal ion first'}
        >
          <span dangerouslySetInnerHTML={{
            __html: metal.formulaHTML + `<span class="state">(${metal.state})</span>`,
          }} />
        </button>

        <button
          className="remove-btn"
          disabled={unitCount === 0}
          onClick={onRemove}
          title="Remove last metal atom"
        >✕</button>
      </div>

      <div className="ion-pair-row">
        <IonSelector
          ion={metal}
          ionKey="metalcharge"
          isAnion={false}
          selectedCharge={metalCharge}
          onSelectCharge={onSelectCharge}
          colorKey="metalion"
          checkStatus={ionCheckResult?.metalcharge ?? null}
        />
      </div>
    </div>
  )
}

function CompoundBlock({
  compound, coeff, compoundKey, cationKey, anionKey,
  selectedCharges, onSelectCharge, addedIons,
  onAdd, onRemove, ionCheckResult,
}) {
  const catCharge = selectedCharges[cationKey]
  const aniCharge = selectedCharges[anionKey]
  const bothSelected = catCharge !== null && aniCharge !== null
  const unitCount = coeff ?? 0

  return (
    <div className="compound-block">
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

      <div className="ion-pair-row">
        <IonSelector
          ion={compound.cation}
          ionKey={cationKey}
          isAnion={false}
          selectedCharge={catCharge}
          onSelectCharge={onSelectCharge}
          checkStatus={ionCheckResult?.[cationKey] ?? null}
        />
        <IonSelector
          ion={compound.anion}
          ionKey={anionKey}
          isAnion={true}
          selectedCharge={aniCharge}
          onSelectCharge={onSelectCharge}
          checkStatus={ionCheckResult?.[anionKey] ?? null}
        />
      </div>
    </div>
  )
}

function IonSelector({ ion, ionKey, isAnion, selectedCharge, onSelectCharge, colorKey, checkStatus }) {
  const options = chargeOptions(ion.symbolHTML, isAnion)
  const hasSelection = selectedCharge !== null
  const color = SLOT_COLORS[colorKey || ionKey]
  const ionHtml = hasSelection ? ionDisplayHTML(ion.symbolHTML, selectedCharge) : null

  let selectClass = 'ion-charge-select'
  if (checkStatus === 'correct') selectClass += ' check-correct'
  if (checkStatus === 'incorrect') selectClass += ' check-incorrect'

  return (
    <div className="ion-selector-cell">
      <select
        className={selectClass}
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
