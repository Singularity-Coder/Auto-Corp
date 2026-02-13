
import React, { useState } from 'react';
import { Agent, BusinessEntity } from '../types';
import { 
  Plus, 
  Search, 
  Zap, 
  Shield, 
  Globe, 
  Terminal, 
  Briefcase, 
  TrendingUp, 
  Cpu, 
  Sparkles,
  ShoppingBag,
  Check,
  Building,
  Info
} from 'lucide-react';

interface Props {
  fleet: BusinessEntity[];
  onHire: (agent: Agent) => void;
}

const TEMPLATES = [
  {
    role: 'Legal Compliance Officer',
    desc: 'Ensures all automated filings meet regional statutory requirements.',
    dept: 'OPERATIONS',
    icon: <Shield size={20} />,
    model: 'gemini-3-pro-preview',
    cost: 'High Reasoning'
  },
  {
    role: 'Market Growth Hacker',
    desc: 'Optimizes viral loops and content distribution across social meshes.',
    dept: 'GROWTH',
    icon: <TrendingUp size={20} />,
    model: 'gemini-3-flash-preview',
    cost: 'Low Latency'
  },
  {
    role: 'System Architect',
    desc: 'Designs scalable cloud infrastructure and manages SRE nodes.',
    dept: 'ENGINEERING',
    icon: <Cpu size={20} />,
    model: 'gemini-3-pro-preview',
    cost: 'High Reasoning'
  },
  {
    role: 'Outreach Specialist',
    desc: 'Automates cold communication and lead qualification pipelines.',
    dept: 'GROWTH',
    icon: <Globe size={20} />,
    model: 'gemini-3-flash-preview',
    cost: 'Token Efficient'
  }
];

const AgentMarketplace: React.FC<Props> = ({ fleet, onHire }) => {
  const [hiringId, setHiringId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    role: '',
    department: 'OPERATIONS' as any,
    model: 'gemini-3-flash-preview',
    instructions: '',
    entityId: fleet[0]?.id || ''
  });

  const handleHire = (template: typeof TEMPLATES[0]) => {
    const id = `agent-${Math.floor(Math.random() * 10000)}`;
    setHiringId(template.role);
    
    // Default deployment to the first available company for templates
    setTimeout(() => {
      onHire({
        id,
        name: `${template.role.split(' ')[0]}-${id.split('-')[1]}`,
        role: template.role,
        department: template.dept as any,
        status: 'ACTIVE',
        modelTags: [template.model],
        responsibilities: [template.desc],
        assignedEntityId: fleet[0]?.id
      });
      setHiringId(null);
    }, 1000);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.name || !newAgent.role) return;

    const id = `custom-${Math.floor(Math.random() * 10000)}`;
    onHire({
      id,
      name: newAgent.name,
      role: newAgent.role,
      department: newAgent.department,
      status: 'ACTIVE',
      modelTags: [newAgent.model],
      responsibilities: ['Custom defined operational objective'],
      customInstructions: newAgent.instructions,
      assignedEntityId: newAgent.entityId
    });
    setNewAgent({ 
      name: '', 
      role: '', 
      department: 'OPERATIONS', 
      model: 'gemini-3-flash-preview',
      instructions: '',
      entityId: fleet[0]?.id || '' 
    });
    setShowCreateForm(false);
  };

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Agent<br/>Marketplace</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-2">
            <ShoppingBag size={14} /> Global Procurement Hub
          </p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform active:scale-95"
        >
          <Sparkles size={18} />
          Create Custom Agent
        </button>
      </header>

      {/* Hero Search */}
      <div className="relative">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
         <input 
            type="text" 
            placeholder="Search specialized expertise (e.g. Smart Contract Auditor, SEO Specialist...)"
            className="w-full bg-white border border-slate-100 rounded-[2.5rem] p-8 pl-16 text-lg font-bold shadow-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TEMPLATES.map((tpl, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all group flex flex-col">
             <div className="flex justify-between items-start mb-8">
                <div className="p-5 bg-slate-50 rounded-3xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {tpl.icon}
                </div>
                <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-4 py-2 rounded-xl uppercase tracking-widest">{tpl.dept}</span>
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{tpl.role}</h3>
             <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-1">{tpl.desc}</p>
             
             <div className="flex items-center justify-between border-t border-slate-50 pt-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Compute Tier</p>
                  <p className="text-xs font-bold text-slate-900">{tpl.cost}</p>
                </div>
                <button 
                  onClick={() => handleHire(tpl)}
                  disabled={hiringId === tpl.role}
                  className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                    hiringId === tpl.role ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {hiringId === tpl.role ? <Check size={14} /> : <Zap size={14} />}
                  {hiringId === tpl.role ? 'Hired' : 'Hire Instance'}
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl space-y-8 relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => setShowCreateForm(false)}
                className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
              
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Agent Laboratory</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Construct custom neural worker</p>
              </div>

              <form onSubmit={handleCreateCustom} className="space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identifier Name</label>
                       <input 
                         required
                         value={newAgent.name}
                         onChange={e => setNewAgent({...newAgent, name: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900" 
                         placeholder="e.g. Void-Runner-9"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Specialized Role</label>
                       <input 
                         required
                         value={newAgent.role}
                         onChange={e => setNewAgent({...newAgent, role: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900" 
                         placeholder="e.g. Narrative Architect"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cluster</label>
                       <select 
                         value={newAgent.department}
                         onChange={e => setNewAgent({...newAgent, department: e.target.value as any})}
                         className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none appearance-none"
                       >
                          <option value="OPERATIONS">OPERATIONS</option>
                          <option value="ENGINEERING">ENGINEERING</option>
                          <option value="GROWTH">GROWTH</option>
                          <option value="EXECUTIVE">EXECUTIVE</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Intelligence Model</label>
                       <select 
                         value={newAgent.model}
                         onChange={e => setNewAgent({...newAgent, model: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none appearance-none"
                       >
                          <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                          <option value="gemini-3-pro-preview">Gemini 3 Pro (Reasoning)</option>
                       </select>
                    </div>
                 </div>

                 {/* Deploy Selection */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                       <Building size={12} /> Deployment Target Entity
                    </label>
                    <select 
                      value={newAgent.entityId}
                      onChange={e => setNewAgent({...newAgent, entityId: e.target.value})}
                      className="w-full bg-blue-50/50 border-none rounded-2xl p-5 text-sm font-black text-blue-900 outline-none appearance-none"
                    >
                       {fleet.map(e => (
                         <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                       ))}
                       {fleet.length === 0 && <option value="">No entities available</option>}
                    </select>
                 </div>

                 {/* Custom Instructions */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                       <Terminal size={12} /> System Instructions & Soul
                    </label>
                    <textarea 
                      value={newAgent.instructions}
                      onChange={e => setNewAgent({...newAgent, instructions: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-mono leading-relaxed outline-none focus:ring-2 focus:ring-slate-900 min-h-[150px] resize-none" 
                      placeholder="Enter specific behavioral protocols, persona details, or operational constraints for this agent..."
                    />
                    <p className="text-[9px] text-slate-400 font-medium px-1 flex items-center gap-2">
                       <Info size={10} /> These instructions will be baked into the agent's core reasoning cycle.
                    </p>
                 </div>

                 <button className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-slate-800 active:scale-95 transition-all">
                    Initialize Neural Node
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AgentMarketplace;
