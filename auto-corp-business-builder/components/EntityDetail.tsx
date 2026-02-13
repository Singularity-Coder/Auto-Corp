
import React, { useState } from 'react';
import { BusinessEntity, EntityStatus, Agent, Standup, OvernightLog, ModelConfig, SessionEvent } from '../types';
import { MODELS_SEED, STANDUPS_SEED, LOGS_SEED } from '../constants';
import { 
  ArrowLeft, 
  Activity, 
  Users, 
  Mic2, 
  Terminal, 
  FileText, 
  Cpu, 
  Play, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Save, 
  Lock,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Code,
  Info
} from 'lucide-react';

interface Props {
  entity: BusinessEntity;
  agents: Agent[];
  onAction: (id: string, action: 'SLEEP' | 'KILL' | 'ACTIVATE') => void;
  onUpdate: (updated: BusinessEntity) => void;
  onBack: () => void;
}

const EntityDetail: React.FC<Props> = ({ entity, agents, onUpdate, onBack }) => {
  const [activeTab, setActiveTab] = useState<'TASKS' | 'ORG' | 'STANDUP' | 'DOCS' | 'FINANCIALS'>('TASKS');
  const [logs] = useState<OvernightLog[]>(LOGS_SEED);
  const [models] = useState<ModelConfig[]>(MODELS_SEED);
  const [standups] = useState<Standup[]>(STANDUPS_SEED);
  const [sessions] = useState<SessionEvent[]>([
    { timestamp: new Date().toISOString(), agentId: 'ceo-01', type: 'INFO', message: 'Orchestrating daily resources', tokenCount: 450, cost: 0.0009 },
    { timestamp: new Date().toISOString(), agentId: 'eng-01', type: 'HEARTBEAT', message: 'Node online' }
  ]);

  const [vfs, setVfs] = useState({
    'SOUL.md': '# Orion-Alpha Soul\nYou are the primary orchestrator. Govern with efficiency and logic.',
    'IDENTITY.md': 'Name: Orion-Alpha\nRole: CEO\nVersion: 4.2.0-stable',
    'USER.md': 'System Admin: User-1\nAuth: Master-Key'
  });
  const [selectedFile, setSelectedFile] = useState<string>('SOUL.md');
  const [editMode, setEditMode] = useState(false);
  const [tempObjective, setTempObjective] = useState(entity.objective || '');

  // Filter agents for this specific entity
  const entityAgents = agents.filter(a => a.assignedEntityId === entity.id);

  const tabs = [
    { id: 'TASKS', label: 'Monitor', icon: <Activity size={18} /> },
    { id: 'ORG', label: 'Org Chart', icon: <Users size={18} /> },
    { id: 'FINANCIALS', label: 'Financials', icon: <TrendingUp size={18} /> },
    { id: 'STANDUP', label: 'Standups', icon: <Mic2 size={18} /> },
    { id: 'DOCS', label: 'Registry', icon: <FileText size={18} /> }
  ];

  const handleObjectiveUpdate = () => {
    onUpdate({ ...entity, objective: tempObjective });
  };

  return (
    <div className="h-screen flex flex-col bg-[#FDFDFF] overflow-hidden text-slate-900">
      
      {/* Top Header */}
      <header className="h-20 border-b border-slate-100 flex items-center justify-between px-10 bg-white z-20 shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
            <ArrowLeft size={20} className="text-slate-400" />
          </button>
          <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{entity.name}</h2>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Command Center v8.01 // {entity.jurisdiction}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Session Uptime</span>
             <span className="text-xs font-bold font-mono">12:44:02:11</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <div className={`w-2 h-2 rounded-full animate-pulse ${entity.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{entity.status}</span>
          </div>
        </div>
      </header>

      {/* Horizontal Tabs Bar */}
      <div className="bg-white border-b border-slate-100 px-10 py-2 flex items-center gap-2 shrink-0 overflow-x-auto custom-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30 p-12 custom-scrollbar">
          
          {activeTab === 'TASKS' && (
            <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-500">
               <div className="grid grid-cols-4 gap-6">
                  {[
                    { label: 'Total Agents', value: entityAgents.length, icon: <Users size={16} />, color: 'text-slate-900' },
                    { label: 'Active Sessions', value: '14', icon: <Activity size={16} />, color: 'text-blue-600' },
                    { label: 'Tokens Used', value: '1.2M', icon: <Zap size={16} />, color: 'text-amber-600' },
                    { label: 'Daily Cost', value: '$2.44', icon: <Activity size={16} />, color: 'text-emerald-600' }
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
                       <div className="flex justify-between items-center mb-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                          <div className={`p-2 rounded-xl bg-slate-50 ${kpi.color}`}>{kpi.icon}</div>
                       </div>
                       <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-8 space-y-6">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time Activity Stream</h4>
                     <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex text-[10px] font-black uppercase text-slate-400">
                           <span className="w-1/4">Origin</span>
                           <span className="w-1/2">Operational Event</span>
                           <span className="w-1/4 text-right">Resource Delta</span>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                           {sessions.map((s, idx) => (
                             <div key={idx} className="p-6 border-b border-slate-50 flex text-sm hover:bg-slate-50 transition-colors items-center">
                                <span className="w-1/4 font-bold text-slate-900">{s.agentId}</span>
                                <span className="w-1/2 text-slate-500">{s.message}</span>
                                <span className="w-1/4 text-right font-mono text-xs text-slate-400">+{s.tokenCount || 0} tokn</span>
                             </div>
                           ))}
                           {Array.from({ length: 6 }).map((_, i) => (
                             <div key={i} className="p-6 border-b border-slate-50 flex text-sm opacity-50 hover:opacity-100 transition-opacity">
                                <span className="w-1/4 font-bold">worker-node-{10+i}</span>
                                <span className="w-1/2">Background sync completed. No anomalies detected.</span>
                                <span className="w-1/4 text-right font-mono text-xs">0.0001 USD</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="col-span-4 space-y-10">
                     <section>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Model Fleet Topology</h4>
                        <div className="space-y-4">
                           {models.map(m => (
                             <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                                <div className="flex justify-between items-center mb-3">
                                   <div className="flex items-center gap-2">
                                      <Cpu size={14} className="text-blue-500" />
                                      <span className="text-sm font-bold text-slate-900">{m.id}</span>
                                   </div>
                                   <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg">ONLINE</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                   <span>{m.role}</span>
                                   <span>${m.costPer1k}/1k</span>
                                </div>
                             </div>
                           ))}
                        </div>
                     </section>

                     <section>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Overnight timeline</h4>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                           {logs.map(log => (
                             <div key={log.id} className="flex gap-4 group">
                                <div className="w-2 shrink-0 flex flex-col items-center">
                                   <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                                   <div className="w-px h-full bg-slate-100 group-last:hidden"></div>
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold text-slate-300 uppercase">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                   <p className="text-sm font-bold text-slate-900 mt-0.5">{log.event}</p>
                                   <p className="text-xs text-slate-500 mt-1 leading-relaxed">{log.outcome}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </section>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'ORG' && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
               <header className="flex justify-between items-center mb-16">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Corporate DNA</h3>
                    <p className="text-xs text-slate-400 uppercase font-bold mt-2">Agent Hierarchies // Multi-Node Network</p>
                  </div>
                  <div className="flex gap-3">
                     <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Export JSON</button>
                     <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95">Scaffold Node</button>
                  </div>
               </header>

               <div className="grid grid-cols-4 gap-8">
                  {(['EXECUTIVE', 'ENGINEERING', 'GROWTH', 'OPERATIONS']).map(dept => (
                    <div key={dept} className="space-y-6">
                       <header className="px-2">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dept} Cluster</h4>
                       </header>
                       <div className="space-y-4">
                          {entityAgents.filter(a => a.department === dept).map(agent => (
                            <div key={agent.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
                               <div className="flex justify-between items-start mb-4">
                                  <span className="text-[9px] font-black px-2 py-0.5 bg-slate-50 text-slate-400 rounded-lg">{agent.id}</span>
                                  <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                               </div>
                               <h5 className="font-bold text-slate-900 leading-tight">{agent.name}</h5>
                               <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">{agent.role}</p>
                               
                               {agent.customInstructions && (
                                 <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[9px] text-slate-500 italic flex items-start gap-2">
                                    <Info size={10} className="shrink-0 mt-0.5 text-blue-400" />
                                    <span className="line-clamp-2">"{agent.customInstructions}"</span>
                                 </div>
                               )}

                               <div className="mt-6 flex flex-wrap gap-1.5">
                                  {agent.modelTags.map(tag => (
                                    <span key={tag} className="text-[8px] font-black px-2 py-1 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 uppercase">{tag}</span>
                                  ))}
                               </div>
                            </div>
                          ))}
                          {entityAgents.filter(a => a.department === dept).length === 0 && (
                            <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                               <p className="text-[10px] font-bold text-slate-300 uppercase">No nodes in cluster</p>
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'FINANCIALS' && (
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
               <header>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Economic Equilibrium</h3>
                  <p className="text-xs text-slate-400 uppercase font-bold mt-2">Real-time Balance Sheet // Automated Capital Allocation</p>
               </header>

               <div className="grid grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Monthly Recurring Revenue</p>
                     <div className="flex items-end gap-4">
                        <span className="text-4xl font-black text-slate-900">$24,500</span>
                        <span className="text-emerald-500 text-xs font-bold flex items-center mb-1">
                           <ArrowUpRight size={14} /> +12%
                        </span>
                     </div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Operational Burn</p>
                     <div className="flex items-end gap-4">
                        <span className="text-4xl font-black text-slate-900">$8,200</span>
                        <span className="text-rose-500 text-xs font-bold flex items-center mb-1">
                           <ArrowDownRight size={14} /> -4%
                        </span>
                     </div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Projected Profit (Q1)</p>
                     <div className="flex items-end gap-4">
                        <span className="text-4xl font-black text-emerald-600">$16,300</span>
                        <span className="text-emerald-500 text-xs font-bold flex items-center mb-1">
                           <TrendingUp size={14} /> NOMINAL
                        </span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Revenue Growth Visualization</h4>
                     <div className="h-64 flex items-end gap-3 pb-4">
                        {[40, 55, 45, 70, 85, 95, 80, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-slate-100 rounded-t-2xl relative group cursor-pointer hover:bg-blue-600 transition-colors">
                             <div className="absolute bottom-0 left-0 w-full bg-slate-900 rounded-t-2xl transition-all duration-1000 group-hover:bg-white" style={{ height: `${h}%` }}></div>
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                               ${(h * 250).toLocaleString()}
                             </div>
                          </div>
                        ))}
                     </div>
                     <div className="flex justify-between mt-4 text-[9px] font-black text-slate-300 uppercase tracking-widest px-2">
                        <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span>
                     </div>
                  </div>

                  <div className="col-span-4 space-y-8">
                     <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">Capital Runway</h4>
                        <div className="text-4xl font-black mb-4">15.2 Months</div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 w-3/4"></div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">Based on current node expenditure</p>
                     </div>
                     <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 italic">Fiscal Strategy</h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                           "Agents are currently optimized for growth over profit. Scaling customer acquisition nodes while maintaining a 60% gross margin target."
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'STANDUP' && (
            <div className="max-w-6xl mx-auto grid grid-cols-12 gap-10 animate-in fade-in duration-500 h-full">
               <div className="col-span-8 flex flex-col gap-6">
                  <header className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Meeting Intelligence</h3>
                    <select className="bg-white border border-slate-100 text-[10px] font-black p-3 rounded-xl outline-none uppercase shadow-sm">
                       <option>ST-2025-02-14.TRANSCRIPT</option>
                    </select>
                  </header>
                  
                  <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 overflow-y-auto custom-scrollbar space-y-10">
                     {standups[0].transcript.map((line, i) => (
                       <div key={i} className="flex gap-8 group">
                          <div className="w-20 shrink-0 text-right">
                             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{line.speaker}</span>
                             <p className="text-[9px] text-slate-300 font-mono mt-1">{line.time}</p>
                          </div>
                          <div className="flex-1 text-sm text-slate-600 leading-relaxed border-l-2 border-slate-50 pl-8 group-hover:border-blue-100 transition-colors">
                             "{line.text}"
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="h-20 bg-white border border-slate-100 rounded-3xl flex items-center px-8 shadow-sm gap-8 shrink-0">
                     <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg"><Play size={18} /></button>
                     <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1/3 bg-blue-600"></div>
                     </div>
                     <span className="text-[10px] font-mono font-bold text-slate-400">02:14 / 09:44</span>
                  </div>
               </div>

               <div className="col-span-4 flex flex-col gap-8">
                  <section className="flex-1 bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm overflow-hidden flex flex-col">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center justify-between">
                        Extracted Tasks
                        <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">AI Verified</span>
                     </h4>
                     <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {standups[0].tasks.map(task => (
                          <div key={task.id} className="p-5 bg-slate-50/50 rounded-2xl flex items-center gap-4 group hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                             <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${task.status === 'DONE' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}>
                                {task.status === 'DONE' && <CheckCircle2 size={12} className="text-white" />}
                             </div>
                             <div>
                                <p className={`text-xs font-bold ${task.status === 'DONE' ? 'line-through text-slate-300' : 'text-slate-700'}`}>{task.text}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase mt-1">{task.owner}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </section>

                  <section className="h-56 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-10"><FileText size={80} /></div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">Generated Docs</h4>
                     <div className="space-y-4 relative z-10">
                        {standups[0].artifacts.map(art => (
                          <div key={art.name} className="flex items-center gap-4 text-xs font-bold group cursor-pointer hover:text-blue-400 transition-colors">
                             <div className="p-2 bg-white/10 rounded-lg"><FileText size={14} /></div>
                             <span className="truncate">{art.name}</span>
                          </div>
                        ))}
                     </div>
                  </section>
               </div>
            </div>
          )}

          {activeTab === 'DOCS' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500 space-y-16 pb-32">
               <div className="space-y-6">
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Procedural<br/>Registry</h1>
                  <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                    <Clock size={16} />
                    Last Sync: 2025-02-14
                  </p>
               </div>
               
               <article className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-12">
                  {/* Company Objective Input Field */}
                  <section className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                     <header className="flex items-center gap-4">
                        <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg"><Target size={24} /></div>
                        <div>
                           <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Operational Objective</h2>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Primary Strategic North Star</p>
                        </div>
                     </header>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mission Statement for Autonomous Agents</label>
                        <div className="relative group">
                           <input 
                              type="text"
                              value={tempObjective}
                              onChange={(e) => setTempObjective(e.target.value)}
                              onBlur={handleObjectiveUpdate}
                              placeholder="Define the core purpose for your agent swarm..."
                              className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                           />
                           <button 
                             onClick={handleObjectiveUpdate}
                             className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900 text-white rounded-xl shadow-lg opacity-0 group-focus-within:opacity-100 transition-opacity"
                           >
                             <Save size={16} />
                           </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium px-2 leading-relaxed">
                           Agents utilize this objective to weigh decision trees during autonomous cycles, balancing growth and sustainability targets.
                        </p>
                     </div>
                  </section>

                  {/* Procedural Workspace (Moved here from separate tab) */}
                  <section className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                     <header className="p-10 border-b border-slate-50 flex items-center justify-between shrink-0 bg-slate-50/30">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl"><Code size={24} /></div>
                           <div>
                              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Live Workspace</h2>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procedural Document Buffers</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => setEditMode(!editMode)} 
                             className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                               editMode ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-white border border-slate-100 text-slate-600'
                             }`}
                           >
                             {editMode ? <Lock size={12} /> : <Terminal size={12} />}
                             {editMode ? 'Lock Buffer' : 'Unlock Editor'}
                           </button>
                           <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                             <Save size={14} />
                             Commit
                           </button>
                        </div>
                     </header>
                     
                     <div className="flex items-center gap-2 p-4 bg-white border-b border-slate-50 overflow-x-auto">
                        {Object.keys(vfs).map(fileName => (
                          <button 
                            key={fileName}
                            onClick={() => setSelectedFile(fileName)}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                              selectedFile === fileName ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                            }`}
                          >
                            {fileName}
                          </button>
                        ))}
                     </div>

                     <div className="flex-1 overflow-hidden flex relative bg-white">
                        <div className="w-12 border-r border-slate-50 flex flex-col items-center py-8 gap-3 bg-slate-50/30 text-[9px] font-mono text-slate-300 select-none">
                           {Array.from({ length: 40 }).map((_, i) => <div key={i}>{i+1}</div>)}
                        </div>
                        {editMode ? (
                          <textarea 
                            className="flex-1 bg-transparent p-10 outline-none text-slate-700 text-sm font-mono leading-relaxed resize-none custom-scrollbar"
                            value={vfs[selectedFile as keyof typeof vfs]}
                            onChange={(e) => setVfs({...vfs, [selectedFile]: e.target.value})}
                            spellCheck={false}
                          />
                        ) : (
                          <div className="flex-1 p-10 text-slate-600 text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar">
                            {vfs[selectedFile as keyof typeof vfs]}
                            <span className="w-2 h-4 bg-blue-600 inline-block animate-pulse ml-1 align-middle"></span>
                          </div>
                        )}
                     </div>
                  </section>

                  <section className="space-y-6 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                     <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-6">Protocol 01: Corporate DNA</h2>
                     <p className="text-lg">Auto-Corp nodes operate on a recursive governance model. This entity is authorized to manifest operations under the following algorithmic constraints:</p>
                     <div className="p-8 bg-blue-50/50 border-l-4 border-blue-600 rounded-r-3xl">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-3 flex items-center gap-2">
                          <Activity size={12} />
                          Autonomous Threshold
                        </p>
                        <p className="text-sm font-bold text-slate-700">Agents possess a capital expenditure limit of $500 per cycle. Any transaction exceeding this requires human master-key validation.</p>
                     </div>
                  </section>

                  <section className="space-y-6">
                     <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Protocol 02: Model Tiering</h2>
                     <p>All orchestration logic prioritizes token efficiency and reasoning depth using a layered model fleet.</p>
                     <div className="p-10 bg-slate-900 rounded-[3rem] font-mono text-xs text-blue-300 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu size={120} /></div>
                        <pre className="relative z-10">
{`{
  "system": "Auto-Corp Kernel v8.01",
  "priority_layer": "gemini-3-pro-preview",
  "utility_layer": "gemini-3-flash-preview",
  "redundancy": "multi-regional-mesh",
  "status": "fully_operational"
}`}
                        </pre>
                     </div>
                  </section>
               </article>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default EntityDetail;
