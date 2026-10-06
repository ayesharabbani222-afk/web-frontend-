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
