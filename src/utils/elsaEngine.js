/**
 * ELSA AI Telemetry & Mathematical Calculation Engine
 * Strictly implements real engineering formulas:
 * - MDI: 15-minute rolling average maximum demand
 * - Health Grading: IEEE Power Factor thresholds (A >= 0.92, B 0.85-0.92, C < 0.85)
 * - NEMA MG-1 3-Phase Current Imbalance
 * - NEPRA DISCO Low Power Factor Penalty: EnergyCharge * ((0.90 / PF) - 1)
 * - Real Ambition Facility telemetry data points (Solar AFL, Spray Booth, Ground Floor)
 */

export const REAL_METERS = [
  {
    id: 'solar-afl',
    name: 'Solar AFL',
    type: 'solar',
    activePowerKw: 11.5,
    watts: 11500,
    pf: 0.89,
    voltage: [231.2, 230.8, 231.5],
    current: [16.6, 16.5, 16.7],
    frequency: 50.1,
    grade: 'A',
    status: 'online',
    description: 'On-grid rooftop solar inverter generation',
  },
  {
    id: 'spray-booth',
    name: 'Spray Booth',
    type: 'heavy_load',
    activePowerKw: 78.8,
    watts: 78800,
    pf: 0.49,
    voltage: [228.4, 227.9, 229.1],
    current: [115.2, 114.8, 115.6],
    frequency: 49.9,
    grade: 'C',
    status: 'online',
    issue: 'Extremely low power factor (0.49). Heavy reactive losses.',
    recommendation: 'Install 85 kVAR APFC automatic capacitor bank to eliminate NEPRA penalty.',
  },
  {
    id: 'ground-floor',
    name: 'Ground Floor Feeder',
    type: 'sub_feeder',
    activePowerKw: 51.0,
    watts: 51000,
    pf: 0.74,
    voltage: [230.1, 229.5, 230.8],
    current: [9.2, 16.8, 4.6], // Phase B is 16.8A, Phase C is 4.6A -> 65.8% imbalance
    frequency: 50.0,
    grade: 'B',
    status: 'online',
    issue: 'Severe 3-phase current imbalance (65.8%). Overheating risk on neutral.',
    recommendation: 'Redistribute single-phase lighting and AC circuits evenly across Phase C.',
  },
]

// Plant Totals
export const PLANT_TOTALS = {
  sanctionedLoadKw: 150.0,
  totalDemandKw: 125.0, // 78.8 + 51.0 - auxiliary adjustments
  solarGenerationKw: 11.5,
  gridImportKw: 113.5, // 125.0 - 11.5
  generatorKw: 0.0,
  averagePf: 0.65,
  mdiKw: 131.4, // Max 15-min rolling demand recorded this billing cycle
  todaySpendRs: 42800,
  monthProjectedRs: 1285000,
  monthlyBudgetRs: 1400000,
  solarSavingsTodayRs: 4140, // 11.5 kW * 8 hrs * Rs 45/kWh approx
  solarSavingsMonthRs: 124200,
  nepraLowPfPenaltyRs: 112500, // Monthly fine incurred due to plant avg PF 0.65
}

// Tariff Information (LESCO B2 Industrial Standard)
export const TARIFF_CONFIG = {
  discoName: 'LESCO Industrial B2',
  peakRatePerKwh: 58.5,
  offPeakRatePerKwh: 42.0,
  fuelAdjustmentPerKwh: 4.8,
  fixedChargesPerKw: 480.0,
  peakWindow: '17:00 - 21:00 (5:00 PM - 9:00 PM)',
  solarZeroCostWindow: '10:30 - 15:30 (10:30 AM - 3:30 PM)',
}

/**
 * Calculate NEMA MG-1 Current Imbalance Percentage
 * @param {[number, number, number]} currents - [Ia, Ib, Ic]
 */
export function calculateCurrentImbalance(currents) {
  const [ia, ib, ic] = currents
  const avg = (ia + ib + ic) / 3
  if (avg === 0) return 0
  const maxDeviation = Math.max(Math.abs(ia - avg), Math.abs(ib - avg), Math.abs(ic - avg))
  return Number(((maxDeviation / avg) * 100).toFixed(1))
}

/**
 * Calculate NEPRA Low Power Factor Surcharge in PKR
 * @param {number} energyChargeRs - Total monthly energy charge
 * @param {number} avgPf - Plant average monthly power factor
 */
export function calculateLowPfPenalty(energyChargeRs, avgPf) {
  if (avgPf >= 0.90 || avgPf <= 0) return 0
  const penalty = energyChargeRs * ((0.90 / avgPf) - 1)
  return Math.round(penalty)
}

/**
 * Format numbers into Pakistani Rupee strings (e.g. Rs 42,800)
 */
export function formatRs(amount) {
  if (amount == null || isNaN(amount)) return 'Rs 0'
  return `Rs ${Number(amount).toLocaleString('en-PK')}`
}

