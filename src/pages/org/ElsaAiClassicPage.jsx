import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap, DollarSign, Activity, Bell, Calendar, GitFork, MessageSquare,
  Sun, Battery, Flame, Home, Car, AlertTriangle, ArrowRight, ShieldCheck,
  CheckCircle2, Clock, Plus, Sparkles, Send, Bot, Check, Info, SlidersHorizontal
} from 'lucide-react'
import { DOMESTIC_DATA } from '../../utils/elsaEngine'

export default function ElsaAiClassicPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  // Rupee Triggers state
  const [whenVal, setWhenVal] = useState("Today's Spend")
  const [compVal, setCompVal] = useState('Crosses')
  const [rsVal, setRsVal] = useState('1500')
  const [thenVal, setThenVal] = useState('Switch Off')
  const [activeTriggers, setActiveTriggers] = useState(DOMESTIC_DATA.triggers.active)

  // Auto Schedule & EV state
  const [autoMode, setAutoMode] = useState(false)
  const [solarPriority, setSolarPriority] = useState(true)
  const [offPeakOnly, setOffPeakOnly] = useState(true)

  // Chat State
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'elsa',
      text: 'Salam! Main ELSA hoon, aapki home energy assistant. Aaj ka spend Rs 1,240 hai aur month projection Rs 38,400 hai under LESCO Domestic B-1 tariff. Aap bill, AC health, ya solar-to-EV ke baray mein pooch saktay hain.',
      time: '10:00 AM'
    }
  ])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Zap },
    { id: 'tariff', label: 'Bill & Tariff', icon: DollarSign },
    { id: 'health', label: 'Load Health', icon: Activity },
    { id: 'triggers', label: 'Rupee Triggers', icon: Bell },
    { id: 'schedule', label: 'Auto Schedule & EV', icon: Calendar },
    { id: 'flow', label: 'Source Flow', icon: GitFork },
    { id: 'assistant', label: 'Hey ELSA', icon: MessageSquare },
  ]

  const toggleTrigger = (id) => {
    setActiveTriggers(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t))
  }

  const handleAddTrigger = (e) => {
    e?.preventDefault()
    const newT = {
      id: `t_${Date.now()}`,
      title: `When ${whenVal} ${compVal} Rs ${rsVal}, ${thenVal}`,
      subtitle: 'Just created — armed & active',
      active: true
    }
    setActiveTriggers([newT, ...activeTriggers])
  }

  const handleSendChat = (e) => {
    e?.preventDefault()
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Just now' }])
    setChatInput('')

    setTimeout(() => {
      const q = userMsg.toLowerCase()
      let reply = "I'm monitoring your home loads (Bedroom AC, Water Pump, Kitchen, Geyser). Ask about today's bill, slab rate, or load health."
      if (q.includes('ac') || q.includes('bedroom')) {
        reply = "Bedroom AC (1450W) Grade C hai. Yeh lounge AC se 30% zyada bijli use kar raha hai — compressor servicing ya refrigerant check zaroori hai."
      } else if (q.includes('pump') || q.includes('water')) {
        reply = "Water Pump (750W) ka Power Factor 0.68 hai. Yeh inductive reactive load hai, 5 kVAR capacitor laganay se iska current drop ho jaye ga."
      } else if (q.includes('slab') || q.includes('bill')) {
        reply = "Aap 300-unit slab se sirf 32 units door hain! Agar 300 cross hua tou rate Rs 25.2 se jump kar ke Rs 33.7/unit ho jaye ga."
      } else if (q.includes('ev') || q.includes('car')) {
        reply = "EV charging 46% complete hai, target 80% ready by 8:00 AM. Aaj Rs 186 spend hua vs Rs 1,140 petrol cost — aap ne Rs 954 bacha liye!"
      }
      setChatMessages(prev => [...prev, { sender: 'elsa', text: reply, time: 'Just now' }])
    }, 500)
  }

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-7xl mx-auto font-sans text-slate-800 dark:text-slate-100">
      {/* Top Comparison Mode Switcher */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-slate-950">
            Version 1: Classic
          </span>
          <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
            Original 7-Tab Layout (Exactly as on fico-project prototype)
          </span>
        </div>
        <button
          onClick={() => navigate('/elsa-preview')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm transition-all"
        >
          <span>Switch to Version 2: New 3-Page Executive View</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Prototype Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">EMS Platform</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            ORGANIZATION ADMIN
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium mt-0.5">ORGANIZATION ADMIN / ELSA-AI</div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">ELSA AI</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
          RUPEE-BASED AUTOMATION · BILL INTELLIGENCE · LOAD HEALTH
        </p>
      </div>

      {/* 7 Tab Navigation Bar (Exact Prototype Tabs) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW (Screenshot 1 Exact Replicant)             */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Live Source Flow Pills */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Live Source Flow</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-lg border border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 flex items-center gap-1.5 font-bold">
                <Sun size={14} /> Solar · live
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 flex items-center gap-1.5">
                <Battery size={14} /> Battery
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Zap size={14} /> WAPDA / Grid
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 flex items-center gap-1.5">
                <Flame size={14} /> Generator
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                Home + EV
              </span>
            </div>
          </div>

          {/* 3 Spend KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TODAY (ESTIMATE)</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">Rs 1,240</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MONTH PROJECTED</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">Rs 38,400</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TARGET</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">Rs 50,000</p>
            </div>
          </div>

          {/* What ELSA Saved You Today */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">What ELSA Saved You Today</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                Pump shift: Rs 81
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                Peak defense: Rs 220
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                Solar-to-EV: Rs 179
              </span>
              <span className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold">
                Total: Rs 480
              </span>
            </div>
          </div>

          {/* 4 Dials / Strips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MDI GAUGE</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">4.1 kW</p>
              <p className="text-xs text-slate-400 mt-0.5">of 7 kW sanctioned</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PF DIAL</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">0.89</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">THD STRIP</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">3.2%</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FEEDERS ONLINE</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">6 / 6</p>
            </div>
          </div>

          {/* Load Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Load Grid</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {DOMESTIC_DATA.overview.loadGrid.map((item) => (
                <div key={item.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-[11px] text-slate-400">{item.watts}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      item.grade === 'C' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                      item.grade === 'B' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      Grade {item.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EV Charging Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Car size={14} className="text-amber-500" /> EV Charging Status
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Ready by 8:00 AM — 46% / 80% · Rs 186 so far vs Rs 1,140 petrol equivalent
            </p>
          </div>

          {/* Alerts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2 text-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Alerts</h3>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Bedroom AC — 1,500W active, house is empty. Turn it off now?</span>
              <span className="text-amber-600 font-bold">Review</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Circuit 4 (Kitchen) degradation trend — 8% → 12% over 3 weeks.</span>
              <span className="text-rose-600 font-bold">Checkup</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: BILL & TARIFF (Screenshot 2 Exact Replicant)       */}
      {/* ========================================================= */}
      {activeTab === 'tariff' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tariff Engine</h3>
              <p className="text-xs text-slate-400">DISCO rate built-in — every unit shown in rupees automatically</p>
            </div>
            <div className="w-64">
              <select className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold">
                <option>LESCO — Domestic B-1 (Previous)</option>
                <option>LESCO — Industrial B2</option>
              </select>
            </div>
          </div>

          {/* 4 Cards */}
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

          {/* Info callout */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <Info size={16} />
            <span>You're 32 units away — crossing the 300 unit slab will move the rate from Rs 25.2 to Rs 33.7.</span>
          </div>

          {/* Slab Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">SLAB TABLE</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">0 - 100 units: Rs 17.5</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">100 - 200 units: Rs 21.4</span>
              <span className="px-3 py-1.5 rounded-lg border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 font-bold text-amber-700 dark:text-amber-300">
                200 - 300 units: Rs 25.2
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">300 - 400 units: Rs 33.7</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">400 - 700 units: Rs 41.9</span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">700 - ∞ units: Rs 55.1</span>
            </div>
          </div>

          {/* Bill Breakup */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
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
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }}></span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{row.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 dark:text-white">{row.rs}</span>
                      <span className={`text-[10px] font-bold ${
                        row.reduces === 'yes' ? 'text-emerald-600' :
                        row.reduces === 'partially' ? 'text-amber-600' : 'text-slate-400'
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">AI Warnings</h4>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex justify-between items-center">
              <span>⚠️ Measured max demand is 4.1 kW vs a sanctioned 7 kW — you're paying Rs 480/month extra in fixed charges. Get your sanctioned load reviewed.</span>
              <span className="font-bold text-rose-600 whitespace-nowrap">Rs 480</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex justify-between items-center">
              <span>⚠️ You're about to cross the 300-unit slab — the rate will jump from Rs 25.2 to Rs 33.7 (32 units left).</span>
              <span className="font-bold text-rose-600 whitespace-nowrap">Rs 271</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: LOAD HEALTH (Screenshot 3 Exact Replicant)         */}
      {/* ========================================================= */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          {/* Room-Wise Ranking */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
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
                  <div className="w-full max-w-[64px] bg-amber-500 rounded-t-lg relative" style={{ height: bar.h }}>
                    {bar.highlight && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-amber-500 text-amber-600 font-bold text-[10px] shadow-sm whitespace-nowrap">
                        Kitchen: 24%
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[80px]">{bar.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-Load Health Report */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Per-Load Health Report</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DOMESTIC_DATA.overview.loadGrid.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between">
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
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{item.note}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 cursor-pointer mt-3">View detail &gt;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: RUPEE TRIGGERS (Screenshot 4 Exact Replicant)      */}
      {/* ========================================================= */}
      {activeTab === 'triggers' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rupee Triggers</h3>
            <p className="text-xs text-slate-400">Default automation unit = rupees, not amps. Sentence builder — 3 dropdowns.</p>
          </div>

          <form onSubmit={handleAddTrigger} className="flex flex-wrap items-end gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="w-48">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WHEN</label>
              <select value={whenVal} onChange={e => setWhenVal(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                <option>Today's Spend</option>
                <option>Current Rate</option>
                <option>Month Projection</option>
              </select>
            </div>
            <div className="w-36">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">COMPARATOR</label>
              <select value={compVal} onChange={e => setCompVal(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                <option>Crosses</option>
                <option>Falls Below</option>
              </select>
            </div>
            <div className="w-28">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">RS</label>
              <input type="text" value={rsVal} onChange={e => setRsVal(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
            </div>
            <div className="w-44">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">THEN</label>
              <select value={thenVal} onChange={e => setThenVal(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
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
            WHEN {whenVal} {compVal} Rs {rsVal} THEN {thenVal}
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase mb-2"># TEMPLATES</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {DOMESTIC_DATA.triggers.templates.map((tmpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (tmpl.includes('1,500')) {
                      setWhenVal("Today's Spend"); setCompVal('Crosses'); setRsVal('1500'); setThenVal('Set Bedroom AC to 26°')
                    } else if (tmpl.includes('below Rs 25')) {
                      setWhenVal('Current Rate'); setCompVal('Falls Below'); setRsVal('25'); setThenVal('Turn Geyser on')
                    } else {
                      setWhenVal('Month Projection'); setCompVal('Crosses'); setRsVal('40000'); setThenVal('Shed non-essential group + notify')
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-amber-500"
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
      )}

      {/* ========================================================= */}
      {/* TAB 5: AUTO SCHEDULE & EV (Screenshot 5 Exact Replicant)  */}
      {/* ========================================================= */}
      {activeTab === 'schedule' && (
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
              onClick={() => setAutoMode(!autoMode)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              {autoMode ? 'Auto Mode: ON' : 'Enable Auto Mode'}
            </button>
          </div>

          {/* EV Charging */}
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

          {/* Goal Plan — Bill Target */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span>⭐ Goal Plan — Bill Target</span>
              <span className="text-slate-400">Target: Rs 50,000 · Current projection: Rs 38,400</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between items-center text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mt-0.5">✓</span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Stage 1: Zero-cost scheduling</p>
                  <p className="text-[11px] text-slate-400">Already applied automatically — contributing to the current pace</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600">Rs 4,200</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Applied</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between items-center text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Stage 2: Small one-time fixes (service, capacitor, sanctioned-load review)</p>
                  <p className="text-[11px] text-slate-400">Book an electrician for pump + AC service for further headroom</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-white">Rs 2,800</span>
                <button className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs">Apply</button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between items-center text-xs">
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
      )}

      {/* ========================================================= */}
      {/* TAB 6: SOURCE FLOW (Exact Screenshot media_1791268517701.png) */}
      {/* ========================================================= */}
      {activeTab === 'flow' && (
        <div className="space-y-4">
          {/* 1. Source Orchestration Top Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
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
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: HEY ELSA (Full Tab View from Classic Prototype)   */}
      {/* ========================================================= */}
      {activeTab === 'assistant' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Hey ELSA · AI Energy Engineer</h3>
              <p className="text-xs text-slate-400">Context: Domestic Prototype (LESCO B-1, 6 Monitored Devices)</p>
            </div>
          </div>

          <div className="space-y-3 h-80 overflow-y-auto p-2">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask: 'Why is Bedroom AC Grade C?', 'How to avoid crossing slab?', 'EV savings?'..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
