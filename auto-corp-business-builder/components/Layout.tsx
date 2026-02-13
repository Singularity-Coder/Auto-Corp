
import React from 'react';
import { LayoutDashboard, Settings, Bot, Building2, ShoppingBag, Share2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  entityName: string;
  entityStatus: string;
  isChatOpen: boolean;
  onToggleChat: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  entityName, 
  entityStatus,
  isChatOpen,
  onToggleChat
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Entity Fleet', icon: <LayoutDashboard size={20} /> },
    { id: 'marketplace', label: 'Agent Marketplace', icon: <ShoppingBag size={20} /> },
    { id: 'bridge', label: 'The Bridge', icon: <Share2 size={20} /> },
    { id: 'settings', label: 'Global Config', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFF] overflow-hidden text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col hidden lg:flex shrink-0">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200">
               <Building2 size={24} />
             </div>
             <h1 className="text-2xl font-black tracking-tight text-slate-900">Auto-Corp</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Automated Orchestration</p>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="mr-4">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-50">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-inner">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Active Context</p>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 truncate">{entityName || 'Awaiting Definition...'}</h4>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${entityStatus === 'ACTIVE' ? 'bg-emerald-500' : entityStatus === 'DRAFT' ? 'bg-blue-400' : 'bg-slate-300'}`}></div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{entityStatus || 'IDLE'}</span>
              </div>
            </div>
            
            <button 
              onClick={onToggleChat}
              className="w-full mt-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2"
            >
              <Bot size={14} />
              {isChatOpen ? 'Close Orchestrator' : 'Summon Orchestrator'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full">
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-sm tracking-tight">Auto-Corp</span>
          </div>
          <button onClick={onToggleChat} className="p-2 bg-slate-50 rounded-lg"><Bot size={18} /></button>
        </header>

        <main className={`flex-1 overflow-y-auto bg-[#FDFDFF] transition-all duration-500 ${isChatOpen ? 'lg:mr-[400px]' : ''}`}>
          {children}
        </main>
      </div>

      {!isChatOpen && (
        <button 
          onClick={onToggleChat}
          className="fixed bottom-10 right-10 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all z-40 group"
        >
          <Bot size={28} />
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">
            Need Guidance?
          </span>
        </button>
      )}
    </div>
  );
};

export default Layout;
