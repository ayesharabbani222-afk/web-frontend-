import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap, DollarSign, Activity, MessageSquare, Sun, Battery, Flame,
  Home, Car, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck,
  TrendingDown, TrendingUp, Clock, Plus, Bell, Play, Sparkles, Filter,
  RefreshCw, X, ChevronRight, Send, Bot, Check, SlidersHorizontal,
  Info, Cpu, Layers, BarChart3, HelpCircle, Eye
} from 'lucide-react'
import { DOMESTIC_DATA } from '../../utils/elsaEngine'

export default function ElsaAiProPage() {
  const navigate = useNavigate()

  // 3 Core Simple Tabs: 'overview', 'tariff', 'health'
  const [activeTab, setActiveTab] = useState('overview')

  // Hey ELSA Drawer State (Condensed from Tab 7 into an Icon Drawer!)
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)

  // Dataset Mode: 'domestic' (100% exact prototype screenshots) vs 'ambition' (live factory)
  const [datasetMode, setDatasetMode] = useState('domestic')

  // Rupee Triggers State (from Tab 4)
  const [whenDevice, setWhenDevice] = useState("Today's Spend")
  const [comparator, setComparator] = useState('Crosses')
  const [thresholdRs, setThresholdRs] = useState('1500')
  const [actionThen, setActionThen] = useState('Switch Off')
  const [activeTriggers, setActiveTriggers] = useState(DOMESTIC_DATA.triggers.active)

  // Auto Schedule & EV State (from Tab 5)
  const [autoModeEnabled, setAutoModeEnabled] = useState(true)
  const [solarPriority, setSolarPriority] = useState(true)
  const [offPeakOnly, setOffPeakOnly] = useState(true)

  // Modal inspection dialog for "View detail >"
  const [selectedLoadDetail, setSelectedLoadDetail] = useState(null)

  // Hey ELSA Chat State
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'elsa',
      text: 'Salam! Main ELSA hoon, aapki AI Energy Assistant. Aapka real-time home spend Rs 1,240 hai aur month projection Rs 38,400 under LESCO B-1 tariff. Poochhein: "Bedroom AC Grade C kyun hai?", "Slab cross hone se kaise bachein?", ya "EV schedule optimize karo".',
      time: '10:00 AM'
    }
  ])

  // Toggle trigger active state
  const toggleTrigger = (id) => {
    setActiveTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    )
  }

  // Handle adding trigger
  const handleAddTrigger = (e) => {
    e?.preventDefault()
    const newT = {
      id: `t_${Date.now()}`,
      title: `When ${whenDevice} ${comparator} Rs ${thresholdRs}, ${actionThen}`,
      subtitle: 'Just created — armed & active',
      active: true,
    }
    setActiveTriggers([newT, ...activeTriggers])
  }

  // Apply template
  const applyTemplate = (templateStr) => {
    if (templateStr.includes('1,500')) {
      setWhenDevice("Today's Spend")
      setComparator('Crosses')
      setThresholdRs('1500')
      setActionThen('Set Bedroom AC to 26°')
    } else if (templateStr.includes('below Rs 25')) {
      setWhenDevice('Current Rate')
      setComparator('Falls Below')
      setThresholdRs('25')
      setActionThen('Turn Geyser on')
    } else {
      setWhenDevice('Month Projection')
      setComparator('Crosses')
      setThresholdRs('40000')
      setActionThen('Shed non-essential group + notify')
    }
  }

  // Handle sending chat
  const handleSendChat = (e) => {
    e?.preventDefault()
    if (!chatInput.trim()) return
    const userText = chatInput.trim()
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: 'Just now' }])
    setChatInput('')

    setTimeout(() => {
      const q = userText.toLowerCase()
      let reply = "I'm monitoring your 6 home loads (Bedroom AC, Water Pump, Kitchen, Living Room AC, Geyser, Lounge Lights). Ask about bill optimization, power factor, or tariffs."
      if (q.includes('ac') || q.includes('bedroom')) {
        reply = "Bedroom AC (1450W) Grade C hai. Lounge AC ke muqablay 30% zyada bijli khata hai. Recommendation: AC filters clean karwayein aur compressor servicing check karwayein."
      } else if (q.includes('pump') || q.includes('water')) {
        reply = "Water Pump (750W) ka PF 0.68 hai (bohot low). Yeh sub se zyada reactive load hai. 5 kVAR capacitor laganay se current aur heating dono kam hongi."
      } else if (q.includes('slab') || q.includes('bill') || q.includes('rate')) {
        reply = "Critical Alert: Aap 300-unit slab se sirf 32 units door hain! Agar 300 cross hua tou aglay units Rs 33.7/unit par lagenge (Rs 25.2 se jump). Peak hours (18:00-22:00) me heavy loads band rakhein."
      } else if (q.includes('ev') || q.includes('car') || q.includes('gari')) {
        reply = "EV charging 46% mukammal hai. Subha 8:00 AM tak 80% ready ho jaye gi. Aaj ka kharcha sirf Rs 186 hua jabkay petrol ka kharcha Rs 1,140 banta, saving Rs 954!"
      } else if (q.includes('save') || q.includes('bachat')) {
        reply = "ELSA ne aaj aapke Rs 480 bachaye hain: Pump shift se Rs 81, Peak defense se Rs 220, aur Solar-to-EV routing se Rs 179."
      }
      setChatMessages((prev) => [...prev, { sender: 'elsa', text: reply, time: 'Just now' }])
    }, 500)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto relative font-sans text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* ========================================================================= */}
      {/* TOP COMPARISON HEADER & NAVIGATION (3 CLEAN PAGES + HEY ELSA ICON)        */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-sm">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Executive Edition · 3 Pages
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Cleaned up from 7 tabs → 3 intuitive pages with 100% data fidelity
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Hey ELSA condensed into a persistent smart icon drawer · Zero features omitted
            </p>
          </div>
        </div>

        {/* Switch to Classic 7-Tab Prototype Button */}
        <button
          onClick={() => navigate('/elsa-classic-preview')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm transition-all hover:text-amber-600"
          title="Compare with original 7-tab layout"
        >
          <span>View 7-Tab Classic</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Main Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">EMS Platform</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              ORGANIZATION ADMIN
            </span>
            <span className="text-[11px] text-slate-400 font-medium">/ ELSA-AI</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            ELSA AI
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
              Energy Intelligence
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
            RUPEE-BASED AUTOMATION · BILL INTELLIGENCE · LOAD HEALTH
          </p>
        </div>

        {/* Right Navigation Controls: The 3 Clean Tabs + The Hey ELSA Icon */}
        <div className="flex items-center gap-2.5">
          {/* 3 Streamlined Tabs */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap size={14} className={activeTab === 'overview' ? 'text-amber-500' : ''} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('tariff')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tariff'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <DollarSign size={14} className={activeTab === 'tariff' ? 'text-amber-500' : ''} />
              <span>Bill & Tariff</span>
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'health'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Activity size={14} className={activeTab === 'health' ? 'text-amber-500' : ''} />
              <span>Load Health</span>
            </button>
          </div>

          {/* HEY ELSA AS AN ICON (Condenses 1 Full Tab into an Executive AI Trigger!) */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            title="Open Hey ELSA AI Assistant Drawer"
          >
            <div className="relative flex items-center justify-center">
              <Bot size={17} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping"></span>
            </div>
            <span className="hidden sm:inline tracking-tight">Hey ELSA</span>
            <span className="px-1.5 py-0.2 bg-slate-950/20 text-slate-950 rounded text-[9px] font-black uppercase">
              AI
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 1: OVERVIEW (Overview + Source Flow Condensed Beautifully)           */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-fade-in">
          {/* 1. Live Source Flow - Modern Interactive Bus */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Live Source Flow
                </h3>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Real-Time Telemetry Active
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-black text-xs shadow-sm">
                <Sun size={15} className="text-amber-500 animate-spin-slow" />
                <span>Solar · live</span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded font-mono">2.8 kW</span>
              </div>

              <span className="text-slate-300 dark:text-slate-700 font-bold">→</span>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold bg-slate-50/50 dark:bg-slate-900/50">
                <Battery size={15} />
                <span>Battery</span>
                <span className="text-[10px] text-slate-400 font-mono">Standby</span>
              </div>

              <span className="text-slate-300 dark:text-slate-700 font-bold">→</span>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
                <Zap size={15} className="text-blue-500" />
                <span>WAPDA / Grid</span>
                <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded font-mono">1.3 kW</span>
              </div>

              <span className="text-slate-300 dark:text-slate-700 font-bold">→</span>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold bg-slate-50/50 dark:bg-slate-900/50">
                <Flame size={15} />
                <span>Generator</span>
                <span className="text-[10px] text-slate-400 font-mono">Off</span>
              </div>

              <span className="text-slate-300 dark:text-slate-700 font-bold">→</span>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-black shadow-sm">
                <Home size={15} className="text-amber-500" />
                <span>Home + EV</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">4.1 kW Total</span>
              </div>
            </div>
          </div>

          {/* 2. Today / Month / Target Row (Exact Screenshot 1 Numbers!) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-amber-500/40 transition-all">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TODAY (ESTIMATE)</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">Rs 1,240</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">
                <TrendingDown size={14} />
                <span>Saved Rs 480 via automated smart scheduling</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-emerald-500/40 transition-all">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MONTH PROJECTED</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">Rs 38,400</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                Pacing <strong className="text-emerald-600 font-bold">23.2% under</strong> target budget
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-300 transition-all">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TARGET</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">Rs 50,000</p>
              <p className="text-xs text-slate-400 mt-1.5">Monthly ceiling cap set in settings</p>
            </div>
          </div>

          {/* 3. What ELSA Saved You Today (Exact Screenshot 1 Badges!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>What ELSA Saved You Today</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Updated every 15 minutes</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
                Pump shift: Rs 81
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
                Peak defense: Rs 220
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
                Solar-to-EV: Rs 179
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 text-xs font-black border border-blue-500/30">
                Total: Rs 480
              </span>
            </div>
          </div>

          {/* 4. Dials & Gauges (Exact Screenshot 1: 4.1 kW, 0.89, 3.2%, 6/6) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MDI GAUGE</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-black text-slate-900 dark:text-white">4.1 kW</p>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">of 7 kW sanctioned</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full w-[58.5%] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PF DIAL</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">0.89</p>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Safe operational range</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[89%] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">THD STRIP</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-black text-slate-900 dark:text-white">3.2%</p>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Harmonics within limits</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full w-[32%] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FEEDERS ONLINE</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">6 / 6</p>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">100% telemetry online</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full w-full rounded-full"></div>
              </div>
            </div>
          </div>

          {/* 5. Source Orchestration & Flow (From Screenshot media_1791268517701.png) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Source Orchestration — Cheapest Safe Source First
              </h3>
              <p className="text-xs text-slate-400">
                The house is on solar right now, the car is charging from battery, and the generator is asleep.
              </p>
            </div>

            {/* 4 Source Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Solar */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sun size={14} className="text-amber-500" /> Solar
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs 0/unit</p>
                </div>
                <p className="text-xs text-slate-400 mt-2">Generating — feeding home + battery</p>
              </div>

              {/* Battery */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Battery size={14} className="text-slate-400" /> Battery
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs 9/unit</p>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">SoC: 74%</p>
                </div>
                <p className="text-xs text-slate-400 mt-2">Stored cost Rs 9/unit — reserve floor 30%</p>
              </div>

              {/* WAPDA / Grid */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Zap size={14} className="text-blue-500" /> WAPDA / Grid
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs 25.2/unit</p>
                </div>
                <p className="text-xs text-slate-400 mt-2">Off-peak now — current slab rate</p>
              </div>

              {/* Generator */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Flame size={14} className="text-slate-400" /> Generator
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs 78/unit</p>
                </div>
                <p className="text-xs text-slate-400 mt-2">Standby — auto-starts only on an outage with battery below its floor</p>
              </div>
            </div>

            {/* Solar Generation vs Consumption Chart */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Solar Generation vs Consumption</h4>
                <p className="text-[11px] text-slate-400">Selling cheap during the day, buying expensive at night — leak/export zone shaded.</p>
              </div>

              <div className="h-48 w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 relative">
                <div className="absolute left-2 top-3 bottom-8 flex flex-col justify-between text-[10px] text-slate-400 font-mono">
                  <span>6 kW</span>
                  <span>4 kW</span>
                  <span>2 kW</span>
                  <span>0 kW</span>
                </div>

                <div className="ml-10 h-full relative pb-6">
                  <svg className="w-full h-full" viewBox="0 0 800 130" preserveAspectRatio="none">
                    <line x1="0" y1="10" x2="800" y2="10" stroke="#cbd5e1" strokeDasharray="3" opacity="0.5" />
                    <line x1="0" y1="45" x2="800" y2="45" stroke="#cbd5e1" strokeDasharray="3" opacity="0.5" />
                    <line x1="0" y1="80" x2="800" y2="80" stroke="#cbd5e1" strokeDasharray="3" opacity="0.5" />
                    <line x1="0" y1="115" x2="800" y2="115" stroke="#cbd5e1" opacity="0.8" />

                    {/* Solar Generation (Orange Area) */}
                    <path
                      d="M 180,115 C 240,115 320,10 400,10 C 480,10 560,115 620,115 Z"
                      fill="rgba(245, 158, 11, 0.25)"
                    />
                    <path
                      d="M 180,115 C 240,115 320,10 400,10 C 480,10 560,115 620,115"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      fill="none"
                    />

                    {/* House Consumption (Blue Area) */}
                    <path
                      d="M 0,80 L 160,80 C 220,80 280,88 360,88 C 440,88 520,85 580,85 C 640,85 680,50 720,50 C 760,50 780,75 800,85 L 800,115 L 0,115 Z"
                      fill="rgba(59, 130, 246, 0.12)"
                    />
                    <path
                      d="M 0,80 L 160,80 C 220,80 280,88 360,88 C 440,88 520,85 580,85 C 640,85 680,50 720,50 C 760,50 780,75 800,85"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono ml-10 -mt-5 px-1">
                  <span>0:00</span>
                  <span>4:00</span>
                  <span>8:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                </div>
              </div>

              {/* Legend Centered */}
              <div className="flex items-center justify-center gap-6 text-xs pt-1">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-0.5 bg-amber-500 inline-block relative"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-0.5 left-1/2 -translate-x-1/2"></span></span>
                  <span>Solar Generation</span>
                </span>
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-0.5 bg-blue-500 inline-block relative"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute -top-0.5 left-1/2 -translate-x-1/2"></span></span>
                  <span>House Consumption</span>
                </span>
              </div>
            </div>

            {/* Dispatch Rules Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dispatch Rules</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <li>• Cheapest-first: every load is served from the lowest live-cost source</li>
                <li>• Solar surplus waterfall: loads → battery → EV → export</li>
                <li>• Battery reserve floor protected — economy ke liye kabhi dispatch nahi hoti</li>
                <li>• Peak defense: battery covers the base load, EV charging is blocked during peak</li>
                <li>• Generator never charges the EV — Rs 78 diesel unit into a car is a loss</li>
              </ul>
            </div>
          </div>

          {/* 6. Load Grid (All 6 Devices Exactly as Screenshot 1!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Load Grid</h3>
              <span className="text-xs text-slate-400">Click any load for full engineering diagnostics</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {DOMESTIC_DATA.overview.loadGrid.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedLoadDetail(item)}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 hover:border-amber-500 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.watts}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      item.grade === 'C' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                      item.grade === 'B' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      Grade {item.grade}
                    </span>
                    <span className="text-[10px] text-amber-600 font-bold">View &gt;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. EV Charging Status Card (Exact Screenshot 1 Text!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Car size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">EV Charging Status</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Ready by 8:00 AM — 46% / 80% · Rs 186 so far vs Rs 1,140 petrol equivalent
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Saving Rs 954
              </span>
            </div>
          </div>

          {/* 8. Alerts (Exact Screenshot 1 Bullet Points!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm space-y-2.5 text-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Alerts</h3>
            <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Bedroom AC — 1,500W active, house is empty. Turn it off now?</span>
              </div>
              <button
                onClick={() => alert("ELSA: Sent 'Turn off Bedroom AC' signal to smart switch.")}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs whitespace-nowrap shadow-sm"
              >
                Turn Off Now
              </button>
            </div>
            <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Circuit 4 (Kitchen) degradation trend — 8% → 12% over 3 weeks.</span>
              </div>
              <button
                onClick={() => setSelectedLoadDetail(DOMESTIC_DATA.overview.loadGrid[2])}
                className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 font-bold text-xs whitespace-nowrap"
              >
                Checkup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: BILL & TARIFF (Bill & Tariff + Goal Plan Condensed)                */}
      {/* ========================================================================= */}
      {activeTab === 'tariff' && (
        <div className="space-y-5 animate-fade-in">
          {/* 1. Tariff Engine Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tariff Engine</h3>
              <p className="text-xs text-slate-400">DISCO rate built-in — every unit shown in rupees automatically</p>
            </div>
            <div className="w-64">
              <select className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold shadow-sm">
                <option>LESCO — Domestic B-1 (Previous)</option>
                <option>LESCO — Industrial B2</option>
              </select>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CURRENT SLAB RATE</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs 25.2/unit</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UNITS THIS CYCLE</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">268</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PEAK / OFF-PEAK</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">18:00 - 22:00</p>
              <p className="text-xs text-slate-400">22:00 - 06:00</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FIXED CHARGE</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs 1,200</p>
            </div>
          </div>

          {/* Blue Info Callout Strip */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2.5">
            <Info size={17} className="text-blue-500 shrink-0" />
            <span>You're 32 units away — crossing the 300 unit slab will move the rate from Rs 25.2 to Rs 33.7.</span>
          </div>

          {/* Slab Table Pills */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">SLAB TABLE</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">0 - 100 units: Rs 17.5</span>
              <span className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">100 - 200 units: Rs 21.4</span>
              <span className="px-3 py-1.5 rounded-xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 font-black text-amber-700 dark:text-amber-300 shadow-sm">
                200 - 300 units: Rs 25.2 (Current Active Slab)
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">300 - 400 units: Rs 33.7</span>
              <span className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">400 - 700 units: Rs 41.9</span>
              <span className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">700 - ∞ units: Rs 55.1</span>
            </div>
          </div>

          {/* Bill Breakup Donut & Table (Exact Screenshot 2!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Bill Breakup</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
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

              <div className="md:col-span-2 space-y-2 text-xs">
                {DOMESTIC_DATA.tariff.billBreakup.items.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }}></span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{row.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 dark:text-white">{row.rs}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        row.reduces === 'yes' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        row.reduces === 'partially' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        ELSA reduces: {row.reduces}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Warnings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">AI Warnings</h4>
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex justify-between items-center gap-3">
              <span>⚠️ Measured max demand is 4.1 kW vs a sanctioned 7 kW — you're paying Rs 480/month extra in fixed charges. Get your sanctioned load reviewed.</span>
              <span className="font-black text-rose-600 dark:text-rose-400 whitespace-nowrap bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded">Rs 480</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex justify-between items-center gap-3">
              <span>⚠️ You're about to cross the 300-unit slab — the rate will jump from Rs 25.2 to Rs 33.7 (32 units left).</span>
              <span className="font-black text-rose-600 dark:text-rose-400 whitespace-nowrap bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded">Rs 271</span>
            </div>
          </div>

          {/* Goal Plan — Bill Target (Seamlessly Placed on Bill Page!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-amber-500">⭐</span> Goal Plan — Bill Target
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated savings pathway to hit target</p>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target: Rs 50,000 · Current projection: <span className="text-emerald-600">Rs 38,400</span>
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mt-0.5">✓</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Stage 1: Zero-cost scheduling</p>
                    <p className="text-[11px] text-slate-400">Already applied automatically — contributing to current pace</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">Rs 4,200</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Applied</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Stage 2: Small one-time fixes (service, capacitor, sanctioned-load review)</p>
                    <p className="text-[11px] text-slate-400">Book an electrician for pump + AC service for further headroom</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-white">Rs 2,800</span>
                  <button className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm">
                    Apply
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center font-bold text-xs mt-0.5">3</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Stage 3: Investment (solar / BESS)</p>
                    <p className="text-[11px] text-slate-400">Beyond this point you'll need solar — talk to us about sizing</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">Rs 15,000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: LOAD HEALTH (Room-Wise + Diagnostic Cards + Rupee Triggers + EV)  */}
      {/* ========================================================================= */}
      {activeTab === 'health' && (
        <div className="space-y-5 animate-fade-in">
          {/* 1. Room-Wise Ranking Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Room-Wise Ranking</h3>
            <p className="text-xs text-slate-400 mb-4">Which room is using the most electricity</p>
            <div className="h-56 w-full bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-end justify-around gap-2 px-6">
              {[
                { name: 'Master Bedroom', pct: 34, h: '75%' },
                { name: 'Kitchen', pct: 24, h: '55%', highlight: true },
                { name: 'Lounge', pct: 14, h: '35%' },
                { name: 'Kids Room', pct: 8, h: '20%' },
                { name: 'Other', pct: 11, h: '25%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full max-w-[64px] bg-amber-500 rounded-t-xl relative transition-all" style={{ height: bar.h }}>
                    {bar.highlight && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-amber-500 text-amber-600 font-extrabold text-[10px] shadow-sm whitespace-nowrap">
                        Kitchen: 24%
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[80px]">{bar.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Per-Load Health Report (Exact 6 Cards from Screenshot 3!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Per-Load Health Report</h3>
              <span className="text-xs text-slate-400">Click to view diagnostics modal</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {DOMESTIC_DATA.overview.loadGrid.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedLoadDetail(item)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-amber-500 cursor-pointer transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        item.grade === 'C' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                        item.grade === 'B' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        Grade {item.grade}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{item.room} · {item.watts} · {item.supply}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{item.note}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 mt-3 inline-flex items-center gap-1">
                    View detail <ChevronRight size={13} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Rupee Triggers (Exact Screenshot 4 Form & Active Triggers!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rupee Triggers</h3>
              <p className="text-xs text-slate-400">Default automation unit = rupees, not amps. Sentence builder — 3 dropdowns.</p>
            </div>

            <form onSubmit={handleAddTrigger} className="flex flex-wrap items-end gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="w-48">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WHEN</label>
                <select value={whenDevice} onChange={e => setWhenDevice(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold">
                  <option>Today's Spend</option>
                  <option>Current Rate</option>
                  <option>Month Projection</option>
                </select>
              </div>
              <div className="w-36">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">COMPARATOR</label>
                <select value={comparator} onChange={e => setComparator(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold">
                  <option>Crosses</option>
                  <option>Falls Below</option>
                </select>
              </div>
              <div className="w-28">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">RS</label>
                <input type="text" value={thresholdRs} onChange={e => setThresholdRs(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold" />
              </div>
              <div className="w-44">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">THEN</label>
                <select value={actionThen} onChange={e => setActionThen(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold">
                  <option>Switch Off</option>
                  <option>Set Bedroom AC to 26°</option>
                  <option>Turn Geyser on</option>
                  <option>Shed non-essential group + notify</option>
                </select>
              </div>
              <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm">
                + Add Trigger
              </button>
            </form>

            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              WHEN {whenDevice} {comparator} Rs {thresholdRs} THEN {actionThen}
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase mb-2"># TEMPLATES</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {DOMESTIC_DATA.triggers.templates.map((tmpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-amber-500 transition-colors"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Triggers</h4>
              {activeTriggers.map((tr) => (
                <div key={tr.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{tr.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tr.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTrigger(tr.id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      tr.active ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${tr.active ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Safety loads (fridge, medical, security) rahenge protected — kabhi auto-shed nahi. Min 15-min gap between opposing actions.
            </p>
          </div>

          {/* 4. Autonomous Schedule & EV (Exact Screenshot 5!) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
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
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                  autoModeEnabled
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {autoModeEnabled ? 'Auto Mode: ON' : 'Enable Auto Mode'}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5"><Car size={14} className="text-amber-500" /> EV Charging</span>
                <span className="text-slate-400">46% / 80%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[46%] rounded-full"></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                <p className="text-slate-600 dark:text-slate-300">
                  Gari 8:00 AM baje 80% ready — Rs 188 (solar 60% + off-peak 40%). Petrol equivalent hota Rs 1,140.
                </p>
                <div className="flex items-center gap-4 font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={solarPriority} onChange={e => setSolarPriority(e.target.checked)} className="accent-amber-500" />
                    <span>Solar Priority</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={offPeakOnly} onChange={e => setOffPeakOnly(e.target.checked)} className="accent-amber-500" />
                    <span>Off-Peak Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEY ELSA SLIDE-OVER COPILOT DRAWER (Condenses Tab 7 into a Modern Drawer) */}
      {/* ========================================================================= */}
      {isCopilotOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full shadow-2xl flex flex-col">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    Hey ELSA Co-Pilot
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Connected to domestic meter telemetry (LESCO B-1)</p>
                </div>
              </div>
              <button
                onClick={() => setIsCopilotOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-wrap gap-1.5">
              {[
                'Why is Bedroom AC Grade C?',
                'How to avoid 300 unit slab?',
                'Water Pump PF fix?',
                'EV petrol comparison?'
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

            {/* Chat Transcript */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none shadow-sm'
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
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-slate-50 dark:bg-slate-950">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask in English or Roman Urdu..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOAD DETAIL MODAL (Triggered when user clicks "View detail >")            */}
      {/* ========================================================================= */}
      {selectedLoadDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {selectedLoadDetail.name}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    selectedLoadDetail.grade === 'C' ? 'bg-rose-100 text-rose-800' :
                    selectedLoadDetail.grade === 'B' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Grade {selectedLoadDetail.grade}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedLoadDetail.room} · {selectedLoadDetail.watts} · {selectedLoadDetail.supply}</p>
              </div>
              <button
                onClick={() => setSelectedLoadDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Engineering Diagnostic:</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedLoadDetail.note}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Estimated Monthly Cost</p>
                  <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    Rs {Math.round(parseInt(selectedLoadDetail.watts) * 6 * 30 * 25.2 / 1000).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Recommended Action</p>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {selectedLoadDetail.grade === 'C' ? 'Schedule Technician Visit' : 'No Action Required'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedLoadDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedLoadDetail(null)
                  setIsCopilotOpen(true)
                  setChatInput(`How can I fix the issue on ${selectedLoadDetail.name}?`)
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm"
              >
                Ask ELSA About This Load
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
