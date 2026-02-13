
import React, { useState } from 'react';
import { Integration } from '../types';
import { 
  Mail, 
  MessageSquare, 
  FileText, 
  Github, 
  CreditCard, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Link as LinkIcon,
  RefreshCw,
  Plus,
  Search,
  ExternalLink,
  Share2
} from 'lucide-react';

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: 'google-workspace', name: 'Google Workspace', provider: 'Google', category: 'PRODUCTION', status: 'CONNECTED', lastSync: '2025-02-14T08:00:00Z', capabilities: ['Gmail API', 'Google Docs', 'Drive Storage'] },
  { id: 'slack', name: 'Slack', provider: 'Slack Technologies', category: 'COMMUNICATION', status: 'DISCONNECTED', capabilities: ['Channel Management', 'Agent Notifications'] },
  { id: 'github', name: 'GitHub', provider: 'GitHub Inc.', category: 'DEV', status: 'PENDING', capabilities: ['Repo Auto-scaffold', 'Issue Tracking'] },
  { id: 'stripe', name: 'Stripe', provider: 'Stripe Inc.', category: 'FINANCE', status: 'DISCONNECTED', capabilities: ['Payment Links', 'Subscription Management'] },
  { id: 'mercury', name: 'Mercury', provider: 'Mercury Bank', category: 'FINANCE', status: 'CONNECTED', lastSync: '2025-02-14T10:30:00Z', capabilities: ['Cash Management', 'Virtual Cards'] },
  { id: 'x-twitter', name: 'X / Twitter', provider: 'X Corp', category: 'GROWTH', status: 'DISCONNECTED', capabilities: ['Automated Posting', 'Audience Analytics'] },
];

const categoryIcons: Record<string, React.ReactNode> = {
  'COMMUNICATION': <MessageSquare size={20} />,
  'PRODUCTION': <FileText size={20} />,
  'FINANCE': <CreditCard size={20} />,
  'GROWTH': <Globe size={20} />,
  'DEV': <Github size={20} />,
};

const IntegrationsGallery: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const toggleConnection = (id: string) => {
    setConnectingId(id);
    setTimeout(() => {
      setIntegrations(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED',
            lastSync: new Date().toISOString()
          };
        }
        return item;
      }));
      setConnectingId(null);
    }, 1500);
  };

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">The Bridge</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin-slow" /> Central Integration Hub
          </p>
        </div>
        <div className="flex gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Find a capability..."
                className="bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all w-64"
              />
           </div>
           <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-3">
              <Plus size={18} /> Request Custom API
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {integrations.map((app) => (
          <div key={app.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all group flex flex-col relative overflow-hidden">
             {app.status === 'CONNECTED' && (
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
             )}
             
             <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`p-5 rounded-3xl transition-all ${
                  app.status === 'CONNECTED' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-400'
                }`}>
                  {categoryIcons[app.category]}
                </div>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${
                     app.status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 
                     app.status === 'PENDING' ? 'bg-amber-500' : 'bg-slate-200'
                   }`}></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.status}</span>
                </div>
             </div>

             <div className="space-y-1 mb-8 relative z-10">
                <h3 className="text-2xl font-black text-slate-900">{app.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.provider}</p>
             </div>

             <div className="space-y-4 mb-10 flex-1 relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Enabled Capabilities</p>
                <div className="flex flex-wrap gap-2">
                   {app.capabilities.map(cap => (
                     <span key={cap} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 flex items-center gap-1.5">
                        <Zap size={10} className="text-blue-500" />
                        {cap}
                     </span>
                   ))}
                </div>
             </div>

             <div className="pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                <button 
                   onClick={() => toggleConnection(app.id)}
                   disabled={connectingId === app.id}
                   className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                     app.status === 'CONNECTED' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-slate-900 text-white hover:bg-slate-800'
                   }`}
                >
                   {connectingId === app.id ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Authorizing...
                      </>
                   ) : app.status === 'CONNECTED' ? (
                      <>
                        <ShieldCheck size={14} />
                        Disconnect Bridge
                      </>
                   ) : (
                      <>
                        <LinkIcon size={14} />
                        Establish Neural Link
                      </>
                   )}
                </button>
                {app.status === 'CONNECTED' && (
                  <button className="ml-4 p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                    <ExternalLink size={18} />
                  </button>
                )}
             </div>
          </div>
        ))}
      </div>

      <section className="bg-slate-900 rounded-[3.5rem] p-16 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute bottom-0 right-0 p-16 opacity-10 rotate-12 scale-150"><Share2 size={200} /></div>
         <div className="max-w-2xl space-y-8 relative z-10">
            <h4 className="text-3xl font-black tracking-tight uppercase">Agent Autonomy Warning</h4>
            <p className="text-slate-400 leading-relaxed font-medium">
               Authorized integrations allow your agent fleet to execute actions on your behalf. Ensure your <span className="text-blue-400 font-bold">Operational Objective</span> in the Registry is clearly defined to prevent unexpected resource consumption.
            </p>
            <div className="flex gap-6">
               <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex-1">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Sync Latency</p>
                  <p className="text-2xl font-black">1.2ms</p>
               </div>
               <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex-1">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Total Packets</p>
                  <p className="text-2xl font-black">42.4M</p>
               </div>
               <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex-1">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Neural Bandwidth</p>
                  <p className="text-2xl font-black">98.2%</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default IntegrationsGallery;
