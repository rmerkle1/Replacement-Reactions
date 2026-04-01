import { chargeOptions, ionDisplayHTML } from '../utils/chemUtils.js'
import { getIonColor } from '../data/chemistry.js'

export default function TopLeftPanel({
  reaction,
  c1Coeff,
  c2Coeff,
  selectedCharges,
  onSelectCharge,
  addedIons,
  onAddIon,
  onRemoveIon,
}) {
  const { compound1, compound2 } = reaction

  return (
    <div className="panel top-left-panel">
      <div className="panel-label">Reactants</div>

      {/* Equation row: compound block + plus + compound block */}
      <div className="reactants-equation-row">
        <CompoundBlock
          compound={compound1}
          coeff={c1Coeff}
          cationKey="c1cation"
          anionKey="c1anion"
          selectedCharges={selectedCharges}
          onSelectCharge={onSelectCharge}
          addedIons={addedIons}
          onAddIon={onAddIon}
          onRemoveIon={onRemoveIon}
        />
        <span className="eq-plus">+</span>
        <CompoundBlock
          compound={compound2}
          coeff={c2Coeff}
          cationKey="c2cation"
          anionKey="c2anion"
          selectedCharges={selectedCharges}
          onSelectCharge={onSelectCharge}
          addedIons={addedIons}
          onAddIon={onAddIon}
          onRemoveIon={onRemoveIon}
        />
      </div>

      <p className="hint-text">
        ① Select the correct charge for each ion, then click the colored box to add ions to the workspace below.
      </p>
    </div>
  )
}

function CompoundBlock({
  compound, coeff,
  cationKey, anionKey,
  selectedCharges, onSelectCharge,
  addedIons, onAddIon, onRemoveIon,
}) {
  return (
    <div className="compound-block">
      {/* Formula row */}
      <div className="compound-formula-row">
        <span className={`coeff-box ${coeff ? 'coeff-active' : ''}`}>
          {coeff ?? ''}
        </span>
        <span
          className="compound-formula"
          dangerouslySetInnerHTML={{
            __html: compound.formulaHTML + `<span class="state">(${compound.state})</span>`,
          }}
        />
      </div>

      {/* Ion selectors directly below — cation left, anion right */}
      <div className="ion-pair-row">
        <IonSelector
          ion={compound.cation}
          ionKey={cationKey}
          isAnion={false}
          selectedCharge={selectedCharges[cationKey]}
          onSelectCharge={onSelectCharge}
          addedIons={addedIons}
          onAddIon={onAddIon}
          onRemoveIon={onRemoveIon}
        />
        <IonSelector
          ion={compound.anion}
          ionKey={anionKey}
          isAnion={true}
          selectedCharge={selectedCharges[anionKey]}
          onSelectCharge={onSelectCharge}
          addedIons={addedIons}
          onAddIon={onAddIon}
          onRemoveIon={onRemoveIon}
        />
      </div>
    </div>
  )
}

function IonSelector({ ion, ionKey, isAnion, selectedCharge, onSelectCharge, addedIons, onAddIon, onRemoveIon }) {
  const options = chargeOptions(ion.symbolHTML, isAnion)
  const hasSelection = selectedCharge !== null
  const color = hasSelection ? getIonColor(selectedCharge) : null
  const ionHTML = hasSelection ? ionDisplayHTML(ion.symbolHTML, selectedCharge) : null
  const countAdded = addedIons.filter((i) => i.ionKey === ionKey).length

  return (
    <div className="ion-selector-cell">
      <select
        className="ion-charge-select"
        value={selectedCharge ?? ''}
        onChange={(e) => {
          const val = e.target.value === '' ? null : Number(e.target.value)
          onSelectCharge(ionKey, val)
        }}
      >
        <option value="">— select —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {stripHTML(opt.html)}
          </option>
        ))}
      </select>

      {hasSelection && (
        <div className="ion-button-row">
          <button
            className="ion-box-btn"
            style={{ backgroundColor: color }}
            title="Click to add this ion to the workspace"
            onClick={() =>
              onAddIon(ionKey, {
                symbol: ion.symbol,
                symbolHTML: ion.symbolHTML,
                charge: selectedCharge,
                color,
              })
            }
            dangerouslySetInnerHTML={{ __html: ionHTML }}
          />
          <button
            className="remove-btn"
            disabled={countAdded === 0}
            onClick={() => onRemoveIon(ionKey)}
            title="Remove last added ion"
          >✕</button>
          {countAdded > 0 && (
            <span className="ion-count">×{countAdded}</span>
          )}
        </div>
      )}
    </div>
  )
}

function stripHTML(html) {
  return html.replace(/<[^>]*>/g, '').replace(/−/g, '-')
}
