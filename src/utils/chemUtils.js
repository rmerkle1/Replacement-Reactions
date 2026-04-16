/** Build dropdown charge options for a given ion symbol */
export function chargeOptions(symbolHTML, isAnion) {
  const values = isAnion ? [0, -1, -2, -3, -4, -5] : [0, 1, 2, 3, 4, 5]
  return values.map((charge) => ({
    value: charge,
    html: ionDisplayHTML(symbolHTML, charge),
  }))
}

/** Format an ion with its charge as HTML */
export function ionDisplayHTML(symbolHTML, charge) {
  if (charge === 0) return symbolHTML
  const sign = charge > 0 ? '+' : '−'
  const abs = Math.abs(charge)
  const sup = abs === 1 ? sign : `${abs}${sign}`
  return `${symbolHTML}<sup>${sup}</sup>`
}

/**
 * Get the flat members array from a right-panel item.
 * Each member: { id, symbol, symbolHTML, charge, color }
 */
export function getMembers(item) {
  if (item.kind === 'ion') {
    return [{ id: item.id, symbol: item.symbol, symbolHTML: item.symbolHTML, charge: item.charge, color: item.color }]
  }
  return item.members
}

/**
 * Build a molecule from a flat array of member ions.
 * - Aggregates identical ions into counts
 * - Sorts cations (positive charge) before anions (negative)
 * - Handles polyatomic-ion parentheses
 * Returns { formulaHTML, netCharge, ions (aggregated) }
 */
export function buildMoleculeFromMembers(members) {
  // Aggregate
  const ionMap = new Map()
  for (const m of members) {
    const key = `${m.symbol}:${m.charge}`
    if (ionMap.has(key)) {
      ionMap.get(key).count++
    } else {
      ionMap.set(key, { symbol: m.symbol, symbolHTML: m.symbolHTML, charge: m.charge, count: 1, color: m.color })
    }
  }

  // Sort: cations first (highest positive charge first), then anions
  const ions = Array.from(ionMap.values()).sort((a, b) => b.charge - a.charge)

  const netCharge = members.reduce((sum, m) => sum + m.charge, 0)

  let formulaHTML = ''
  for (const ion of ions) {
    const isPolyatomic = ion.symbolHTML.includes('<')
    if (ion.count > 1 && isPolyatomic) {
      formulaHTML += `(${ion.symbolHTML})<sub>${ion.count}</sub>`
    } else if (ion.count > 1) {
      formulaHTML += `${ion.symbolHTML}<sub>${ion.count}</sub>`
    } else {
      formulaHTML += ion.symbolHTML
    }
  }

  if (netCharge !== 0) {
    const sign = netCharge > 0 ? '+' : '−'
    const abs = Math.abs(netCharge)
    const sup = abs === 1 ? sign : `${abs}${sign}`
    formulaHTML += `<sup>${sup}</sup>`
  }

  return { formulaHTML, netCharge, ions }
}

/** Unique id generator */
let _counter = 0
export function uid() {
  return `ion_${++_counter}_${Math.random().toString(36).slice(2, 6)}`
}

/** Euclidean distance */
export function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

/**
 * Derive the top-right product list from right-panel items.
 * Groups identical molecules (same formulaHTML) and counts them.
 * Also collects neutral solid metals (items where kind==='ion' && isNeutralSolid===true).
 */
export function deriveProducts(rightItems) {
  const map = new Map()
  for (const item of rightItems) {
    if (item.kind === 'molecule') {
      const key = item.formulaHTML
      if (map.has(key)) {
        map.get(key).coefficient += 1
      } else {
        map.set(key, {
          formulaHTML: item.formulaHTML,
          netCharge: item.netCharge,
          ions: item.ions,
          coefficient: 1,
          state: '',
          id: item.id,
        })
      }
    } else if (item.kind === 'ion' && item.isNeutralSolid) {
      const key = 'solid_' + item.symbol
      if (map.has(key)) {
        map.get(key).coefficient++
      } else {
        map.set(key, {
          formulaHTML: item.symbolHTML,
          netCharge: 0,
          ions: [{ symbol: item.symbol, symbolHTML: item.symbolHTML, charge: 0, count: 1 }],
          coefficient: 1,
          state: 's',
          id: item.id,
          isSolidMetal: true,
        })
      }
    }
  }
  return Array.from(map.values())
}

/** GCD and stoichiometric count helpers */
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b) }

/**
 * Given the charges of a compound's cation and anion, return
 * how many of each appear per formula unit.
 * e.g. Pb2+ and NO3-  →  { cation: 1, anion: 2 }
 *      Na+  and SO42- →  { cation: 2, anion: 1 }
 */
export function stoichCounts(cationCharge, anionCharge) {
  const c = Math.abs(cationCharge)
  const a = Math.abs(anionCharge)
  const g = gcd(a, c)
  return { cation: a / g, anion: c / g }
}

/**
 * Auto-calculate a reactant coefficient from how many cation ions have been added.
 * coeff = count_of_cation / stoich_cation_per_formula
 */
export function autoCoeff(addedIons, cationKey, cationCharge, anionCharge) {
  const count = addedIons.filter((i) => i.ionKey === cationKey).length
  if (count === 0) return null
  const { cation } = stoichCounts(cationCharge, anionCharge)
  const val = count / cation
  return Number.isInteger(val) ? val : Math.round(val * 10) / 10
}

/**
 * Grid position for bottom-left panel.
 * Compound-1 ions and metalion go on the left half; compound-2/salt on the right half.
 */
export function gridPosition(ionKey, existingIons) {
  const isLeft = ionKey.startsWith('c1') || ionKey === 'metalion'
  const sameGroup = existingIons.filter(i => {
    const il = i.ionKey.startsWith('c1') || i.ionKey === 'metalion'
    return il === isLeft
  })
  const idx = sameGroup.length
  const col = idx % 3
  const row = Math.floor(idx / 3)
  const baseX = isLeft ? 48 : 310
  return {
    x: baseX + col * 80,
    y: 50 + row * 70,
  }
}
