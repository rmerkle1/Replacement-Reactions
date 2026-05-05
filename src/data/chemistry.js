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
  // Single-replacement slots
  metalion:  '#fdb714', // yellow
  saltcation: '#e9177a', // pink
  saltanion:  '#748ac5', // purple
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
    noReaction: false,
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
    noReaction: false,
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
    noReaction: false,
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
    noReaction: false,
  },

  // r5: Pb(NO3)2 + K2SO4 → PbSO4↓ + 2KNO3
  {
    id: 'r5',
    compound1: {
      formulaHTML: 'Pb(NO<sub>3</sub>)<sub>2</sub>',
      cation: { symbol: 'Pb',  symbolHTML: 'Pb',             charge: 2  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'K<sub>2</sub>SO<sub>4</sub>',
      cation: { symbol: 'K',  symbolHTML: 'K',             charge: 1  },
      anion:  { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'PbSO<sub>4</sub>',
        ions: [
          { symbol: 'Pb',  symbolHTML: 'Pb',             charge: 2,  count: 1 },
          { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2, count: 1 },
        ],
        coefficient: 1,
        state: 's',
      },
      {
        formulaHTML: 'KNO<sub>3</sub>',
        ions: [
          { symbol: 'K',   symbolHTML: 'K',             charge: 1,  count: 1 },
          { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r6: 3AgNO3 + Na3PO4 → Ag3PO4↓ + 3NaNO3
  {
    id: 'r6',
    compound1: {
      formulaHTML: 'AgNO<sub>3</sub>',
      cation: { symbol: 'Ag',  symbolHTML: 'Ag',             charge: 1  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>3</sub>PO<sub>4</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'PO4', symbolHTML: 'PO<sub>4</sub>', charge: -3 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 3, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'Ag<sub>3</sub>PO<sub>4</sub>',
        ions: [
          { symbol: 'Ag',  symbolHTML: 'Ag',             charge: 1,  count: 3 },
          { symbol: 'PO4', symbolHTML: 'PO<sub>4</sub>', charge: -3, count: 1 },
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
        coefficient: 3,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r7: 3Ca(NO3)2 + 2Na3PO4 → Ca3(PO4)2↓ + 6NaNO3
  {
    id: 'r7',
    compound1: {
      formulaHTML: 'Ca(NO<sub>3</sub>)<sub>2</sub>',
      cation: { symbol: 'Ca',  symbolHTML: 'Ca',             charge: 2  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>3</sub>PO<sub>4</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'PO4', symbolHTML: 'PO<sub>4</sub>', charge: -3 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 3, c2: 2 },
    correctProducts: [
      {
        formulaHTML: 'Ca<sub>3</sub>(PO<sub>4</sub>)<sub>2</sub>',
        ions: [
          { symbol: 'Ca',  symbolHTML: 'Ca',             charge: 2,  count: 3 },
          { symbol: 'PO4', symbolHTML: 'PO<sub>4</sub>', charge: -3, count: 2 },
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
        coefficient: 6,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r8: AlCl3 + 3NaOH → Al(OH)3↓ + 3NaCl
  {
    id: 'r8',
    compound1: {
      formulaHTML: 'AlCl<sub>3</sub>',
      cation: { symbol: 'Al', symbolHTML: 'Al', charge: 3  },
      anion:  { symbol: 'Cl', symbolHTML: 'Cl', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'NaOH',
      cation: { symbol: 'Na', symbolHTML: 'Na', charge: 1  },
      anion:  { symbol: 'OH', symbolHTML: 'OH', charge: -1 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 3 },
    correctProducts: [
      {
        formulaHTML: 'Al(OH)<sub>3</sub>',
        ions: [
          { symbol: 'Al', symbolHTML: 'Al', charge: 3,  count: 1 },
          { symbol: 'OH', symbolHTML: 'OH', charge: -1, count: 3 },
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
        coefficient: 3,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r9: FeCl3 + 3NaOH → Fe(OH)3↓ + 3NaCl
  {
    id: 'r9',
    compound1: {
      formulaHTML: 'FeCl<sub>3</sub>',
      cation: { symbol: 'Fe', symbolHTML: 'Fe', charge: 3  },
      anion:  { symbol: 'Cl', symbolHTML: 'Cl', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'NaOH',
      cation: { symbol: 'Na', symbolHTML: 'Na', charge: 1  },
      anion:  { symbol: 'OH', symbolHTML: 'OH', charge: -1 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 3 },
    correctProducts: [
      {
        formulaHTML: 'Fe(OH)<sub>3</sub>',
        ions: [
          { symbol: 'Fe', symbolHTML: 'Fe', charge: 3,  count: 1 },
          { symbol: 'OH', symbolHTML: 'OH', charge: -1, count: 3 },
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
        coefficient: 3,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r10: Pb(NO3)2 + Na2SO3 → PbSO3↓ + 2NaNO3
  {
    id: 'r10',
    compound1: {
      formulaHTML: 'Pb(NO<sub>3</sub>)<sub>2</sub>',
      cation: { symbol: 'Pb',  symbolHTML: 'Pb',             charge: 2  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>2</sub>SO<sub>3</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'SO3', symbolHTML: 'SO<sub>3</sub>', charge: -2 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'PbSO<sub>3</sub>',
        ions: [
          { symbol: 'Pb',  symbolHTML: 'Pb',             charge: 2,  count: 1 },
          { symbol: 'SO3', symbolHTML: 'SO<sub>3</sub>', charge: -2, count: 1 },
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
    noReaction: false,
  },

  // r11: AgNO3 + NaNO2 → AgNO2↓ + NaNO3
  {
    id: 'r11',
    compound1: {
      formulaHTML: 'AgNO<sub>3</sub>',
      cation: { symbol: 'Ag',  symbolHTML: 'Ag',             charge: 1  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'NaNO<sub>2</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'NO2', symbolHTML: 'NO<sub>2</sub>', charge: -1 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'AgNO<sub>2</sub>',
        ions: [
          { symbol: 'Ag',  symbolHTML: 'Ag',             charge: 1,  count: 1 },
          { symbol: 'NO2', symbolHTML: 'NO<sub>2</sub>', charge: -1, count: 1 },
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
        coefficient: 1,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r12: 2AgNO3 + Na2SO3 → Ag2SO3↓ + 2NaNO3
  {
    id: 'r12',
    compound1: {
      formulaHTML: 'AgNO<sub>3</sub>',
      cation: { symbol: 'Ag',  symbolHTML: 'Ag',             charge: 1  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>2</sub>SO<sub>3</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'SO3', symbolHTML: 'SO<sub>3</sub>', charge: -2 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 2, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'Ag<sub>2</sub>SO<sub>3</sub>',
        ions: [
          { symbol: 'Ag',  symbolHTML: 'Ag',             charge: 1,  count: 2 },
          { symbol: 'SO3', symbolHTML: 'SO<sub>3</sub>', charge: -2, count: 1 },
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
    noReaction: false,
  },

  // r13: (NH4)2CO3 + CaCl2 → CaCO3↓ + 2NH4Cl
  {
    id: 'r13',
    compound1: {
      formulaHTML: '(NH<sub>4</sub>)<sub>2</sub>CO<sub>3</sub>',
      cation: { symbol: 'NH4', symbolHTML: 'NH<sub>4</sub>', charge: 1  },
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
        formulaHTML: 'NH<sub>4</sub>Cl',
        ions: [
          { symbol: 'NH4', symbolHTML: 'NH<sub>4</sub>', charge: 1,  count: 1 },
          { symbol: 'Cl',  symbolHTML: 'Cl',             charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r14: (NH4)2SO4 + Ba(NO3)2 → BaSO4↓ + 2NH4NO3
  {
    id: 'r14',
    compound1: {
      formulaHTML: '(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>',
      cation: { symbol: 'NH4', symbolHTML: 'NH<sub>4</sub>', charge: 1  },
      anion:  { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Ba(NO<sub>3</sub>)<sub>2</sub>',
      cation: { symbol: 'Ba',  symbolHTML: 'Ba',             charge: 2  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 },
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
        formulaHTML: 'NH<sub>4</sub>NO<sub>3</sub>',
        ions: [
          { symbol: 'NH4', symbolHTML: 'NH<sub>4</sub>', charge: 1,  count: 1 },
          { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r15: FeCl2 + 2NaOH → Fe(OH)2↓ + 2NaCl
  {
    id: 'r15',
    compound1: {
      formulaHTML: 'FeCl<sub>2</sub>',
      cation: { symbol: 'Fe', symbolHTML: 'Fe', charge: 2  },
      anion:  { symbol: 'Cl', symbolHTML: 'Cl', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'NaOH',
      cation: { symbol: 'Na', symbolHTML: 'Na', charge: 1  },
      anion:  { symbol: 'OH', symbolHTML: 'OH', charge: -1 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 2 },
    correctProducts: [
      {
        formulaHTML: 'Fe(OH)<sub>2</sub>',
        ions: [
          { symbol: 'Fe', symbolHTML: 'Fe', charge: 2,  count: 1 },
          { symbol: 'OH', symbolHTML: 'OH', charge: -1, count: 2 },
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
    noReaction: false,
  },

  // r16: 2KOH + Cu(NO3)2 → Cu(OH)2↓ + 2KNO3
  {
    id: 'r16',
    compound1: {
      formulaHTML: 'KOH',
      cation: { symbol: 'K',  symbolHTML: 'K',  charge: 1  },
      anion:  { symbol: 'OH', symbolHTML: 'OH', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Cu(NO<sub>3</sub>)<sub>2</sub>',
      cation: { symbol: 'Cu',  symbolHTML: 'Cu',             charge: 2  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 2, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'Cu(OH)<sub>2</sub>',
        ions: [
          { symbol: 'Cu', symbolHTML: 'Cu', charge: 2,  count: 1 },
          { symbol: 'OH', symbolHTML: 'OH', charge: -1, count: 2 },
        ],
        coefficient: 1,
        state: 's',
      },
      {
        formulaHTML: 'KNO<sub>3</sub>',
        ions: [
          { symbol: 'K',   symbolHTML: 'K',             charge: 1,  count: 1 },
          { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r17: Pb(C2H3O2)2 + Na2SO4 → PbSO4↓ + 2NaC2H3O2  (lead acetate)
  {
    id: 'r17',
    compound1: {
      formulaHTML: 'Pb(C<sub>2</sub>H<sub>3</sub>O<sub>2</sub>)<sub>2</sub>',
      cation: { symbol: 'Pb',      symbolHTML: 'Pb',                              charge: 2  },
      anion:  { symbol: 'C2H3O2', symbolHTML: 'C<sub>2</sub>H<sub>3</sub>O<sub>2</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>2</sub>SO<sub>4</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'PbSO<sub>4</sub>',
        ions: [
          { symbol: 'Pb',  symbolHTML: 'Pb',             charge: 2,  count: 1 },
          { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2, count: 1 },
        ],
        coefficient: 1,
        state: 's',
      },
      {
        formulaHTML: 'NaC<sub>2</sub>H<sub>3</sub>O<sub>2</sub>',
        ions: [
          { symbol: 'Na',     symbolHTML: 'Na',                                       charge: 1,  count: 1 },
          { symbol: 'C2H3O2', symbolHTML: 'C<sub>2</sub>H<sub>3</sub>O<sub>2</sub>', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r18: 3Pb(NO3)2 + 2Na3PO4 → Pb3(PO4)2↓ + 6NaNO3
  {
    id: 'r18',
    compound1: {
      formulaHTML: 'Pb(NO<sub>3</sub>)<sub>2</sub>',
      cation: { symbol: 'Pb',  symbolHTML: 'Pb',             charge: 2  },
      anion:  { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>3</sub>PO<sub>4</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'PO4', symbolHTML: 'PO<sub>4</sub>', charge: -3 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 3, c2: 2 },
    correctProducts: [
      {
        formulaHTML: 'Pb<sub>3</sub>(PO<sub>4</sub>)<sub>2</sub>',
        ions: [
          { symbol: 'Pb',  symbolHTML: 'Pb',             charge: 2,  count: 3 },
          { symbol: 'PO4', symbolHTML: 'PO<sub>4</sub>', charge: -3, count: 2 },
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
        coefficient: 6,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r19: Pb(ClO4)2 + Na2SO4 → PbSO4↓ + 2NaClO4  (perchlorate)
  {
    id: 'r19',
    compound1: {
      formulaHTML: 'Pb(ClO<sub>4</sub>)<sub>2</sub>',
      cation: { symbol: 'Pb',   symbolHTML: 'Pb',              charge: 2  },
      anion:  { symbol: 'ClO4', symbolHTML: 'ClO<sub>4</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>2</sub>SO<sub>4</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 },
      state: 'aq',
    },
    correctReactantCoeff: { c1: 1, c2: 1 },
    correctProducts: [
      {
        formulaHTML: 'PbSO<sub>4</sub>',
        ions: [
          { symbol: 'Pb',  symbolHTML: 'Pb',             charge: 2,  count: 1 },
          { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2, count: 1 },
        ],
        coefficient: 1,
        state: 's',
      },
      {
        formulaHTML: 'NaClO<sub>4</sub>',
        ions: [
          { symbol: 'Na',   symbolHTML: 'Na',              charge: 1,  count: 1 },
          { symbol: 'ClO4', symbolHTML: 'ClO<sub>4</sub>', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r20: Ba(ClO3)2 + Na2SO4 → BaSO4↓ + 2NaClO3  (chlorate)
  {
    id: 'r20',
    compound1: {
      formulaHTML: 'Ba(ClO<sub>3</sub>)<sub>2</sub>',
      cation: { symbol: 'Ba',   symbolHTML: 'Ba',              charge: 2  },
      anion:  { symbol: 'ClO3', symbolHTML: 'ClO<sub>3</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>2</sub>SO<sub>4</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 },
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
        formulaHTML: 'NaClO<sub>3</sub>',
        ions: [
          { symbol: 'Na',   symbolHTML: 'Na',              charge: 1,  count: 1 },
          { symbol: 'ClO3', symbolHTML: 'ClO<sub>3</sub>', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r21: Ca(ClO2)2 + Na2CO3 → CaCO3↓ + 2NaClO2  (chlorite)
  {
    id: 'r21',
    compound1: {
      formulaHTML: 'Ca(ClO<sub>2</sub>)<sub>2</sub>',
      cation: { symbol: 'Ca',   symbolHTML: 'Ca',              charge: 2  },
      anion:  { symbol: 'ClO2', symbolHTML: 'ClO<sub>2</sub>', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>2</sub>CO<sub>3</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'CO3', symbolHTML: 'CO<sub>3</sub>', charge: -2 },
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
        formulaHTML: 'NaClO<sub>2</sub>',
        ions: [
          { symbol: 'Na',   symbolHTML: 'Na',              charge: 1,  count: 1 },
          { symbol: 'ClO2', symbolHTML: 'ClO<sub>2</sub>', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
    noReaction: false,
  },

  // r22: Ca(ClO)2 + Na2CO3 → CaCO3↓ + 2NaClO  (hypochlorite)
  {
    id: 'r22',
    compound1: {
      formulaHTML: 'Ca(ClO)<sub>2</sub>',
      cation: { symbol: 'Ca',  symbolHTML: 'Ca',  charge: 2  },
      anion:  { symbol: 'ClO', symbolHTML: 'ClO', charge: -1 },
      state: 'aq',
    },
    compound2: {
      formulaHTML: 'Na<sub>2</sub>CO<sub>3</sub>',
      cation: { symbol: 'Na',  symbolHTML: 'Na',             charge: 1  },
      anion:  { symbol: 'CO3', symbolHTML: 'CO<sub>3</sub>', charge: -2 },
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
        formulaHTML: 'NaClO',
        ions: [
          { symbol: 'Na',  symbolHTML: 'Na',  charge: 1,  count: 1 },
          { symbol: 'ClO', symbolHTML: 'ClO', charge: -1, count: 1 },
        ],
        coefficient: 2,
        state: 'aq',
      },
    ],
    noReaction: false,
  },
]

// Preset single-replacement reactions
export const SINGLE_REACTIONS = [
  // sr1: Zn(s) + CuSO4(aq) → ZnSO4(aq) + Cu(s)
  {
    id: 'sr1', type: 'single',
    metal: { symbol: 'Zn', symbolHTML: 'Zn', formulaHTML: 'Zn', state: 's', correctCharge: 2 },
    salt: { formulaHTML: 'CuSO<sub>4</sub>', cation: { symbol: 'Cu', symbolHTML: 'Cu', charge: 2 }, anion: { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [
      { formulaHTML: 'ZnSO<sub>4</sub>', ions: [{ symbol: 'Zn', symbolHTML: 'Zn', charge: 2, count: 1 }, { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2, count: 1 }], coefficient: 1, state: 'aq' },
      { formulaHTML: 'Cu', ions: [{ symbol: 'Cu', symbolHTML: 'Cu', charge: 0, count: 1 }], coefficient: 1, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },

  // sr3: Zn(s) + Pb(NO3)2(aq) → Zn(NO3)2(aq) + Pb(s)
  {
    id: 'sr3', type: 'single',
    metal: { symbol: 'Zn', symbolHTML: 'Zn', formulaHTML: 'Zn', state: 's', correctCharge: 2 },
    salt: { formulaHTML: 'Pb(NO<sub>3</sub>)<sub>2</sub>', cation: { symbol: 'Pb', symbolHTML: 'Pb', charge: 2 }, anion: { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [
      { formulaHTML: 'Zn(NO<sub>3</sub>)<sub>2</sub>', ions: [{ symbol: 'Zn', symbolHTML: 'Zn', charge: 2, count: 1 }, { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1, count: 2 }], coefficient: 1, state: 'aq' },
      { formulaHTML: 'Pb', ions: [{ symbol: 'Pb', symbolHTML: 'Pb', charge: 0, count: 1 }], coefficient: 1, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },
  // sr4: Cu(s) + ZnSO4(aq) → No Reaction (Cu less active than Zn)
  {
    id: 'sr4', type: 'single',
    metal: { symbol: 'Cu', symbolHTML: 'Cu', formulaHTML: 'Cu', state: 's', correctCharge: null },
    salt: { formulaHTML: 'ZnSO<sub>4</sub>', cation: { symbol: 'Zn', symbolHTML: 'Zn', charge: 2 }, anion: { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [],
    noReaction: true,
  },
  // sr5: Mg(s) + FeSO4(aq) → MgSO4(aq) + Fe(s)
  {
    id: 'sr5', type: 'single',
    metal: { symbol: 'Mg', symbolHTML: 'Mg', formulaHTML: 'Mg', state: 's', correctCharge: 2 },
    salt: { formulaHTML: 'FeSO<sub>4</sub>', cation: { symbol: 'Fe', symbolHTML: 'Fe', charge: 2 }, anion: { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [
      { formulaHTML: 'MgSO<sub>4</sub>', ions: [{ symbol: 'Mg', symbolHTML: 'Mg', charge: 2, count: 1 }, { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2, count: 1 }], coefficient: 1, state: 'aq' },
      { formulaHTML: 'Fe', ions: [{ symbol: 'Fe', symbolHTML: 'Fe', charge: 0, count: 1 }], coefficient: 1, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },
  // sr7: 3Mg(s) + Al2(SO4)3(aq) → 3MgSO4(aq) + 2Al(s)
  {
    id: 'sr7', type: 'single',
    metal: { symbol: 'Mg', symbolHTML: 'Mg', formulaHTML: 'Mg', state: 's', correctCharge: 2 },
    salt: { formulaHTML: 'Al<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub>', cation: { symbol: 'Al', symbolHTML: 'Al', charge: 3 }, anion: { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 }, state: 'aq' },
    correctReactantCoeff: { metal: 3, salt: 1 },
    correctProducts: [
      { formulaHTML: 'MgSO<sub>4</sub>', ions: [{ symbol: 'Mg', symbolHTML: 'Mg', charge: 2, count: 1 }, { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2, count: 1 }], coefficient: 3, state: 'aq' },
      { formulaHTML: 'Al', ions: [{ symbol: 'Al', symbolHTML: 'Al', charge: 0, count: 1 }], coefficient: 2, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },
  // sr8: 2Al(s) + 3Cu(NO3)2(aq) → 2Al(NO3)3(aq) + 3Cu(s)
  {
    id: 'sr8', type: 'single',
    metal: { symbol: 'Al', symbolHTML: 'Al', formulaHTML: 'Al', state: 's', correctCharge: 3 },
    salt: { formulaHTML: 'Cu(NO<sub>3</sub>)<sub>2</sub>', cation: { symbol: 'Cu', symbolHTML: 'Cu', charge: 2 }, anion: { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 }, state: 'aq' },
    correctReactantCoeff: { metal: 2, salt: 3 },
    correctProducts: [
      { formulaHTML: 'Al(NO<sub>3</sub>)<sub>3</sub>', ions: [{ symbol: 'Al', symbolHTML: 'Al', charge: 3, count: 1 }, { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1, count: 3 }], coefficient: 2, state: 'aq' },
      { formulaHTML: 'Cu', ions: [{ symbol: 'Cu', symbolHTML: 'Cu', charge: 0, count: 1 }], coefficient: 3, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },
  // sr9: Al(s) + 3AgNO3(aq) → Al(NO3)3(aq) + 3Ag(s)
  {
    id: 'sr9', type: 'single',
    metal: { symbol: 'Al', symbolHTML: 'Al', formulaHTML: 'Al', state: 's', correctCharge: 3 },
    salt: { formulaHTML: 'AgNO<sub>3</sub>', cation: { symbol: 'Ag', symbolHTML: 'Ag', charge: 1 }, anion: { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 3 },
    correctProducts: [
      { formulaHTML: 'Al(NO<sub>3</sub>)<sub>3</sub>', ions: [{ symbol: 'Al', symbolHTML: 'Al', charge: 3, count: 1 }, { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1, count: 3 }], coefficient: 1, state: 'aq' },
      { formulaHTML: 'Ag', ions: [{ symbol: 'Ag', symbolHTML: 'Ag', charge: 0, count: 1 }], coefficient: 3, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },
  // sr10: Mg(s) + 2AgNO3(aq) → Mg(NO3)2(aq) + 2Ag(s)
  {
    id: 'sr10', type: 'single',
    metal: { symbol: 'Mg', symbolHTML: 'Mg', formulaHTML: 'Mg', state: 's', correctCharge: 2 },
    salt: { formulaHTML: 'AgNO<sub>3</sub>', cation: { symbol: 'Ag', symbolHTML: 'Ag', charge: 1 }, anion: { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 2 },
    correctProducts: [
      { formulaHTML: 'Mg(NO<sub>3</sub>)<sub>2</sub>', ions: [{ symbol: 'Mg', symbolHTML: 'Mg', charge: 2, count: 1 }, { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1, count: 2 }], coefficient: 1, state: 'aq' },
      { formulaHTML: 'Ag', ions: [{ symbol: 'Ag', symbolHTML: 'Ag', charge: 0, count: 1 }], coefficient: 2, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },
  // sr11: Zn(s) + Ni(NO3)2(aq) → Zn(NO3)2(aq) + Ni(s)
  {
    id: 'sr11', type: 'single',
    metal: { symbol: 'Zn', symbolHTML: 'Zn', formulaHTML: 'Zn', state: 's', correctCharge: 2 },
    salt: { formulaHTML: 'Ni(NO<sub>3</sub>)<sub>2</sub>', cation: { symbol: 'Ni', symbolHTML: 'Ni', charge: 2 }, anion: { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [
      { formulaHTML: 'Zn(NO<sub>3</sub>)<sub>2</sub>', ions: [{ symbol: 'Zn', symbolHTML: 'Zn', charge: 2, count: 1 }, { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1, count: 2 }], coefficient: 1, state: 'aq' },
      { formulaHTML: 'Ni', ions: [{ symbol: 'Ni', symbolHTML: 'Ni', charge: 0, count: 1 }], coefficient: 1, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },
  // sr13: Mg(s) + Cu(ClO4)2(aq) → Mg(ClO4)2(aq) + Cu(s)  [perchlorate]
  {
    id: 'sr13', type: 'single',
    metal: { symbol: 'Mg', symbolHTML: 'Mg', formulaHTML: 'Mg', state: 's', correctCharge: 2 },
    salt: { formulaHTML: 'Cu(ClO<sub>4</sub>)<sub>2</sub>', cation: { symbol: 'Cu', symbolHTML: 'Cu', charge: 2 }, anion: { symbol: 'ClO4', symbolHTML: 'ClO<sub>4</sub>', charge: -1 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [
      { formulaHTML: 'Mg(ClO<sub>4</sub>)<sub>2</sub>', ions: [{ symbol: 'Mg', symbolHTML: 'Mg', charge: 2, count: 1 }, { symbol: 'ClO4', symbolHTML: 'ClO<sub>4</sub>', charge: -1, count: 2 }], coefficient: 1, state: 'aq' },
      { formulaHTML: 'Cu', ions: [{ symbol: 'Cu', symbolHTML: 'Cu', charge: 0, count: 1 }], coefficient: 1, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },
  // sr14: Zn(s) + Fe(ClO3)2(aq) → Zn(ClO3)2(aq) + Fe(s)  [chlorate]
  {
    id: 'sr14', type: 'single',
    metal: { symbol: 'Zn', symbolHTML: 'Zn', formulaHTML: 'Zn', state: 's', correctCharge: 2 },
    salt: { formulaHTML: 'Fe(ClO<sub>3</sub>)<sub>2</sub>', cation: { symbol: 'Fe', symbolHTML: 'Fe', charge: 2 }, anion: { symbol: 'ClO3', symbolHTML: 'ClO<sub>3</sub>', charge: -1 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [
      { formulaHTML: 'Zn(ClO<sub>3</sub>)<sub>2</sub>', ions: [{ symbol: 'Zn', symbolHTML: 'Zn', charge: 2, count: 1 }, { symbol: 'ClO3', symbolHTML: 'ClO<sub>3</sub>', charge: -1, count: 2 }], coefficient: 1, state: 'aq' },
      { formulaHTML: 'Fe', ions: [{ symbol: 'Fe', symbolHTML: 'Fe', charge: 0, count: 1 }], coefficient: 1, state: 's', isSolidMetal: true },
    ],
    noReaction: false,
  },
  // sr15: Ag(s) + Cu(NO3)2(aq) → No Reaction (Ag less active than Cu)
  {
    id: 'sr15', type: 'single',
    metal: { symbol: 'Ag', symbolHTML: 'Ag', formulaHTML: 'Ag', state: 's', correctCharge: null },
    salt: { formulaHTML: 'Cu(NO<sub>3</sub>)<sub>2</sub>', cation: { symbol: 'Cu', symbolHTML: 'Cu', charge: 2 }, anion: { symbol: 'NO3', symbolHTML: 'NO<sub>3</sub>', charge: -1 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [],
    noReaction: true,
  },
  // sr16: Cu(s) + FeSO4(aq) → No Reaction (Cu less active than Fe)
  {
    id: 'sr16', type: 'single',
    metal: { symbol: 'Cu', symbolHTML: 'Cu', formulaHTML: 'Cu', state: 's', correctCharge: null },
    salt: { formulaHTML: 'FeSO<sub>4</sub>', cation: { symbol: 'Fe', symbolHTML: 'Fe', charge: 2 }, anion: { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [],
    noReaction: true,
  },
  // sr17: Ni(s) + ZnSO4(aq) → No Reaction (Ni less active than Zn)
  {
    id: 'sr17', type: 'single',
    metal: { symbol: 'Ni', symbolHTML: 'Ni', formulaHTML: 'Ni', state: 's', correctCharge: null },
    salt: { formulaHTML: 'ZnSO<sub>4</sub>', cation: { symbol: 'Zn', symbolHTML: 'Zn', charge: 2 }, anion: { symbol: 'SO4', symbolHTML: 'SO<sub>4</sub>', charge: -2 }, state: 'aq' },
    correctReactantCoeff: { metal: 1, salt: 1 },
    correctProducts: [],
    noReaction: true,
  },
]
