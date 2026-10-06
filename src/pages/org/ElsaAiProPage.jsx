import React, { useState } from 'react'
import {
  Zap, DollarSign, Activity, MessageSquare, Sun, CheckCircle2,
  AlertTriangle, ArrowRight, ShieldCheck, TrendingDown, Clock,
  Plus, Bell, Play, Sparkles, Filter, RefreshCw
} from 'lucide-react'
import {
  REAL_METERS, PLANT_TOTALS, TARIFF_CONFIG, DEFAULT_TRIGGERS,
  formatRs
} from '../../utils/elsaEngine'

export default function ElsaAiProPage() {
  // Simple 4 Tabs: Exactly the familiar original names, but consolidated to eliminate clutter!
  const [activeTab, setActiveTab] = useState('overview')

  // Triggers state for Bill & Tariff tab
  const [triggers, setTriggers] = useState(DEFAULT_TRIGGERS)
  const [whenDevice, setWhenDevice] = useState('Spray Booth Daily Spend')
  const [comparator, setComparator] = useState('>')
  const [thresholdRs, setThresholdRs] = useState('25000')
  const [actionThen, setActionThen] = useState('WhatsApp & Email Alert')

  // Auto Schedule toggle
  const [autoScheduleActive, setAutoScheduleActive] = useState(true)

  // Selected machine for Load Health detail modal/card
  const [selectedLoad, setSelectedLoad] = useState(REAL_METERS[1]) // Spray Booth default

  // Hey ELSA Chat state
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'elsa',
      text: 'Salam! Main ELSA hoon, Ambition plant ki AI Energy Engineer. Solar AFL (11.5 kW), Spray Booth (78.8 kW), aur Ground Floor feeder ka live telemetry data active hai. Aap bill, power factor, ya machine status ke baray mein pooch saktay hain.',
      time: '10:00 AM'
    }
  ])

  // Simple, familiar tab definitions
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Zap, subtitle: 'Live Pipeline, Energy Gauges & Source Flow' },
    { id: 'tariff', label: 'Bill & Tariff', icon: DollarSign, subtitle: 'Utility Slabs, Low-PF Penalty & Rupee Triggers' },
    { id: 'health', label: 'Load Health', icon: Activity, subtitle: 'Machine Health Grades & Solar Schedule' },
    { id: 'assistant', label: 'Hey ELSA', icon: MessageSquare, subtitle: 'Conversational Energy Assistant' },
  ]

  const handleAddTrigger = (e) => {
    e?.preventDefault()
    const newTrig = {
      id: `trig-${Date.now()}`,
      name: `${whenDevice} ${comparator} Rs ${thresholdRs}`,
      targetDevice: whenDevice,
      metric: 'rupee_cost',
      condition: comparator,
      threshold: Number(thresholdRs) || 0,
      channel: actionThen,
      cooldownMinutes: 15,
      status: 'active',
      lastTriggered: 'Just created — armed',
    }
    setTriggers([newTrig, ...triggers])
  }

  const handleSendChat = (e) => {
    e?.preventDefault()
    if (!chatInput.trim()) return
    const userText = chatInput.trim()
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: 'Just now' }])
    setChatInput('')

    setTimeout(() => {
      const q = userText.toLowerCase()
      let reply = "I am monitoring Ambition facility. Ask about live power, power factor, or today's bill."
      if (q.includes('spray') || q.includes('booth')) {
        reply = "Spray Booth abhi 78.8 kW draw kar raha hai with 0.49 PF (Grade C). Iski wajah se NEPRA low-PF penalty lagti hai. 85 kVAR Capacitor bank lagane se Rs 112,500/month ki bachat hogi."
      } else if (q.includes('solar') || q.includes('bijli')) {
        reply = "Solar AFL is currently generating 11.5 kW at 50.1 Hz frequency. Isne aaj Rs 4,140 ki utility grid electricity bacha li hai."
      } else if (q.includes('bill') || q.includes('cost') || q.includes('kharcha')) {
        reply = `Today's spend is estimated at ${formatRs(PLANT_TOTALS.todaySpendRs)}. Projected month bill is ${formatRs(PLANT_TOTALS.monthProjectedRs)} under ${TARIFF_CONFIG.discoName}.`
      } else if (q.includes('ground') || q.includes('imbalance')) {
        reply = "Ground Floor feeder par 65.8% current unbalance hai (Phase B 16.8A vs Phase C 4.6A). Neutral wire overheating se bachne ke liye Phase C par loads shift karna zaroori hai."
      }
      setChatMessages((prev) => [...prev, { sender: 'elsa', text: reply, time: 'Just now' }])
    }, 500)
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Clean Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-200 dark:border-surface-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              Clean 4-Page Layout
            </span>
            <span className="text-xs text-surface-400">Zero Features Skipped · Simple & Familiar</span>
          </div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-surface-100 tracking-tight mt-1">
            ELSA AI · Facility Energy Intelligence
          </h1>
          <p className="text-xs text-surface-500">
            Ambition Facility · Live data from Solar AFL, Spray Booth, and Ground Floor
          </p>
        </div>

        {/* Live heartbeat */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs font-semibold text-surface-700 dark:text-surface-300 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Feeders Online: 3 / 3</span>
        </div>
      </div>

      {/* 4 Simple, Familiar Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                  : 'bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} />
                <span className="font-bold text-sm">{t.label}</span>
              </div>
              <p className={`text-[11px] truncate ${isActive ? 'text-white/80' : 'text-surface-400'}`}>
                {t.subtitle}
              </p>
            </button>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW (Contains Original Overview + Original Source Flow)       */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 1. Live Source Flow Pipeline */}
          <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-400 mb-3">Live Energy Pipeline</h3>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
              <span className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <Sun size={14} /> Solar AFL (11.5 kW) · Live
              </span>
              <span className="text-surface-400">+</span>
              <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
                <Zap size={14} /> WAPDA Grid (113.5 kW) · Live
              </span>
              <span className="text-surface-400">→</span>
              <span className="px-3 py-2 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-black">
                🏭 Factory Total: {PLANT_TOTALS.totalDemandKw} kW
              </span>
            </div>
          </div>

          {/* 2. Top Spend & Saving KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Today (estimate)</p>
              <p className="text-2xl font-black text-surface-900 dark:text-surface-100 mt-0.5">{formatRs(PLANT_TOTALS.todaySpendRs)}</p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Month Projected</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">{formatRs(PLANT_TOTALS.monthProjectedRs)}</p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Target Budget</p>
              <p className="text-2xl font-black text-surface-900 dark:text-surface-100 mt-0.5">{formatRs(PLANT_TOTALS.monthlyBudgetRs)}</p>
            </div>
          </div>

          {/* 3. What ELSA Saved You Today */}
          <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
            <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100 mb-2">What ELSA Saved You Today</h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                Solar AFL: {formatRs(PLANT_TOTALS.solarSavingsTodayRs)}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                Total Saved: {formatRs(PLANT_TOTALS.solarSavingsTodayRs)}
              </span>
            </div>
          </div>

          {/* 4. Org Dials (MDI, PF, THD, Feeders) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">MDI Gauge</p>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-0.5">{PLANT_TOTALS.mdiKw} kW</p>
              <p className="text-xs text-surface-400 mt-0.5">of 150 kW sanctioned</p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">PF Dial</p>
              <p className="text-xl font-bold text-rose-600 mt-0.5">{PLANT_TOTALS.averagePf}</p>
              <p className="text-xs text-rose-500 font-medium mt-0.5">Below 0.90 limit</p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">THD Strip</p>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-0.5">3.2%</p>
              <p className="text-xs text-emerald-600 mt-0.5">Normal range</p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Feeders Online</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">3 / 3</p>
              <p className="text-xs text-surface-400 mt-0.5">100% connected</p>
            </div>
          </div>

          {/* 5. Source Flow: 24-Hour Solar Generation vs Factory Demand Chart */}
          <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">
                  24-Hour Solar Generation vs Factory Demand (Source Flow)
                </h3>
                <p className="text-xs text-surface-400">Solar rooftop offset vs WAPDA utility grid import</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span> Solar AFL (11.5 kW)
                </span>
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> Factory Demand (125 kW)
                </span>
              </div>
            </div>

            {/* SVG Visual Curve */}
            <div className="h-44 w-full bg-surface-50 dark:bg-surface-950 rounded-lg p-3 border border-surface-200 dark:border-surface-800 relative">
              <svg className="w-full h-full" viewBox="0 0 800 130" preserveAspectRatio="none">
                <line x1="0" y1="35" x2="800" y2="35" stroke="#e2e8f0" strokeDasharray="3" />
                <line x1="0" y1="70" x2="800" y2="70" stroke="#e2e8f0" strokeDasharray="3" />
                <line x1="0" y1="105" x2="800" y2="105" stroke="#e2e8f0" strokeDasharray="3" />
                {/* Factory Demand Area */}
                <path d="M0,95 L120,90 L240,65 L360,40 L480,38 L600,50 L720,80 L800,100 L800,130 L0,130 Z" fill="rgba(59, 130, 246, 0.12)" />
                <path d="M0,95 L120,90 L240,65 L360,40 L480,38 L600,50 L720,80 L800,100" stroke="#3b82f6" strokeWidth="2.5" fill="none" />
                {/* Solar Bell Curve */}
                <path d="M0,130 L220,130 L320,85 L400,20 L480,80 L580,130 L800,130 Z" fill="rgba(245, 158, 11, 0.2)" />
                <path d="M0,130 L220,130 L320,85 L400,20 L480,80 L580,130 L800,130" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] text-surface-400 mt-2 px-1 font-mono">
              <span>00:00</span>
              <span>06:00 (Sunrise)</span>
              <span className="text-amber-600 font-bold">12:00 (Solar Peak 11.5 kW)</span>
              <span>18:00 (Sunset)</span>
              <span>23:00</span>
            </div>
          </div>

          {/* 6. Load Grid (Feeders) */}
          <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
            <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100 mb-3">Load Grid</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {REAL_METERS.map((r) => (
                <div key={r.id} className="rounded-lg border border-surface-200 dark:border-surface-800 p-3 bg-surface-50 dark:bg-surface-950">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-surface-800 dark:text-surface-200 truncate">{r.name}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      r.grade === 'A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                      r.grade === 'B' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                    }`}>
                      Grade {r.grade}
                    </span>
                  </div>
                  <p className="text-lg font-black text-surface-900 dark:text-surface-100">{r.watts.toLocaleString()} W</p>
                  <p className="text-[11px] text-surface-400">PF: <strong className={r.pf < 0.85 ? 'text-rose-600' : 'text-surface-600 dark:text-surface-300'}>{r.pf}</strong> · {r.frequency} Hz</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. EV Charging Status Card */}
          <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
            <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100 mb-1.5 flex items-center gap-1.5">
              <span>🚗</span> EV Charging Status
            </h3>
            <p className="text-xs text-surface-600 dark:text-surface-300">
              Ready by 6:00 PM — 80% / 100% · Rs 450 so far vs Rs 1,800 petrol equivalent
            </p>
          </div>

          {/* 8. Alerts */}
          <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
            <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100 mb-2">Active Alerts</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center justify-between">
                <span>⚠️ Spray Booth Power Factor is 0.49 (Critical Low PF — NEPRA fine active)</span>
                <span className="font-bold">Grade C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 flex items-center justify-between">
                <span>⚠️ Ground Floor Feeder has 65.8% Current Imbalance (Phase B 16.8A vs Phase C 4.6A)</span>
                <span className="font-bold">Grade B</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BILL & TARIFF (Contains Bill & Tariff + Rupee Triggers)            */}
      {/* ========================================================================= */}
      {activeTab === 'tariff' && (
        <div className="space-y-5">
          {/* Bill Economics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Utility Tariff</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-100 mt-1">{TARIFF_CONFIG.discoName}</p>
              <div className="mt-2 text-xs space-y-1 text-surface-500">
                <p>Peak: <strong className="text-rose-600">Rs {TARIFF_CONFIG.peakRatePerKwh}/kWh</strong></p>
                <p>Off-Peak: <strong className="text-emerald-600">Rs {TARIFF_CONFIG.offPeakRatePerKwh}/kWh</strong></p>
              </div>
            </div>

            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Units Consumed (This Cycle)</p>
              <p className="text-2xl font-black text-surface-900 dark:text-surface-100 mt-1">26,450 kWh</p>
              <p className="text-xs text-surface-400 mt-1">11 days left · Projected: {formatRs(PLANT_TOTALS.monthProjectedRs)}</p>
            </div>

            <div className="card p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">NEPRA Low-PF Penalty Surcharge</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{formatRs(PLANT_TOTALS.nepraLowPfPenaltyRs)}</p>
              <p className="text-xs text-rose-600/80 mt-1">Due to Spray Booth (0.49 PF). Avoidable via 85 kVAR Capacitor Bank.</p>
            </div>
          </div>

          {/* Peak / Off-Peak TOU Hours Schedule */}
          <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
            <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100 mb-2">Time-of-Use (TOU) Tariff Windows</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
                <p className="font-bold text-rose-600">Peak Hours: 17:00 - 21:00 (5:00 PM - 9:00 PM)</p>
                <p className="text-surface-500 mt-1">Highest electricity rate (Rs 58.5/kWh). Avoid running heavy batch machinery.</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
                <p className="font-bold text-emerald-600">Solar Optimization Hours: 10:30 AM - 3:30 PM</p>
                <p className="text-surface-500 mt-1">Free rooftop solar electricity (Rs 0/kWh). Best window for Spray Booth batches.</p>
              </div>
            </div>
          </div>

          {/* Rupee Triggers Module (From Original Tab 4) */}
          <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100">
                Rupee Triggers (Financial Cost Automation)
              </h3>
              <p className="text-xs text-surface-400">
                Default automation unit = rupees, not amps. Sentence builder with 15-minute anti-spam cooldown.
              </p>
            </div>

            {/* Sentence Builder Form */}
            <form onSubmit={handleAddTrigger} className="flex flex-wrap items-end gap-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
              <div className="w-56">
                <label className="block text-[11px] font-bold text-surface-400 uppercase mb-1">WHEN</label>
                <select
                  value={whenDevice}
                  onChange={(e) => setWhenDevice(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-100"
                >
                  <option>Spray Booth Daily Spend</option>
                  <option>Ground Floor Daily Spend</option>
                  <option>Plant Total Spend</option>
                  <option>Spray Booth Power Factor</option>
                </select>
              </div>

              <div className="w-28">
                <label className="block text-[11px] font-bold text-surface-400 uppercase mb-1">Is</label>
                <select
                  value={comparator}
                  onChange={(e) => setComparator(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-100"
                >
                  <option>&gt; (Greater than)</option>
                  <option>&lt; (Less than)</option>
                </select>
              </div>

              <div className="w-32">
                <label className="block text-[11px] font-bold text-surface-400 uppercase mb-1">Rs</label>
                <input
                  type="text"
                  value={thresholdRs}
                  onChange={(e) => setThresholdRs(e.target.value.replace(/[^\d]/g, ''))}
                  className="w-full p-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-100"
                />
              </div>

              <div className="w-48">
                <label className="block text-[11px] font-bold text-surface-400 uppercase mb-1">THEN</label>
                <select
                  value={actionThen}
                  onChange={(e) => setActionThen(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-100"
                >
                  <option>WhatsApp & Email Alert</option>
                  <option>In-App Maintenance Alert</option>
                  <option>SMS Notification</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all"
              >
                + Add Trigger
              </button>
            </form>

            {/* Configured Triggers List */}
            <div className="space-y-2.5">
              {triggers.map((tr) => (
                <div key={tr.id} className="p-3.5 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-surface-900 dark:text-surface-100">{tr.name}</p>
                    <p className="text-[11px] text-surface-400 mt-0.5">
                      Action: {tr.channel} · Cooldown: {tr.cooldownMinutes} min · {tr.lastTriggered}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 w-fit">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LOAD HEALTH (Contains Load Health + Auto Schedule & EV)            */}
      {/* ========================================================================= */}
      {activeTab === 'health' && (
        <div className="space-y-5">
          {/* Equipment Health Leaderboard */}
          <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
            <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100 mb-1">Per-Load Health Report</h3>
            <p className="text-xs text-surface-400 mb-3">Diagnostic grades based on IEEE Power Factor and NEMA Phase Imbalance</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {REAL_METERS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedLoad(m)}
                  className={`text-left rounded-xl border p-4 transition-all ${
                    selectedLoad?.id === m.id
                      ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-950/20'
                      : 'border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-surface-900 dark:text-surface-100">{m.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                      m.grade === 'A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                      m.grade === 'B' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                    }`}>
                      Grade {m.grade}
                    </span>
                  </div>
                  <p className="text-xs text-surface-400">{m.watts.toLocaleString()} W · PF: <strong className={m.pf < 0.85 ? 'text-rose-600' : ''}>{m.pf}</strong></p>
                  <p className="text-xs text-surface-600 dark:text-surface-300 mt-2 line-clamp-2">
                    {m.issue || 'Operating normally with high efficiency.'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Machine Detail Card */}
          {selectedLoad && (
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-surface-900 dark:text-surface-100">{selectedLoad.name} · Diagnostic Detail</h4>
                  <p className="text-xs text-surface-400">Technical telemetry values logged from meter</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-black ${
                  selectedLoad.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                  selectedLoad.grade === 'B' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  Grade {selectedLoad.grade}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
                  <p className="text-surface-400">Active Power</p>
                  <p className="text-base font-bold text-surface-900 dark:text-surface-100 mt-0.5">{selectedLoad.activePowerKw} kW</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
                  <p className="text-surface-400">Power Factor</p>
                  <p className={`text-base font-bold mt-0.5 ${selectedLoad.pf < 0.85 ? 'text-rose-600' : 'text-emerald-600'}`}>{selectedLoad.pf}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
                  <p className="text-surface-400">3-Phase Amps</p>
                  <p className="text-xs font-bold text-surface-900 dark:text-surface-100 mt-0.5">{selectedLoad.current.join('A, ')}A</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
                  <p className="text-surface-400">Frequency</p>
                  <p className="text-base font-bold text-surface-900 dark:text-surface-100 mt-0.5">{selectedLoad.frequency} Hz</p>
                </div>
              </div>

              {selectedLoad.recommendation && (
                <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 text-xs text-primary-800 dark:text-primary-200">
                  <p className="font-bold">Corrective Recommendation:</p>
                  <p className="mt-0.5">{selectedLoad.recommendation}</p>
                </div>
              )}
            </div>
          )}

          {/* Autonomous Schedule & EV (From Original Tab 5) */}
          <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100">
                  Autonomous Schedule — "ELSA Will Handle Everything"
                </h3>
                <p className="text-xs text-surface-400">
                  Reads 30 days of usage + tariff windows + solar profile and generates the full schedule itself.
                </p>
              </div>
              <button
                onClick={() => setAutoScheduleActive(!autoScheduleActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  autoScheduleActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300'
                }`}
              >
                {autoScheduleActive ? 'Auto Mode: ON' : 'Enable Auto Mode'}
              </button>
            </div>

            {autoScheduleActive && (
              <div className="space-y-2 pt-2 border-t border-surface-100 dark:border-surface-800">
                <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 text-xs">
                  <div>
                    <span className="font-bold text-primary-600">11:30 AM — Spray Booth Batch</span>
                    <p className="text-surface-500">Run heavy cycle during peak solar window (10:30 AM - 3:30 PM)</p>
                  </div>
                  <span className="font-bold text-emerald-600">Saves ~Rs 4,500</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 text-xs">
                  <div>
                    <span className="font-bold text-rose-600">5:00 PM — Peak Curtailment</span>
                    <p className="text-surface-500">Shut non-essential ACs before evening peak tariff (Rs 58.5/kWh)</p>
                  </div>
                  <span className="font-bold text-emerald-600">Avoids Rs 3,200 fine</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HEY ELSA (Conversational AI Assistant)                             */}
      {/* ========================================================================= */}
      {activeTab === 'assistant' && (
        <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-200 dark:border-surface-800">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
              E
            </div>
            <div>
              <h3 className="font-bold text-base text-surface-900 dark:text-surface-100">Hey ELSA · AI Energy Engineer</h3>
              <p className="text-xs text-surface-400">Connected to Ambition live telemetry (Approach 2 Prompt Injection)</p>
            </div>
          </div>

          {/* Quick Questions Chips */}
          <div className="flex flex-wrap gap-1.5 pb-2">
            {[
              'Spray Booth status?',
              'Solar kitni bijli bana raha hai?',
              "Today's bill estimate?",
              'Ground Floor unbalance?'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setChatInput(chip)
                }}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-surface-700 transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div className="space-y-3 h-80 overflow-y-auto p-2 border border-surface-100 dark:border-surface-800 rounded-xl bg-surface-50/50 dark:bg-surface-950">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 border border-surface-200 dark:border-surface-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-surface-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Poochhein: 'Spray Booth status?', 'Solar generation?', 'Today bill'..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
