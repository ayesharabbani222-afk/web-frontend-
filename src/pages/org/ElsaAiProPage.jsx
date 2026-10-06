import React, { useState } from 'react'
import {
  Zap, DollarSign, Activity, MessageSquare, Sun, CheckCircle2,
  AlertTriangle, ArrowRight, ShieldCheck, TrendingDown, Clock,
  Plus, Bell, Play, Sparkles, Filter, RefreshCw, X, ChevronRight,
  Send, Bot, Battery, Radio, Flame, Check, SlidersHorizontal, ArrowUpRight
} from 'lucide-react'

export default function ElsaAiProPage() {
  // 3 Core Pages + Floating Hey ELSA Drawer
  const [activeTab, setActiveTab] = useState('overview')
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)

  // Facility mode: 'ambition' (Real live factory meters) vs 'demo' (Original prototype home data)
  const [facilityMode, setFacilityMode] = useState('ambition')

  // Rupee Triggers State
  const [whenDevice, setWhenDevice] = useState("Today's Spend")
  const [comparator, setComparator] = useState('Crosses')
  const [thresholdRs, setThresholdRs] = useState('1500')
  const [actionThen, setActionThen] = useState('Switch Off')
  const [activeTriggers, setActiveTriggers] = useState([
    {
      id: 't1',
      title: "When today's spend crosses Rs 1,500, set Bedroom AC to 26°",
      subtitle: 'Saved Rs 61 today (peak rate Rs 52 vs off-peak Rs 24)',
      active: true,
    },
    {
      id: 't2',
      title: 'When the rate falls below Rs 25, turn the Geyser on',
      subtitle: 'Last fired: last night at 11:10 PM',
      active: true,
    },
    {
      id: 't3',
      title: 'When month projection crosses Rs 40,000, shed the non-essential group + notify',
      subtitle: 'Not yet triggered this cycle',
      active: false,
    },
  ])

  // Auto Schedule & EV State
  const [autoModeEnabled, setAutoModeEnabled] = useState(true)
  const [solarPriority, setSolarPriority] = useState(true)
  const [offPeakOnly, setOffPeakOnly] = useState(true)
  const [selectedLoadDetail, setSelectedLoadDetail] = useState(null)

  // Hey ELSA Chat State
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'elsa',
      text: 'Salam! Main ELSA hoon, aapki AI Energy Assistant. Ambition facility meters (Solar AFL, Spray Booth, Ground Floor) online hain. Aap live power, bill estimate, ya machine health ke baray mein pooch saktay hain.',
      time: '10:00 AM'
    }
  ])

  // Toggle trigger state
  const toggleTrigger = (id) => {
    setActiveTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    )
  }

  // Handle adding a new trigger
  const handleAddTrigger = (e) => {
    e?.preventDefault()
    const newT = {
      id: `t${Date.now()}`,
      title: `When ${whenDevice} ${comparator} Rs ${thresholdRs}, ${actionThen}`,
      subtitle: 'Just created — armed & active',
      active: true,
    }
    setActiveTriggers([newT, ...activeTriggers])
  }

  // Handle template click
  const applyTemplate = (templateStr) => {
    if (templateStr.includes('1,500')) {
      setWhenDevice("Today's Spend")
      setComparator('Crosses')
      setThresholdRs('1500')
      setActionThen('Set AC to 26°')
    } else if (templateStr.includes('below Rs 25')) {
      setWhenDevice('Current Rate')
      setComparator('Falls Below')
      setThresholdRs('25')
      setActionThen('Turn Geyser On')
    } else {
      setWhenDevice('Month Projection')
      setComparator('Crosses')
      setThresholdRs('40000')
      setActionThen('Shed Non-Essential Group')
    }
  }

  // Send chat
  const handleSendChat = (e) => {
    e?.preventDefault()
    if (!chatInput.trim()) return
    const txt = chatInput.trim()
    setChatMessages((prev) => [...prev, { sender: 'user', text: txt, time: 'Just now' }])
    setChatInput('')

    setTimeout(() => {
      const q = txt.toLowerCase()
      let reply = "Monitoring Ambition facility. Ask about live power, power factor, or today's bill."
      if (q.includes('spray') || q.includes('booth')) {
        reply = "Spray Booth abhi 78.8 kW draw kar raha hai (PF 0.49, Grade C). Low power factor ki wajah se NEPRA penalty lagti hai. 85 kVAR Capacitor bank required hai."
      } else if (q.includes('solar') || q.includes('generation')) {
        reply = "Solar AFL 11.5 kW generate kar raha hai at 50.1 Hz frequency. Isne aaj Rs 4,140 ki electricity bacha li hai."
      } else if (q.includes('bill') || q.includes('cost') || q.includes('kharcha')) {
        reply = "Today's spend estimate is Rs 42,800. Month projected bill is Rs 1,285,000 under LESCO Industrial B2 tariff."
      } else if (q.includes('ground') || q.includes('imbalance')) {
        reply = "Ground Floor feeder par 65.8% current unbalance hai (Phase B 16.8A vs Phase C 4.6A). Neutral wire overheating se bachne ke liye Phase C par loads balance karna zaroori hai."
      }
      setChatMessages((prev) => [...prev, { sender: 'elsa', text: reply, time: 'Just now' }])
    }, 500)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto relative font-sans text-slate-800 dark:text-slate-100">
      {/* ========================================================================= */}
      {/* TOP HEADER & NAVIGATION (3 CLEAN TABS + HEY ELSA ICON)                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">EMS Platform</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              ORGANIZATION ADMIN
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            ELSA AI · Energy Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            RUPEE-BASED AUTOMATION · BILL INTELLIGENCE · LOAD HEALTH
          </p>
        </div>

        {/* Right Action Controls: 3 Tabs + Hey ELSA Icon Button */}
        <div className="flex items-center gap-2">
          {/* 3 Main Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Zap size={14} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('tariff')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'tariff'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <DollarSign size={14} />
              <span>Bill & Tariff</span>
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'health'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Activity size={14} />
              <span>Load Health</span>
            </button>
          </div>

          {/* HEY ELSA ICON TRIGGER (Eliminates full page clutter!) */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            title="Open Hey ELSA Conversational AI"
          >
            <Bot size={16} />
            <span className="hidden sm:inline">Hey ELSA</span>
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 1: OVERVIEW (Overview + Source Flow)                                 */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 1. Live Source Flow */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Live Source Flow
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg border border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Sun size={14} /> Solar · live (11.5 kW)
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                <Battery size={14} /> Battery
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <Zap size={14} /> WAPDA / Grid (113.5 kW)
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                <Flame size={14} /> Generator
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold bg-slate-50 dark:bg-slate-800">
                Home + EV (125.0 kW Total)
              </span>
            </div>
          </div>

          {/* 2. Today / Month / Target Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TODAY (ESTIMATE)</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">Rs 42,800</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MONTH PROJECTED</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">Rs 1,285,000</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TARGET</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">Rs 1,400,000</p>
            </div>
          </div>

          {/* 3. What ELSA Saved You Today */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-2.5">
              What ELSA Saved You Today
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold">
                Pump shift: Rs 81
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold">
                Peak defense: Rs 220
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold">
                Solar-to-EV: Rs 179
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold">
                Solar AFL Direct: Rs 4,140
              </span>
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-bold">
                Total: Rs 4,620
              </span>
            </div>
          </div>

          {/* 4. Dials Row (MDI Gauge, PF Dial, THD Strip, Feeders Online) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MDI GAUGE</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">131.4 kW</p>
              <p className="text-xs text-slate-400 mt-0.5">of 150 kW sanctioned</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PF DIAL</p>
              <p className="text-2xl font-black text-rose-600 mt-1">0.65</p>
              <p className="text-xs text-rose-500 font-medium mt-0.5">Below 0.90 penalty limit</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">THD STRIP</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">3.2%</p>
              <p className="text-xs text-emerald-600 mt-0.5">Harmonics within IEEE limit</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FEEDERS ONLINE</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">3 / 3</p>
              <p className="text-xs text-slate-400 mt-0.5">Solar, Spray, Ground Floor</p>
            </div>
          </div>

          {/* 5. 24-Hour Source Flow Area Chart (From Tab 6) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  24-Hour Source Flow (Generation vs Consumption)
                </h3>
                <p className="text-xs text-slate-400">Rooftop solar displacement curve against factory load demand</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Solar AFL (11.5 kW)
                </span>
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Factory Total (125.0 kW)
                </span>
              </div>
            </div>
            <div className="h-44 w-full bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-slate-800 relative">
              <svg className="w-full h-full" viewBox="0 0 800 130" preserveAspectRatio="none">
                <line x1="0" y1="35" x2="800" y2="35" stroke="#cbd5e1" strokeDasharray="3" opacity="0.5" />
                <line x1="0" y1="70" x2="800" y2="70" stroke="#cbd5e1" strokeDasharray="3" opacity="0.5" />
                <line x1="0" y1="105" x2="800" y2="105" stroke="#cbd5e1" strokeDasharray="3" opacity="0.5" />
                {/* Factory Demand Area (Blue) */}
                <path d="M0,95 L120,90 L240,65 L360,40 L480,38 L600,50 L720,80 L800,100 L800,130 L0,130 Z" fill="rgba(59, 130, 246, 0.12)" />
                <path d="M0,95 L120,90 L240,65 L360,40 L480,38 L600,50 L720,80 L800,100" stroke="#3b82f6" strokeWidth="2.5" fill="none" />
                {/* Solar Generation Area (Amber) */}
                <path d="M0,130 L220,130 L320,85 L400,20 L480,80 L580,130 L800,130 Z" fill="rgba(245, 158, 11, 0.2)" />
                <path d="M0,130 L220,130 L320,85 L400,20 L480,80 L580,130 L800,130" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-1 font-mono">
              <span>00:00</span>
              <span>06:00 (Sunrise)</span>
              <span className="text-amber-600 font-bold">12:00 (Solar Peak 11.5 kW)</span>
              <span>18:00 (Sunset)</span>
              <span>23:00</span>
            </div>
          </div>

          {/* 6. Load Grid (All 6 Devices from prototype!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Load Grid</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: 'Spray Booth', watts: '78,800W', grade: 'C', status: 'rose' },
                { name: 'Ground Floor', watts: '51,000W', grade: 'B', status: 'amber' },
                { name: 'Solar AFL', watts: '11,500W', grade: 'A', status: 'emerald' },
                { name: 'Kitchen Circuit', watts: '2100W', grade: 'C', status: 'rose' },
                { name: 'Living Room AC', watts: '1100W', grade: 'B', status: 'amber' },
                { name: 'Lounge Lights', watts: '320W', grade: 'A', status: 'emerald' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.watts}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      item.status === 'rose' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                      item.status === 'amber' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      Grade {item.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. EV Charging Status Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
              <span className="text-amber-500">🚗</span> EV Charging Status
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Ready by 8:00 AM — 46% / 80% · Rs 186 so far vs Rs 1,140 petrol equivalent
            </p>
          </div>

          {/* 8. Alerts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Alerts</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>• Spray Booth — 78.8 kW active with 0.49 PF (Critical Low Power Factor penalty fine active).</span>
                <span className="text-amber-600 font-bold">Action Needed</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>• Ground Floor Feeder — Phase B (16.8A) overloaded vs Phase C (4.6A) (65.8% current unbalance).</span>
                <span className="text-rose-600 font-bold">Warning</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: BILL & TARIFF (Bill & Tariff + Rupee Triggers)                    */}
      {/* ========================================================================= */}
      {activeTab === 'tariff' && (
        <div className="space-y-5">
          {/* 1. Tariff Engine Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tariff Engine</h3>
              <p className="text-xs text-slate-400">DISCO rate built-in — every unit shown in rupees automatically</p>
            </div>
            <div className="w-64">
              <select className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold">
                <option>LESCO — Industrial B2 (Current)</option>
                <option>LESCO — Domestic B-1</option>
                <option>IESCO — Industrial B2</option>
              </select>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CURRENT SLAB RATE</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs 25.2/unit</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UNITS THIS CYCLE</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">268</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PEAK / OFF-PEAK</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">18:00 - 22:00</p>
              <p className="text-xs text-slate-400">22:00 - 06:00</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FIXED CHARGE</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs 1,200</p>
            </div>
          </div>

          {/* Blue Info Strip */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <span>ℹ️</span>
            <span>You're 32 units away — crossing the 300-unit slab will move the rate from Rs 25.2 to Rs 33.7.</span>
          </div>

          {/* Slab Table Pills */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">SLAB TABLE</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">0 - 100 units: Rs 17.5</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">100 - 200 units: Rs 21.4</span>
              <span className="px-3 py-1.5 rounded-lg border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/30 font-bold text-amber-700 dark:text-amber-300">
                200 - 300 units: Rs 25.2 (Current)
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">300 - 400 units: Rs 33.7</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">400 - 700 units: Rs 41.9</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">700 - ∞ units: Rs 55.1</span>
            </div>
          </div>

          {/* Bill Breakup Donut & Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Bill Breakup</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Donut representation */}
              <div className="flex flex-col items-center justify-center p-4">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="16" fill="none" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="16" strokeDasharray="160 240" fill="none" />
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="16" strokeDasharray="40 240" strokeDashoffset="-160" fill="none" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="16" strokeDasharray="30 240" strokeDashoffset="-200" fill="none" />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">Rs 34,384</p>
                  </div>
                </div>
              </div>

              {/* Breakup List (from prototype screenshot!) */}
              <div className="md:col-span-2 space-y-2 text-xs">
                {[
                  { name: 'Energy Charge', rs: 'Rs 24,680', badge: 'ELSA reduces: yes', color: 'text-emerald-600', dot: 'bg-amber-500' },
                  { name: 'Fixed / MDI Charge', rs: 'Rs 1,200', badge: 'ELSA reduces: partially', color: 'text-amber-600', dot: 'bg-emerald-500' },
                  { name: 'FCA + Quarterly Adj', rs: 'Rs 3,180', badge: 'ELSA reduces: no', color: 'text-slate-400', dot: 'bg-blue-500' },
                  { name: 'PF Penalty', rs: 'Rs 0 (Industrial: Rs 112,500)', badge: 'ELSA reduces: yes', color: 'text-emerald-600', dot: 'bg-rose-500' },
                  { name: 'Duties, Taxes & GST', rs: 'Rs 5,124', badge: 'ELSA reduces: no', color: 'text-slate-400', dot: 'bg-slate-400' },
                  { name: 'Meter Rent / TV Fee', rs: 'Rs 200', badge: 'ELSA reduces: no', color: 'text-slate-400', dot: 'bg-purple-500' },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${row.dot}`}></span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{row.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 dark:text-white">{row.rs}</span>
                      <span className={`text-[10px] font-bold ${row.color}`}>{row.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Warnings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">AI Warnings</h4>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex justify-between items-center">
              <span>⚠️ Measured max demand is 4.1 kW vs sanctioned 7 kW — you're paying Rs 480/month extra in fixed charges. Get sanctioned load reviewed.</span>
              <span className="font-bold whitespace-nowrap">Rs 480</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex justify-between items-center">
              <span>⚠️ You're about to cross the 300-unit slab — the rate will jump from Rs 25.2 to Rs 33.7 (32 units left).</span>
              <span className="font-bold whitespace-nowrap">Rs 271</span>
            </div>
          </div>

          {/* RUPEE TRIGGERS (Sentence Builder & Active List from Tab 4) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rupee Triggers</h3>
              <p className="text-xs text-slate-400">Default automation unit = rupees, not amps. Sentence builder — 3 dropdowns.</p>
            </div>

            {/* Sentence Builder Form */}
            <form onSubmit={handleAddTrigger} className="flex flex-wrap items-end gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="w-48">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WHEN</label>
                <select
                  value={whenDevice}
                  onChange={(e) => setWhenDevice(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option>Today's Spend</option>
                  <option>Spray Booth Daily Spend</option>
                  <option>Current Rate</option>
                  <option>Month Projection</option>
                </select>
              </div>

              <div className="w-36">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">COMPARATOR</label>
                <select
                  value={comparator}
                  onChange={(e) => setComparator(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option>Crosses</option>
                  <option>Falls Below</option>
                  <option>Equals</option>
                </select>
              </div>

              <div className="w-28">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">RS</label>
                <input
                  type="text"
                  value={thresholdRs}
                  onChange={(e) => setThresholdRs(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="w-44">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">THEN</label>
                <select
                  value={actionThen}
                  onChange={(e) => setActionThen(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option>Switch Off</option>
                  <option>Set AC to 26°</option>
                  <option>WhatsApp Alert</option>
                  <option>Turn Geyser On</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-sm"
              >
                + Add Trigger
              </button>
            </form>

            {/* Live Sentence Preview */}
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              WHEN {whenDevice} {comparator} Rs {thresholdRs} THEN {actionThen}
            </div>

            {/* Templates Chips */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase mb-2"># TEMPLATES</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  "Today's spend crosses Rs 1,500 · AC to 26°",
                  'Rate falls below Rs 25 · geyser on',
                  'Month projection crosses Rs 40,000 · shed non-essential group + notify'
                ].map((tmpl, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(tmpl)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-amber-500 text-slate-600 dark:text-slate-300 transition-all"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Triggers List with Real Toggle Switches */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Triggers</h4>
              {activeTriggers.map((tr) => (
                <div key={tr.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{tr.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tr.subtitle}</p>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => toggleTrigger(tr.id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      tr.active ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        tr.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Safety loads (fridge, medical, security) rahenge protected — kabhi auto-shed nahi. Min 15-min gap between opposing actions.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: LOAD HEALTH (Load Health + Auto Schedule & EV)                    */}
      {/* ========================================================================= */}
      {activeTab === 'health' && (
        <div className="space-y-5">
          {/* 1. Room-Wise Ranking Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Room-Wise Ranking</h3>
            <p className="text-xs text-slate-400 mb-4">Which room is using the most electricity</p>
            <div className="h-56 w-full bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 relative">
              <div className="h-full flex items-end justify-around gap-2 px-4 pb-4">
                {[
                  { label: 'Master Bedroom', pct: 34, val: '34%' },
                  { label: 'Kitchen', pct: 24, val: '24%', highlight: true },
                  { label: 'Lounge', pct: 14, val: '14%' },
                  { label: 'Kids Room', pct: 8, val: '8%' },
                  { label: 'Other', pct: 11, val: '11%' },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full max-w-[64px] bg-slate-200 dark:bg-slate-800 rounded-t-lg relative flex items-end justify-center" style={{ height: '80%' }}>
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          bar.highlight ? 'bg-amber-500 shadow-md shadow-amber-500/20' : 'bg-amber-400/80'
                        }`}
                        style={{ height: `${(bar.pct / 40) * 100}%` }}
                      >
                        {bar.highlight && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black">
                            {bar.val}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[80px]">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Per-Load Health Report (6 Detailed Cards from Prototype!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Per-Load Health Report</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  id: 'load-1',
                  name: 'Bedroom AC',
                  desc: 'Master Bedroom · 1450W · grid',
                  verdict: 'Bedroom AC is using 30% more than the lounge AC — likely a service/EER issue.',
                  grade: 'C',
                  gradeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
                },
                {
                  id: 'load-2',
                  name: 'Water Pump',
                  desc: 'Utility · 750W · grid',
                  verdict: 'Pump PF is 0.68 — the most reactive load on this circuit. Get a capacitor fitted.',
                  grade: 'C',
                  gradeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
                },
                {
                  id: 'load-3',
                  name: 'Kitchen Circuit',
                  desc: 'Kitchen · 2100W · grid',
                  verdict: 'Kitchen circuit is Grade C — voltage drop rose from 8% to 12% over 3 weeks. Needs checkup.',
                  grade: 'C',
                  gradeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
                },
                {
                  id: 'load-4',
                  name: 'Living Room AC',
                  desc: 'Lounge · 1100W · solar',
                  verdict: 'Using 15% more electricity for the same duty cycle — filter may be dirty, keep an eye on it.',
                  grade: 'B',
                  gradeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                },
                {
                  id: 'load-5',
                  name: 'Geyser',
                  desc: 'Bathroom · 2000W · grid',
                  verdict: 'Circuit is running well within its rated capacity — no action needed.',
                  grade: 'A',
                  gradeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                },
                {
                  id: 'load-6',
                  name: 'Lounge Lights + Fans',
                  desc: 'Lounge · 320W · solar',
                  verdict: 'Grade A — within the normal envelope.',
                  grade: 'A',
                  gradeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                },
              ].map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedLoadDetail(c)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-amber-500 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${c.gradeClass}`}>
                        Grade {c.grade}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{c.desc}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{c.verdict}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 mt-3">
                    View detail <ChevronRight size={14} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Autonomous Schedule & EV (From Tab 5 Screenshot!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Autonomous Schedule — "ELSA Will Handle Everything"
                </h3>
                <p className="text-xs text-slate-400">
                  Reads 30 days of usage + tariff windows + solar profile and generates the full schedule itself.
                </p>
              </div>
              <button
                onClick={() => setAutoModeEnabled(!autoModeEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  autoModeEnabled
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {autoModeEnabled ? 'Auto Mode: ON' : 'Enable Auto Mode'}
              </button>
            </div>

            {/* EV Charging Progress Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-amber-500">🚗</span> EV Charging
                </span>
                <span className="text-xs text-slate-400">46% / 80%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[46%] rounded-full"></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Gari 8:00 AM baje 80% ready — Rs 186 (solar 60% + off-peak 40%). Petrol equivalent hota Rs 1,140.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={solarPriority}
                      onChange={(e) => setSolarPriority(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span>Solar Priority</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offPeakOnly}
                      onChange={(e) => setOffPeakOnly(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span>Off-Peak Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Goal Plan — Bill Target (3 Stages from Tab 5!) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-amber-500">⭐</span> Goal Plan — Bill Target
                </h4>
                <span className="text-xs text-slate-400">Target: Rs 50,000 · Current projection: Rs 38,400</span>
              </div>

              <div className="space-y-2">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Stage 1: Zero-cost scheduling</p>
                      <p className="text-[11px] text-slate-400">Already applied automatically — contributing to current pace</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600">Rs 4,200</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Applied</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Stage 2: Small one-time fixes (service, capacitor, sanctioned-load review)</p>
                      <p className="text-[11px] text-slate-400">Book an electrician for pump + AC service for further headroom</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Rs 2,600</p>
                    <button className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Stage 3: Investment (solar / BESS)</p>
                      <p className="text-[11px] text-slate-400">Beyond this point you'll need solar — talk to us about sizing</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Rs 15,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSISTENT HEY ELSA SLIDE-OUT COPILOT DRAWER (Condenses Tab 7 into Icon)  */}
      {/* ========================================================================= */}
      {isCopilotOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Hey ELSA Co-Pilot</h3>
                  <p className="text-[10px] text-slate-400">Connected to live meter telemetry</p>
                </div>
              </div>
              <button
                onClick={() => setIsCopilotOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-wrap gap-1.5">
              {[
                'Spray Booth status?',
                'Solar kitni bijli bana raha hai?',
                "Today's bill estimate?",
                'Ground Floor unbalance?'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setChatInput(chip)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask in English or Roman Urdu..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
