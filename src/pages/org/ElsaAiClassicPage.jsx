import React, { useState } from 'react'
import {
  Zap, DollarSign, Activity, Bell, Calendar, GitFork, MessageSquare,
  Sun, AlertTriangle, ArrowRight, ShieldCheck, Gauge, CheckCircle2,
  TrendingDown, TrendingUp, Sliders, Play, Plus, Clock, BatteryCharging
} from 'lucide-react'
import {
  REAL_METERS, PLANT_TOTALS, TARIFF_CONFIG, DEFAULT_TRIGGERS,
  formatRs, calculateLowPfPenalty
} from '../../utils/elsaEngine'

export default function ElsaAiClassicPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [triggers, setTriggers] = useState(DEFAULT_TRIGGERS)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'elsa',
      text: 'Salam! Main ELSA hoon, Ambition plant ki energy assistant. Aap factory load, Solar AFL, Spray Booth status, ya bijli bill ke baray mein kuch bhi pooch saktay hain.',
      time: '10:00 AM'
    }
  ])

  const tabs = [
    { id: 'overview', label: '1. Overview', icon: Zap },
    { id: 'tariff', label: '2. Bill & Tariff', icon: DollarSign },
    { id: 'health', label: '3. Load Health', icon: Activity },
    { id: 'triggers', label: '4. Rupee Triggers', icon: Bell },
    { id: 'schedule', label: '5. Auto Schedule & EV', icon: Calendar },
    { id: 'flow', label: '6. Source Flow', icon: GitFork },
    { id: 'assistant', label: '7. Hey ELSA', icon: MessageSquare },
  ]

  const handleSendChat = (e) => {
    e?.preventDefault()
    if (!chatInput.trim()) return
    const userText = chatInput.trim()
    const newMsgs = [...chatMessages, { sender: 'user', text: userText, time: 'Just now' }]
    setChatMessages(newMsgs)
    setChatInput('')

    // Deterministic response generator grounded in real telemetry
    setTimeout(() => {
      const q = userText.toLowerCase()
      let reply = "I'm monitoring Solar AFL, Spray Booth, and Ground Floor. Ask about live power, power factor, or today's bill."
      if (q.includes('spray') || q.includes('booth')) {
        reply = `Spray Booth abhi 78.8 kW draw kar raha hai. Iska Power Factor 0.49 bohot kam hai (Grade C), jiski wajah se NEPRA penalty lag rahi hai. 85 kVAR Capacitor bank required hai.`
      } else if (q.includes('solar') || q.includes('bijli')) {
        reply = `Solar AFL is currently generating 11.5 kW at 50.1 Hz frequency. Yeh plant ko free zero-cost energy de raha hai.`
      } else if (q.includes('bill') || q.includes('cost') || q.includes('kharcha')) {
        reply = `Today's estimated spend is ${formatRs(PLANT_TOTALS.todaySpendRs)}. Projected month bill is ${formatRs(PLANT_TOTALS.monthProjectedRs)} under ${TARIFF_CONFIG.discoName}.`
      } else if (q.includes('ground') || q.includes('imbalance')) {
        reply = `Ground Floor feeder par 65.8% current unbalance hai (Phase B 16.8A vs Phase C 4.6A). Neutral wire overheating se bachne ke liye loads balance karna zaroori hai.`
      }
      setChatMessages((prev) => [...prev, { sender: 'elsa', text: reply, time: 'Just now' }])
    }, 600)
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-200 dark:border-surface-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Version 1: Classic (Original Prototype)
            </span>
            <span className="text-xs text-surface-400">7 Separate Tabs Layout</span>
          </div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-surface-100 tracking-tight mt-1">
            ELSA AI · Facility Energy Intelligence
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Monitoring Ambition facility with real live meters (Solar AFL, Spray Booth, Ground Floor)
          </p>
        </div>
      </div>

      {/* 7 Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-surface-200 dark:border-surface-800 no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Live Pipeline Flow */}
          <div className="card p-5 border border-surface-200 dark:border-surface-800 rounded-xl bg-surface-50/50 dark:bg-surface-900/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-400 mb-3">Live Energy Pipeline</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <Sun size={14} /> Solar AFL (11.5 kW) · Live
              </div>
              <span className="text-surface-400">+</span>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <Zap size={14} /> WAPDA Grid (113.5 kW) · Live
              </div>
              <span className="text-surface-400">→</span>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
                🏭 Factory Total: {PLANT_TOTALS.totalDemandKw} kW
              </div>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">Today's Spend (Est)</p>
              <p className="text-2xl font-black text-surface-900 dark:text-surface-100 mt-1">{formatRs(PLANT_TOTALS.todaySpendRs)}</p>
              <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                <TrendingDown size={12} /> Saved {formatRs(PLANT_TOTALS.solarSavingsTodayRs)} via Solar
              </p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">Month Projected</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{formatRs(PLANT_TOTALS.monthProjectedRs)}</p>
              <p className="text-xs text-surface-400 mt-1">Budget: {formatRs(PLANT_TOTALS.monthlyBudgetRs)}</p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">Peak Demand (MDI)</p>
              <p className="text-2xl font-black text-surface-900 dark:text-surface-100 mt-1">{PLANT_TOTALS.mdiKw} kW</p>
              <p className="text-xs text-surface-400 mt-1">of 150 kW Sanctioned Load</p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">Plant Average PF</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{PLANT_TOTALS.averagePf}</p>
              <p className="text-xs text-rose-500 font-medium mt-1">Below NEPRA 0.90 limit</p>
            </div>
          </div>

          {/* Machine Grid */}
          <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800">
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 mb-4">Active Equipment Telemetry</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REAL_METERS.map((m) => (
                <div key={m.id} className="p-4 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-surface-900 dark:text-surface-100">{m.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                      m.grade === 'A' ? 'bg-emerald-500/20 text-emerald-600' :
                      m.grade === 'B' ? 'bg-amber-500/20 text-amber-600' : 'bg-rose-500/20 text-rose-600'
                    }`}>
                      Grade {m.grade}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-surface-600 dark:text-surface-300">
                    <p className="text-base font-black text-surface-900 dark:text-surface-100">{m.activePowerKw} kW</p>
                    <p>Power Factor: <span className={m.pf < 0.85 ? 'text-rose-600 font-bold' : 'text-emerald-600'}>{m.pf}</span></p>
                    <p>Frequency: {m.frequency} Hz</p>
                    {m.issue && <p className="text-[11px] text-rose-500 font-medium mt-2">{m.issue}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BILL & TARIFF */}
      {activeTab === 'tariff' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-xs font-bold text-surface-400 uppercase">Utility Tariff</p>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">{TARIFF_CONFIG.discoName}</p>
              <div className="mt-3 text-xs space-y-1 text-surface-500">
                <p>Peak Rate: <strong className="text-surface-800 dark:text-surface-200">Rs {TARIFF_CONFIG.peakRatePerKwh}/kWh</strong></p>
                <p>Off-Peak Rate: <strong className="text-surface-800 dark:text-surface-200">Rs {TARIFF_CONFIG.offPeakRatePerKwh}/kWh</strong></p>
              </div>
            </div>
            <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-xs font-bold text-surface-400 uppercase">Units Consumed (This Cycle)</p>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">26,450 kWh</p>
              <p className="text-xs text-surface-400 mt-1">11 days left in billing period</p>
            </div>
            <div className="card p-5 rounded-xl border border-rose-500/20 bg-rose-500/5">
              <p className="text-xs font-bold text-rose-600 uppercase">NEPRA Low-PF Penalty</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{formatRs(PLANT_TOTALS.nepraLowPfPenaltyRs)}</p>
              <p className="text-xs text-rose-600/80 mt-1">Due to Spray Booth PF (0.49). Recoverable by installing capacitors.</p>
            </div>
          </div>

          <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800">
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 mb-3">Tariff Slabs & TOU Peak Schedule</h3>
            <div className="p-4 rounded-lg bg-surface-100 dark:bg-surface-800/50 text-xs space-y-2">
              <p><strong>Peak Hours:</strong> {TARIFF_CONFIG.peakWindow} · High Tariff (Avoid running heavy machines like Spray Booth).</p>
              <p><strong>Solar Optimization Hours:</strong> {TARIFF_CONFIG.solarZeroCostWindow} · Free Solar Energy (Rs 0/kWh).</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOAD HEALTH */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REAL_METERS.map((m) => (
              <div key={m.id} className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-surface-900 dark:text-surface-100">{m.name}</h4>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    m.grade === 'A' ? 'bg-emerald-500/20 text-emerald-600' :
                    m.grade === 'B' ? 'bg-amber-500/20 text-amber-600' : 'bg-rose-500/20 text-rose-600'
                  }`}>
                    Grade {m.grade}
                  </span>
                </div>
                <div className="text-xs space-y-1.5 text-surface-600 dark:text-surface-300">
                  <p>Active Draw: <strong>{m.activePowerKw} kW</strong></p>
                  <p>Power Factor: <strong>{m.pf}</strong></p>
                  <p>Currents (A, B, C): <strong>{m.current.join('A, ')}A</strong></p>
                </div>
                {m.issue && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 space-y-1">
                    <p className="font-bold">{m.issue}</p>
                    <p className="text-surface-500 dark:text-surface-400">Action: {m.recommendation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RUPEE TRIGGERS */}
      {activeTab === 'triggers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Configured Rupee Triggers</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-bold">
              <Plus size={14} /> Add New Trigger
            </button>
          </div>
          <div className="space-y-3">
            {triggers.map((tr) => (
              <div key={tr.id} className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-surface-900 dark:text-surface-100">{tr.name}</h4>
                  <p className="text-xs text-surface-500">Target: {tr.targetDevice} · Condition: {tr.metric} {tr.condition} {tr.threshold} · Via {tr.channel}</p>
                  <p className="text-[11px] text-amber-600 mt-1">Anti-Spam Cooldown: {tr.cooldownMinutes} minutes · Last triggered: {tr.lastTriggered}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 w-fit">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUTO SCHEDULE & EV */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800">
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 mb-2">Solar Peak Operation Advisor</h3>
            <p className="text-xs text-surface-500 mb-4">Shifting heavy energy-intensive loads to zero-cost solar hours</p>
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
              <p className="font-bold">Recommendation: Shift Spray Booth Batch to 11:30 AM</p>
              <p>Spray Booth requires 78.8 kW. Running between 11:00 AM - 3:00 PM offsets high utility bills using free rooftop solar, saving ~Rs 4,500 per run.</p>
            </div>
          </div>
          <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800 opacity-60">
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 mb-2">EV Fleet Charging Schedule</h3>
            <p className="text-xs text-surface-400">Hardware Gateway status: Pending EV Charger installation.</p>
          </div>
        </div>
      )}

      {/* TAB 6: SOURCE FLOW */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-xs font-bold text-emerald-600 uppercase">Priority 1: Solar AFL</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">11.5 kW</p>
              <p className="text-xs text-emerald-600/80 mt-1">Cost: Rs 0/kWh · Offsetting 9.2% plant load</p>
            </div>
            <div className="card p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
              <p className="text-xs font-bold text-blue-600 uppercase">Priority 2: WAPDA Grid</p>
              <p className="text-2xl font-black text-blue-600 mt-1">113.5 kW</p>
              <p className="text-xs text-blue-600/80 mt-1">Cost: Rs 42.0/kWh off-peak</p>
            </div>
            <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-xs font-bold text-surface-400 uppercase">Priority 3: Diesel Gen</p>
              <p className="text-2xl font-black text-surface-400 mt-1">0.0 kW</p>
              <p className="text-xs text-surface-400 mt-1">Cost: Rs 90.0+/kWh (Standby)</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: HEY ELSA */}
      {activeTab === 'assistant' && (
        <div className="card p-5 rounded-xl border border-surface-200 dark:border-surface-800 max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-200 dark:border-surface-800">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
              E
            </div>
            <div>
              <h3 className="font-bold text-base text-surface-900 dark:text-surface-100">Hey ELSA · AI Energy Engineer</h3>
              <p className="text-xs text-surface-400">Connected to Ambition live telemetry (Approach 2 Prompt Injection)</p>
            </div>
          </div>

          <div className="space-y-3 h-80 overflow-y-auto p-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-surface-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-surface-200 dark:border-surface-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Poochhein: 'Spray Booth status?', 'Solar kitni bijli bana raha hai?'..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
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