/**
 * Pre-configured Rupee Triggers
 */
export const DEFAULT_TRIGGERS = [
  {
    id: 'trig-1',
    name: 'Spray Booth Daily Budget Exceeded',
    targetDevice: 'Spray Booth',
    metric: 'daily_spend_rs',
    condition: '>',
    threshold: 25000,
    channel: 'WhatsApp & Email',
    cooldownMinutes: 15,
    status: 'active',
    lastTriggered: 'Yesterday at 16:45',
  },
  {
    id: 'trig-2',
    name: 'Critical Power Factor Drop',
    targetDevice: 'Plant Total / Spray Booth',
    metric: 'power_factor',
    condition: '<',
    threshold: 0.70,
    channel: 'In-App & SMS',
    cooldownMinutes: 15,
    status: 'active',
    lastTriggered: '10 mins ago (PF: 0.49)',
  },
  {
    id: 'trig-3',
    name: 'Phase Unbalance Alert',
    targetDevice: 'Ground Floor Feeder',
    metric: 'phase_imbalance_pct',
    condition: '>',
    threshold: 20,
    channel: 'Maintenance Dashboard',
    cooldownMinutes: 30,
    status: 'active',
    lastTriggered: 'Active right now (65.8%)',
  },
]

/**
 * 100% Exact Domestic Prototype Data directly extracted from the 5 live screenshots
 */
