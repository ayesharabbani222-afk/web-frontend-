import React, { useState } from 'react'
import {
  Zap, DollarSign, Activity, Bell, Calendar, GitFork, MessageSquare,
  Sun, AlertTriangle, ArrowRight, ShieldCheck, Gauge, CheckCircle2,
  TrendingDown, TrendingUp, Sliders, Play, Plus, Clock, BatteryCharging,
  Sparkles, X, ChevronRight, BarChart3, Filter, Send
} from 'lucide-react'
import {
  REAL_METERS, PLANT_TOTALS, TARIFF_CONFIG, DEFAULT_TRIGGERS,
  formatRs, calculateCurrentImbalance, calculateLowPfPenalty
} from '../../utils/elsaEngine'

export default function ElsaAiProPage() {
  const [activeWorkspace, setActiveWorkspace] = useState('command') // 'command' | 'financial' | 'health'
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [triggers, setTriggers] = useState(DEFAULT_TRIGGERS)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'elsa',
      text: 'Salam! Main ELSA hoon, Ambition plant ki AI Energy Engineer. Solar AFL, Spray Booth, aur Ground Floor ka live telemetry data active hai. Aap English ya Roman Urdu mein kuch bhi pooch saktay hain.',
      time: '10:00 AM'
    }
  ])

  const workspaces = [
    {
      id: 'command',
      label: 'Plant Command & Flow',
      desc: 'Live Pipeline, MDI Dials & Solar Generation Flow',
      icon: Zap,
      badge: 'Live 125 kW'
    },
    {
      id: 'financial',
      label: 'Financials & Triggers',
      desc: 'Tariff Slabs, Low-PF Penalties & Rupee Rules',
      icon: DollarSign,
      badge: 'Save Rs 112k'
    },
    {
      id: 'health',
      label: 'Load Health & Optimizer',
      desc: 'Fleet Health Diagnostics & Solar Load Shifting',
      icon: Activity,
      badge: '1 Alert'
    },
  ]

  const handleSendChat = (e) => {
    e?.preventDefault()
    if (!chatInput.trim()) return
    const userText = chatInput.trim()
    const newMsgs = [...chatMessages, { sender: 'user', text: userText, time: 'Just now' }]
    setChatMessages(newMsgs)
    setChatInput('')

    setTimeout(() => {
      const q = userText.toLowerCase()
      let reply = "Monitoring Ambition facility. Inquire about equipment health, solar displacement, or bill projections."
      if (q.includes('spray') || q.includes('booth')) {
        reply = `Spray Booth 78.8 kW draw kar raha hai with 0.49 PF (Grade C). Iski wajah se NEPRA low-PF penalty lagti hai. 85 kVAR Capacitor bank lagane se Rs 112,500/month ki bachat hogi.`
      } else if (q.includes('solar') || q.includes('bijli')) {
        reply = `Solar AFL is generating 11.5 kW right now at 50.1 Hz. It has offset Rs 4,140 in electricity costs today.`
      } else if (q.includes('bill') || q.includes('cost') || q.includes('kharcha')) {
        reply = `Today's spend is estimated at ${formatRs(PLANT_TOTALS.todaySpendRs)}. Projected month bill is ${formatRs(PLANT_TOTALS.monthProjectedRs)} under ${TARIFF_CONFIG.discoName}.`
      } else if (q.includes('ground') || q.includes('imbalance')) {
        reply = `Ground Floor feeder par 65.8% current unbalance hai (Phase B 16.8A vs Phase C 4.6A). Neutral wire overheating se bachne ke liye Phase C par loads balance karna zaroori hai.`
      }
      setChatMessages((prev) => [...prev, { sender: 'elsa', text: reply, time: 'Just now' }])
    }, 600)
  }

  const handleQuickPrompt = (prompt) => {
    setChatInput(prompt)
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto relative">
      {/* Executive Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-200 dark:border-surface-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Version 2: Executive (Streamlined & Consolidated)
            </span>
            <span className="text-xs text-surface-400">Zero Features Skipped · 3 Cohesive Workspaces</span>
          </div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-surface-100 tracking-tight mt-1 flex items-center gap-2">
            ELSA AI · Executive Energy Command
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Ambition Facility · Unified Telemetry & Financial Intelligence
          </p>
        </div>

        {/* Co-Pilot Persistent Drawer Trigger */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Sparkles size={16} />
          <span>✨ Hey ELSA Co-Pilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* 3 Executive Workspaces Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {workspaces.map((ws) => {
          const Icon = ws.icon
          const isActive = activeWorkspace === ws.id
          return (
            <button
              key={ws.id}
              onClick={() => setActiveWorkspace(ws.id)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 shadow-sm'
                  : 'border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700 bg-white dark:bg-surface-900'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary-600" />
              )}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300'}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-sm font-bold ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-surface-800 dark:text-surface-200'}`}>
                    {ws.label}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500">
                  {ws.badge}
                </span>
              </div>
              <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-1">{ws.desc}</p>
            </button>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* WORKSPACE 1: PLANT COMMAND & ENERGY FLOW (Overview + Source Flow)        */}
      {/* ========================================================================= */}
      {activeWorkspace === 'command' && (
        <div className="space-y-6">
          {/* Live Ingestion Pipeline Flow */}
          <div className="card p-5 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-surface-400">Live Plant Energy Flow Pipeline</h3>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All 3 Feeders Online & Streaming
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300">
                <p className="text-[11px] font-bold uppercase">1. Solar AFL (Rooftop)</p>
                <p className="text-xl font-black mt-0.5">11.5 kW</p>
                <p className="text-[10px] opacity-80">Rs 0/kWh · Priority 1 Inflow</p>
              </div>
              <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-700 dark:text-blue-300">
                <p className="text-[11px] font-bold uppercase">2. WAPDA Utility Grid</p>
                <p className="text-xl font-black mt-0.5">113.5 kW</p>
                <p className="text-[10px] opacity-80">Rs 42/kWh · Priority 2 Inflow</p>
              </div>
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300">
                <p className="text-[11px] font-bold uppercase">3. Total Plant Demand</p>
                <p className="text-xl font-black mt-0.5">125.0 kW</p>
                <p className="text-[10px] opacity-80">Solar Offsetting 9.2% of Factory</p>
              </div>
              <div className="p-3.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
                <p className="text-[11px] font-bold uppercase text-surface-400">Daily Solar Savings</p>
                <p className="text-xl font-black text-emerald-600 mt-0.5">{formatRs(PLANT_TOTALS.solarSavingsTodayRs)}</p>
                <p className="text-[10px] text-surface-400">Net Money Saved Today</p>
              </div>
            </div>
          </div>

          {/* Dials & Strategic Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">Today's Spend</p>
              <p className="text-2xl font-black text-surface-900 dark:text-surface-100 mt-1">{formatRs(PLANT_TOTALS.todaySpendRs)}</p>
              <p className="text-xs text-surface-400 mt-1">Projection: {formatRs(PLANT_TOTALS.monthProjectedRs)}</p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">Peak Demand (MDI)</p>
              <p className="text-2xl font-black text-surface-900 dark:text-surface-100 mt-1">{PLANT_TOTALS.mdiKw} kW</p>
              <p className="text-xs text-emerald-600 mt-1">Under 150 kW Sanctioned Limit</p>
            </div>
            <div className="card p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-widest">Plant Average PF</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{PLANT_TOTALS.averagePf}</p>
              <p className="text-xs text-rose-600 font-medium mt-1">Incurs NEPRA Low-PF Penalty</p>
            </div>
            <div className="card p-4 rounded-xl border border-surface-200 dark:border-surface-800">
              <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">Active Equipment</p>
              <p className="text-2xl font-black text-surface-900 dark:text-surface-100 mt-1">3 / 3 Nodes</p>
              <p className="text-xs text-surface-400 mt-1">Solar AFL, Spray Booth, Ground</p>
            </div>
          </div>

          {/* Machine Grid & Power Contribution */}
          <div className="card p-5 rounded-2xl border border-surface-200 dark:border-surface-800">
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 mb-4">Live Feeder Roster</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REAL_METERS.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-surface-900 dark:text-surface-100">{m.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                      m.grade === 'A' ? 'bg-emerald-500/20 text-emerald-600' :
                      m.grade === 'B' ? 'bg-amber-500/20 text-amber-600' : 'bg-rose-500/20 text-rose-600'
                    }`}>
                      Grade {m.grade}
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-surface-600 dark:text-surface-300">
                    <p className="text-lg font-black text-surface-900 dark:text-surface-100">{m.activePowerKw} kW</p>
                    <p>Power Factor: <strong className={m.pf < 0.85 ? 'text-rose-600' : 'text-emerald-600'}>{m.pf}</strong></p>
                    <p>3-Phase Amps: {m.current.join('A, ')}A</p>
                    {m.issue && <p className="text-[11px] text-rose-500 font-semibold pt-1 border-t border-surface-200 dark:border-surface-800">{m.issue}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 2: FINANCIAL INTELLIGENCE & TRIGGERS (Bill & Tariff + Triggers)*/}
      {/* ========================================================================= */}
      {activeWorkspace === 'financial' && (
        <div className="space-y-6">
          {/* Bill Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 rounded-2xl border border-surface-200 dark:border-surface-800">
              <p className="text-xs font-bold text-surface-400 uppercase">Utility Tariff</p>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">{TARIFF_CONFIG.discoName}</p>
              <div className="mt-3 text-xs space-y-1 text-surface-500">
                <p>Peak Rate (17:00-21:00): <strong className="text-rose-600">Rs {TARIFF_CONFIG.peakRatePerKwh}/kWh</strong></p>
                <p>Off-Peak Rate: <strong className="text-emerald-600">Rs {TARIFF_CONFIG.offPeakRatePerKwh}/kWh</strong></p>
              </div>
            </div>
            <div className="card p-5 rounded-2xl border border-surface-200 dark:border-surface-800">
              <p className="text-xs font-bold text-surface-400 uppercase">Units Consumed (This Cycle)</p>
              <p className="text-2xl font-black text-surface-900 dark:text-surface-100 mt-1">26,450 kWh</p>
              <p className="text-xs text-surface-400 mt-1">11 days left · Projected: {formatRs(PLANT_TOTALS.monthProjectedRs)}</p>
            </div>
            <div className="card p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5">
              <p className="text-xs font-bold text-rose-600 uppercase">NEPRA Low-PF Penalty Surcharge</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{formatRs(PLANT_TOTALS.nepraLowPfPenaltyRs)}</p>
              <p className="text-xs text-rose-600 mt-1">Spray Booth PF (0.49). 100% recoverable with Capacitor Bank.</p>
            </div>
          </div>

          {/* Rupee Triggers Manager */}
          <div className="card p-5 rounded-2xl border border-surface-200 dark:border-surface-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">Active Rupee Triggers & Financial Safeguards</h3>
                <p className="text-xs text-surface-500">Rules evaluated every minute with 15-minute anti-spam throttle</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-bold">
                <Plus size={14} /> Add Trigger
              </button>
            </div>
            <div className="space-y-3">
              {triggers.map((tr) => (
                <div key={tr.id} className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-surface-900 dark:text-surface-100">{tr.name}</h4>
                    <p className="text-xs text-surface-500 mt-0.5">
                      Target: <strong>{tr.targetDevice}</strong> · Criteria: <strong>{tr.metric} {tr.condition} {tr.threshold}</strong> · Dispatch: <strong>{tr.channel}</strong>
                    </p>
                    <p className="text-[11px] text-amber-600 mt-1">Cooldown: {tr.cooldownMinutes}m · Last Fired: {tr.lastTriggered}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 w-fit">
                    Active & Monitored
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 3: LOAD HEALTH & OPTIMIZATION (Load Health + Auto Schedule)     */}
      {/* ========================================================================= */}
      {activeWorkspace === 'health' && (
        <div className="space-y-6">
          {/* Equipment Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REAL_METERS.map((m) => (
              <div key={m.id} className="card p-5 rounded-2xl border border-surface-200 dark:border-surface-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-surface-900 dark:text-surface-100">{m.name}</h4>
                  <span className={`px-2.5 py-1 rounded text-xs font-black ${
                    m.grade === 'A' ? 'bg-emerald-500/20 text-emerald-600' :
                    m.grade === 'B' ? 'bg-amber-500/20 text-amber-600' : 'bg-rose-500/20 text-rose-600'
                  }`}>
                    Grade {m.grade}
                  </span>
                </div>
                <div className="text-xs space-y-1.5 text-surface-600 dark:text-surface-300">
                  <p>Active Draw: <strong>{m.activePowerKw} kW</strong></p>
                  <p>Power Factor: <strong className={m.pf < 0.85 ? 'text-rose-600' : 'text-emerald-600'}>{m.pf}</strong></p>
                  <p>3-Phase Currents: <strong>{m.current.join('A, ')}A</strong></p>
                  {m.id === 'ground-floor' && (
                    <p className="text-rose-600 font-bold">NEMA Current Imbalance: 65.8% (Severe)</p>
                  )}
                </div>
                {m.issue && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 space-y-1">
                    <p className="font-bold">{m.issue}</p>
                    <p className="text-surface-600 dark:text-surface-300">Recommendation: {m.recommendation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Solar Peak Load Shifting Advisor */}
          <div className="card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-2">
              ⚡ Solar Peak Load Shifting Advisor (Auto Schedule)
            </h3>
            <p className="text-xs text-emerald-600/90 mb-3">
              Matching heavy industrial equipment to rooftop solar peak hours (10:30 AM - 3:30 PM)
            </p>
            <div className="p-4 rounded-xl bg-white dark:bg-surface-800 border border-emerald-500/20 text-xs space-y-2">
              <p className="font-bold text-surface-900 dark:text-surface-100">
                Action Recommendation: Shift Spray Booth Batch Runs to 11:30 AM
              </p>
              <p className="text-surface-600 dark:text-surface-300">
                Spray Booth requires 78.8 kW. Operating this load during mid-day solar peak allows direct displacement of expensive grid electricity, saving an estimated <strong>Rs 4,500 per production batch</strong>.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-surface-200 dark:border-surface-700 text-[11px] text-surface-400">
                <Clock size={12} />
                <span>Peak Utility Surcharge starts at 5:00 PM (Rs 58.5/kWh). Avoid operating non-essential loads.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSISTENT CO-PILOT SLIDE-OUT DRAWER (Hey ELSA)                           */}
      {/* ========================================================================= */}
      {isCopilotOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-surface-900 h-full shadow-2xl flex flex-col border-l border-surface-200 dark:border-surface-800">
            {/* Drawer Header */}
            <div className="p-4 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between bg-surface-50 dark:bg-surface-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  ✨
                </div>
                <div>
                  <h3 className="font-bold text-sm text-surface-900 dark:text-surface-100">Hey ELSA Co-Pilot</h3>
                  <p className="text-[10px] text-surface-400">Live Ambition Telemetry Context</p>
                </div>
              </div>
              <button
                onClick={() => setIsCopilotOpen(false)}
                className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Questions Chips */}
            <div className="p-3 border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50 flex flex-wrap gap-1.5">
              {[
                'Spray Booth status?',
                'Solar kitni bijli bana raha hai?',
                "Today's bill estimate?",
                'Ground Floor unbalance?'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleQuickPrompt(chip)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-primary-50 hover:text-primary-600 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
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

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-surface-200 dark:border-surface-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask ELSA in English or Roman Urdu..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-all"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
