
import React from 'react';
import { BusinessEntity, EntityStatus } from '../types';

interface Props {
  fleet: BusinessEntity[];
  onViewDetail: (id: string) => void;
  onDeploy: () => void;
}

const FleetDashboard: React.FC<Props> = ({ fleet, onViewDetail, onDeploy }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Fleet</h2>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-bold tracking-widest">Global Portfolio Registry</p>
        </div>
        <button 
          onClick={onDeploy}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 transition-transform active:scale-95"
        >
          New Entity +
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fleet.length === 0 ? (
          <div className="col-span-full py-24 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center bg-white/50">
            <span className="text-5xl mb-4 grayscale opacity-30">🏢</span>
            <p className="text-slate-400 font-bold">The registry is currently empty.</p>
            <button onClick={onDeploy} className="mt-4 text-blue-600 font-bold text-sm">Initialize first node</button>
          </div>
        ) : (
          fleet.map((entity) => (
            <div 
              key={entity.id} 
              onClick={() => onViewDetail(entity.id)}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500 cursor-pointer group overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">{entity.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{entity.jurisdiction}</p>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                    entity.status === EntityStatus.ACTIVE ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    entity.status === EntityStatus.SLEEPING ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {entity.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase">Capitalization</span>
                    <span className="text-slate-900">${entity.currentCapital.toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                    <div className="bg-slate-900 h-full transition-all duration-1000" style={{ width: `${Math.min(100, (entity.currentCapital / 100000) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                   <span className="text-[10px] font-bold text-slate-300">EST. {entity.incorporationDate ? new Date(entity.incorporationDate).toLocaleDateString() : 'N/A'}</span>
                   <span className="text-blue-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Manage Control →</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FleetDashboard;