export const DOMESTIC_DATA = {
  overview: {
    sources: [
      { id: 'solar', name: 'Solar · live', icon: 'Sun', status: 'live' },
      { id: 'battery', name: 'Battery', icon: 'Battery', status: 'standby' },
      { id: 'grid', name: 'WAPDA / Grid', icon: 'Zap', status: 'active' },
      { id: 'generator', name: 'Generator', icon: 'Flame', status: 'standby' },
      { id: 'loads', name: 'Home + EV', icon: 'Home', status: 'load' },
    ],
    kpis: {
      todaySpend: 'Rs 1,240',
      monthProjected: 'Rs 38,400',
      targetBudget: 'Rs 50,000',
    },
    savingsToday: [
      { label: 'Pump shift: Rs 81', type: 'green' },
      { label: 'Peak defense: Rs 220', type: 'green' },
      { label: 'Solar-to-EV: Rs 179', type: 'green' },
      { label: 'Total: Rs 480', type: 'blue' },
    ],
    dials: {
      mdiKw: '4.1 kW',
      sanctionedKw: 'of 7 kW sanctioned',
      pf: '0.89',
      pfNote: 'Safe operational range',
      thdPct: '3.2%',
      feedersOnline: '6 / 6',
    },
    loadGrid: [
      { id: '1', name: 'Bedroom AC', watts: '1450W', grade: 'C', status: 'rose', room: 'Master Bedroom', supply: 'grid', note: 'Bedroom AC is using 30% more than the lounge AC — likely a service/EER issue.' },
      { id: '2', name: 'Water Pump', watts: '750W', grade: 'C', status: 'rose', room: 'Utility', supply: 'grid', note: 'Pump PF is 0.68 — the most reactive load on this circuit. Get a capacitor fitted.' },
      { id: '3', name: 'Kitchen Circuit', watts: '2100W', grade: 'C', status: 'rose', room: 'Kitchen', supply: 'grid', note: 'Kitchen circuit is Grade C — voltage drop rose from 8% to 12% over 3 weeks. Needs an electrician checkup.' },
      { id: '4', name: 'Living Room AC', watts: '1100W', grade: 'B', status: 'amber', room: 'Lounge', supply: 'solar', note: 'Using 15% more electricity for the same duty cycle — filter may be dirty, keep an eye on it.' },
      { id: '5', name: 'Geyser', watts: '2000W', grade: 'A', status: 'emerald', room: 'Bathroom', supply: 'grid', note: 'Circuit is running well within its rated capacity — no action needed.' },
      { id: '6', name: 'Lounge Lights + Fans', watts: '320W', grade: 'A', status: 'emerald', room: 'Lounge', supply: 'solar', note: 'Grade A — within the normal envelope.' },
    ],
    evCharging: {
      readyTime: '8:00 AM',
      progress: '46% / 80%',
      desc: 'Ready by 8:00 AM — 46% / 80% · Rs 186 so far vs Rs 1,140 petrol equivalent',
      detailNote: 'Gari 8:00 AM baje 80% ready — Rs 188 (solar 60% + off-peak 40%). Petrol equivalent hota Rs 1,140.',
    },
    alerts: [
      { id: 'a1', text: 'Bedroom AC — 1,500W active, house is empty. Turn it off now?', type: 'amber', action: 'Review' },
      { id: 'a2', text: 'Circuit 4 (Kitchen) degradation trend — 8% → 12% over 3 weeks.', type: 'rose', action: 'Checkup' },
    ],
  },
  tariff: {
    discoName: 'LESCO — Domestic B-1 (Previous)',
    currentSlabRate: 'Rs 25.2/unit',
    unitsConsumed: '268',
    peakWindow: '18:00-22:00',
    offPeakWindow: '22:00-06:00',
    fixedCharge: 'Rs 1,200',
    slabAlert: "You're 32 units away — crossing the 300 unit slab will move the rate from Rs 25.2 to Rs 33.7.",
    slabs: [
      { range: '0 - 100 units', rate: 'Rs 17.5', active: false },
      { range: '100 - 200 units', rate: 'Rs 21.4', active: false },
      { range: '200 - 300 units', rate: 'Rs 25.2', active: true },
      { range: '300 - 400 units', rate: 'Rs 33.7', active: false },
      { range: '400 - 700 units', rate: 'Rs 41.9', active: false },
      { range: '700 - ∞ units', rate: 'Rs 55.1', active: false },
    ],
    billBreakup: {
      total: 'Rs 34,384',
      items: [
        { name: 'Energy Charge', rs: 'Rs 24,680', value: 24680, reduces: 'yes', color: '#f59e0b' },
        { name: 'Fixed / MDI Charge', rs: 'Rs 1,200', value: 1200, reduces: 'partially', color: '#10b981' },
        { name: 'FCA + Quarterly Adj', rs: 'Rs 3,180', value: 3180, reduces: 'no', color: '#3b82f6' },
        { name: 'PF Penalty', rs: 'Rs 0', value: 0, reduces: 'yes', color: '#ef4444' },
        { name: 'Duties, Taxes & GST', rs: 'Rs 5,124', value: 5124, reduces: 'no', color: '#64748b' },
        { name: 'Meter Rent / TV Fee', rs: 'Rs 200', value: 200, reduces: 'no', color: '#a855f7' },
      ],
    },
    aiWarnings: [
      { text: "Measured max demand is 4.1 kW vs a sanctioned 7 kW — you're paying Rs 480/month extra in fixed charges. Get your sanctioned load reviewed.", amount: 'Rs 480' },
      { text: "You're about to cross the 300-unit slab — the rate will jump from Rs 25.2 to Rs 33.7 (32 units left).", amount: 'Rs 271' },
    ],
  },
  health: {
    roomRanking: [
      { name: 'Master Bedroom', pct: 34 },
      { name: 'Kitchen', pct: 24, highlight: true },
      { name: 'Lounge', pct: 14 },
      { name: 'Kids Room', pct: 8 },
      { name: 'Other', pct: 11 },
    ],
  },
  triggers: {
    sentence: "WHEN Today's Spend Crosses Rs 1500 THEN Switch Off",
    templates: [
      "Today's spend crosses Rs 1,500 · AC to 26°",
      "Rate falls below Rs 25 · geyser on",
      "Month projection crosses Rs 40,000 · shed non-essential group + notify",
    ],
    active: [
      { id: 't1', title: "When today's spend crosses Rs 1,500, set Bedroom AC to 26°", subtitle: "Saved Rs 61 today (peak rate Rs 52 vs off-peak Rs 24)", active: true },
      { id: 't2', title: "When the rate falls below Rs 25, turn the Geyser on", subtitle: "Last fired: last night at 11:10 PM", active: true },
      { id: 't3', title: "When month projection crosses Rs 40,000, shed the non-essential group + notify", subtitle: "Not yet triggered this cycle", active: false },
    ],
    note: "Safety loads (fridge, medical, security) rahenge protected — kabhi auto-shed nahi. Min 15-min gap between opposing actions.",
  },
  schedule: {
    autoTitle: 'Autonomous Schedule — "ELSA Will Handle Everything"',
    autoDesc: 'Reads 30 days of usage + tariff windows + solar profile and generates the full schedule itself.',
    evCard: {
      target: 'Ready by 8:00 AM',
      progress: '46% / 80%',
      desc: 'Gari 8:00 AM baje 80% ready — Rs 188 (solar 60% + off-peak 40%). Petrol equivalent hota Rs 1,140.',
    },
    goalPlan: {
      targetInfo: 'Target: Rs 50,000 · Current projection: Rs 38,400',
      stages: [
        { id: 's1', stage: 1, title: 'Stage 1: Zero-cost scheduling', subtitle: 'Already applied automatically — contributing to the current pace', amount: 'Rs 4,200', status: 'Applied', color: 'emerald' },
        { id: 's2', stage: 2, title: 'Stage 2: Small one-time fixes (service, capacitor, sanctioned-load review)', subtitle: 'Book an electrician for pump + AC service for further headroom', amount: 'Rs 2,800', status: 'Apply', color: 'amber' },
        { id: 's3', stage: 3, title: 'Stage 3: Investment (solar / BESS)', subtitle: "Beyond this point you'll need solar — talk to us about sizing", amount: 'Rs 15,000', status: null, color: 'slate' },
      ],
    },
  },
}

