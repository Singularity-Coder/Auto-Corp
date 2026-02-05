
import React, { useState } from 'react';
import { BusinessEntity, EntityStatus, VCRecommendation } from '../types';
import { getVCMatch } from '../geminiService';

interface Props {
  entity: BusinessEntity;
  onAction: (id: string, action: 'SLEEP' | 'KILL' | 'ACTIVATE') => void;
  onUpdate: (updated: BusinessEntity) => void;
  onBack: () => void;
}

const EntityDetail: React.FC<Props> = ({ entity, onAction, onUpdate, onBack }) => {
  const [vcMatches, setVcMatches] = useState<VCRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVCs = async () => {
    setLoading(true);
    const matches = await getVCMatch(entity.name, entity.industry);
    setVcMatches(matches);
    setLoading(false);
  };

  const handleTakeLoan = () => {
    const loanAmount = 25000;
    onUpdate({ ...entity, currentCapital: entity.currentCapital + loanAmount });
    alert(`Applied automated venture debt protocol. $${loanAmount.toLocaleString()} injected into Treasury.`);
  };

  return (
    <div className="p-12 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <button onClick={onBack} className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 hover:underline">← Back to Fleet</button>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{entity.name}</h2>
            <span className={`text-xs font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${
               entity.status === EntityStatus.ACTIVE ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
               entity.status === EntityStatus.SLEEPING ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {entity.status}
            </span>
          </div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{entity.industry} • {entity.jurisdiction}</p>
        </div>

        <div className="flex gap-3">
          {entity.status === EntityStatus.ACTIVE ? (
            <button onClick={() => onAction(entity.id, 'SLEEP')} className="bg-amber-50 text-amber-700 border border-amber-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-amber-100 transition-colors">Hibernate</button>
          ) : (
            <button onClick={() => onAction(entity.id, 'ACTIVATE')} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-colors">Wake Up</button>
          )}
          <button onClick={() => onAction(entity.id, 'KILL')} className="bg-rose-50 text-rose-700 border border-rose-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-colors">Liquidate</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h4 className="font-bold text-slate-900 text-xl tracking-tight">Treasury & Capitalization</h4>
                <span className="text-3xl font-black text-slate-900">${entity.currentCapital.toLocaleString()}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleTakeLoan}
                  className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform"
                >
                  <span className="text-2xl mb-2">💸</span>
                  <span className="text-sm font-bold">Apply for Venture Debt</span>
                  <span className="text-[10px] opacity-60 mt-1">Instant $25k Draw</span>
                </button>
                <button 
                  onClick={fetchVCs}
                  className="p-6 bg-blue-600 text-white rounded-3xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform"
                >
                  <span className="text-2xl mb-2">📈</span>
                  <span className="text-sm font-bold">Match Seed Capital</span>
                  <span className="text-[10px] opacity-60 mt-1">Algorithm Scan</span>
                </button>
             </div>

             {vcMatches.length > 0 && (
               <div className="mt-8 space-y-4 animate-in slide-in-from-top-4 duration-500">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matched Venture Clusters</h5>
                  {vcMatches.map((vc, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div>
                          <p className="text-sm font-bold">{vc.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{vc.focus}</p>
                       </div>
                       <div className="text-right">
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Fit: {vc.fitScore}%</span>
                          <button className="block text-[10px] font-bold text-blue-600 mt-1">Transmit Profile</button>
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </section>

          <section className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Automated Compliance Node</h4>
            <div className="space-y-4">
               {[
                 { event: "Entity State Transmitted", to: "Regulatory Cluster", time: "Instant" },
                 { event: "Tax Registry Sync", to: "Gov Gateway", time: "Delivered" },
                 { event: "Status Broadcast", to: "Shareholder Pool", time: "Success" },
               ].map((log, i) => (
                 <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-slate-200">
                    <span className="font-medium text-slate-600">{log.event} → <span className="text-slate-900 font-bold">{log.to}</span></span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">{log.time}</span>
                 </div>
               ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Internal Registry</h4>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">System ID</p>
                    <p className="text-sm font-mono font-bold mt-1 uppercase text-slate-700">{entity.id}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Establishment</p>
                    <p className="text-sm font-bold mt-1 text-slate-700">{entity.incorporationDate ? new Date(entity.incorporationDate).toLocaleDateString() : 'Active Context'}</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Engine Analysis</h4>
              <p className="text-xs text-slate-300 leading-relaxed italic">"Liquidation protocol is currently idle. Capital reserves are sufficient for the next operational cycle."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDetail;
