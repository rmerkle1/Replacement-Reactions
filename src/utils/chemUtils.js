/**
 * Build an array of charge options for a dropdown.
 * isAnion: false → 0,+1,+2,+3,+4   true → 0,-1,-2,-3,-4
 */
export function chargeOptions(symbolHTML, isAnion) {
  const values = isAnion ? [0, -1, -2, -3, -4] : [0, 1, 2, 3, 4]
  return values.map((charge) => ({
    value: charge,
    html: ionDisplayHTML(symbolHTML, charge),
  }))
}

/** Format an ion symbol + charge into HTML, e.g. "Na<sup>2+</sup>" */
export function ionDisplayHTML(symbolHTML, charge) {
  if (charge === 0) return symbolHTML
  const sign = charge > 0 ? '+' : '−'
  const abs = Math.abs(charge)
  const sup = abs === 1 ? sign : `${abs}${sign}`
  return `${symbolHTML}<sup>${sup}</sup>`
}

/**
 * Given an array of { symbolHTML, charge, count } ions,
 * compute the combined formula HTML and net charge.
 */
export function buildMolecule(ions) {
  const netCharge = ions.reduce((sum, ion) => sum + ion.charge * ion.count, 0)

  let formulaHTML = ''
  for (const ion of ions) {
    // Polyatomic ions with count > 1 need parentheses if they contain sub/sup tags
    const needsParens = ion.count > 1 && ion.symbolHTML.includes('<')
    if (needsParens) {
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

  return { formulaHTML, netCharge }
}

/**
 * Merge the ions from two right-panel items into a single molecule.
 * Each item is either { kind:'ion', symbol, symbolHTML, charge }
 * or { kind:'molecule', ions:[{symbol,symbolHTML,charge,count}] }
 */
export function mergeItems(itemA, itemB) {
  const ionsA = flattenItem(itemA)
  const ionsB = flattenItem(itemB)
  const merged = [...ionsA]

  for (const ion of ionsB) {
    const existing = merged.find(
      (i) => i.symbol === ion.symbol && i.charge === ion.charge
    )
    if (existing) {
      existing.count += ion.count
    } else {
      merged.push({ ...ion })
    }
  }

  return merged
}

function flattenItem(item) {
  if (item.kind === 'ion') {
    return [{ symbol: item.symbol, symbolHTML: item.symbolHTML, charge: item.charge, count: 1 }]
  }
  return item.ions.map((ion) => ({ ...ion }))
}

/** Generate a unique id */
let _counter = 0
export function uid() {
  return `ion_${++_counter}_${Math.random().toString(36).slice(2, 7)}`
}

/** Distance between two points */
export function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

/**
 * Derive top-right product list from the right-panel items.
 * Groups identical molecules (same formula) and counts them.
 */
export function deriveProducts(rightItems) {
  const molecules = rightItems.filter((item) => item.kind === 'molecule')
  const map = new Map()

  for (const mol of molecules) {
    const key = mol.formulaHTML
    if (map.has(key)) {
      map.get(key).coefficient += 1
    } else {
      map.set(key, {
        formulaHTML: mol.formulaHTML,
        netCharge: mol.netCharge,
        ions: mol.ions,
        coefficient: 1,
        state: mol.state || '',
        id: mol.id,
      })
    }
  }

  return Array.from(map.values())
}
