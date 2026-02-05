
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  entityName: string;
  entityStatus: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, entityName, entityStatus }) => {
  const tabs = [
    { id: 'dashboard', label: 'Entity Fleet', icon: '🏦' },
    { id: 'settings', label: 'Global Config', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFF] overflow-hidden text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col hidden lg:flex">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200">A</div>
             <h1 className="text-2xl font-black tracking-tight text-slate-900">Auto-Corp</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Automated Orchestration</p>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4">
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
              <span className="mr-4 text-xl">{tab.icon}</span>
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
            <div className="mt-6 pt-6 border-t border-slate-200/50">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                <span>Network Integrity</span>
                <span className="text-emerald-500">98%</span>
              </div>
              <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Mobile Nav Placeholder / Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-sm tracking-tight">Auto-Corp</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#FDFDFF]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
