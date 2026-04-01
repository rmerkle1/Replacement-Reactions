// Brand color palette
export const PALETTE = {
  teal:   '#17b29e',
  purple: '#748ac5',
  yellow: '#fdb714',
  blue:   '#00addb',
  green:  '#85c441',
  pink:   '#e9177a',
  grey:   '#4f5b6f',
}

// Per-slot colors — ensures all 4 ions in a reaction are always visually distinct
// regardless of whether two anions (or two cations) share the same charge.
export const SLOT_COLORS = {
  c1cation: '#00addb', // blue
  c1anion:  '#e9177a', // pink
  c2cation: '#85c441', // green
  c2anion:  '#748ac5', // purple
}

// Ion colors by charge value (kept as fallback)
export const ION_COLORS = {
  cation: {
    1: '#00addb', // blue
    2: '#85c441', // green
    3: '#fdb714', // yellow
    4: '#17b29e', // teal
  },
  anion: {
    '-1': '#e9177a', // pink
    '-2': '#748ac5', // purple
    '-3': '#4f5b6f', // grey
    '-4': '#17b29e', // teal (reuse)
  },
  neutral: '#4f5b6f',
}

export function getIonColor(charge) {
  if (charge > 0) return ION_COLORS.cation[charge] ?? ION_COLORS.cation[1]
  if (charge < 0) return ION_COLORS.anion[charge] ?? ION_COLORS.anion['-1']
  return ION_COLORS.neutral
}

// Preset double-replacement reactions
export const PRESET_REACTIONS = [
  {
    id: 'r1',
    compound1: {
      formulaHTML: 'NaI',
      cation: { symbol: 'Na',  symbolHTML: 'Na',               charge: 1  },
      anion:  { symbol: 'I',   symbolHTML: 'I',                charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Pb(NO<sub>3</sub>)<sub>2</sub>',
      cation: { symbol: 'Pb',  symbolHTML: 'Pb',               charge: 2  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>',   charge: -1 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 2, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'PbI<sub>2</sub>',
        ions: [
          { symbol: 'Pb',  symbolHTML: 'Pb',             charge: 2,  count: 1 },
          { symbol: 'I',   symbolHTML: 'I',              charge: -1, count: 2 },
        ],
        coefficient: 1,
        state: 's',
      },
      {
        formulaHTML: 'NaNO<sub>3</sub>',
        ions: [
          { symbol: 'Na',  symbolHTML: 'Na',             charge: 1,  count: 1 },
          { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
  },
  {
    id: 'r2',
    compound1: {
      formulaHTML: 'Na<sub>2</sub>SO<sub>4</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'BaCl<sub>2</sub>',
      cation: { symbol: 'Ba', symbolHTML: 'Ba', charge: 2  },
      anion:  { symbol: 'Cl', symbolHTML: 'Cl', charge: -1 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'BaSO<sub>4</sub>',
        ions: [
          { symbol: 'Ba',  symbolHTML: 'Ba',             charge: 2,  count: 1 },
          { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2, count: 1 },
        ],
        coefficient: 1,
        state: 's',
      },
      {
        formulaHTML: 'NaCl',
        ions: [
          { symbol: 'Na', symbolHTML: 'Na', charge: 1,  count: 1 },
          { symbol: 'Cl', symbolHTML: 'Cl', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
  },
  {
    id: 'r3',
    compound1: {
      formulaHTML: 'KOH',
      cation: { symbol: 'K',  symbolHTML: 'K',  charge: 1  },
      anion:  { symbol: 'OH', symbolHTML: 'OH', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'MgCl<sub>2</sub>',
      cation: { symbol: 'Mg', symbolHTML: 'Mg', charge: 2  },
      anion:  { symbol: 'Cl', symbolHTML: 'Cl', charge: -1 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 2, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'Mg(OH)<sub>2</sub>',
        ions: [
          { symbol: 'Mg', symbolHTML: 'Mg', charge: 2,  count: 1 },
          { symbol: 'OH', symbolHTML: 'OH', charge: -1, count: 2 },
        ],
        coefficient: 1,
        state: 's',
      },
      {
        formulaHTML: 'KCl',
        ions: [
          { symbol: 'K',  symbolHTML: 'K',  charge: 1,  count: 1 },
          { symbol: 'Cl', symbolHTML: 'Cl', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
  },
  {
    id: 'r4',
    compound1: {
      formulaHTML: 'Na<sub>2</sub>CO<sub>3</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'CO3', symbolHTML: 'CO<sub>3</sub>', charge: -2 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'CaCl<sub>2</sub>',
      cation: { symbol: 'Ca', symbolHTML: 'Ca', charge: 2  },
      anion:  { symbol: 'Cl', symbolHTML: 'Cl', charge: -1 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'CaCO<sub>3</sub>',
        ions: [
          { symbol: 'Ca',  symbolHTML: 'Ca',             charge: 2,  count: 1 },
          { symbol: 'CO3', symbolHTML: 'CO<sub>3</sub>', charge: -2, count: 1 },
        ],
        coefficient: 1,
        state: 's',
      },
      {
        formulaHTML: 'NaCl',
        ions: [
          { symbol: 'Na', symbolHTML: 'Na', charge: 1,  count: 1 },
          { symbol: 'Cl', symbolHTML: 'Cl', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
  },
]
