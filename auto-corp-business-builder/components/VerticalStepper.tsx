
import React, { useState, useEffect } from 'react';
import { CORP_STEPS } from '../constants';
import { BusinessEntity, EntityStatus, VCRecommendation, EntityAdvice } from '../types';
import { getVCMatch, getEntityAdvice, getInfraAdvice } from '../geminiService';

interface Props {
  entity: BusinessEntity;
  setEntity: (e: BusinessEntity) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
  onBack: () => void;
}

const VerticalStepper: React.FC<Props> = ({ entity, setEntity, currentStep, setCurrentStep, onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [vcMatches, setVcMatches] = useState<VCRecommendation[]>([]);
  const [advice, setAdvice] = useState<EntityAdvice | null>(null);
  const [infra, setInfra] = useState<any[]>([]);

  // Track progress on the entity object
  useEffect(() => {
    if (currentStep > entity.stepsCompleted) {
      setEntity({ ...entity, stepsCompleted: currentStep });
    }
  }, [currentStep]);

  const next = () => {
    const nextStep = Math.min(currentStep + 1, CORP_STEPS.length);
    setCurrentStep(nextStep);
  };

  const prev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleIdeationSubmit = async () => {
    if (!entity.name || !entity.industry) return;
    setLoading(true);
    try {
      const result = await getEntityAdvice(entity.jurisdiction, entity.industry);
      setAdvice(result);
      next();
    } catch (e) {
      console.error(e);
      next(); 
    } finally {
      setLoading(false);
    }
  };

  const handleFundingSearch = async () => {
    setLoading(true);
    try {
      const matches = await getVCMatch(entity.name, entity.industry);
      setVcMatches(matches);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInfraScan = async () => {
    setLoading(true);
    try {
      const result = await getInfraAdvice(entity.industry);
      setInfra(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const finishDeployment = () => {
    setEntity({ 
      ...entity, 
      stepsCompleted: 5, 
      status: EntityStatus.ACTIVE, 
      incorporationDate: new Date().toISOString() 
    });
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-90"
          title="Return to Fleet"
        >
          ←
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Entity Constructor</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Procedural Creation Flow</p>
        </div>
      </header>

      <div className="flex flex-col space-y-10">
        {CORP_STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="relative">
              {step.id !== CORP_STEPS.length && (
                <div className={`absolute left-6 top-12 w-0.5 h-full -ml-px transition-colors duration-500 ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
              )}

              <div className="flex items-start">
                <div 
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl z-10 transition-all duration-300 cursor-pointer ${
                    isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110 ring-4 ring-blue-50' : 
                    isCompleted ? 'bg-blue-100 text-blue-600' : 'bg-white border-2 border-slate-100 text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {isCompleted ? '✓' : step.icon}
                </div>

                <div className="ml-8 flex-1 pb-4">
                  <header 
                    onClick={() => setCurrentStep(step.id)}
                    className="flex flex-col cursor-pointer group"
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                      Phase {step.id}
                    </span>
                    <h3 className={`text-xl font-bold tracking-tight transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {step.title}
                    </h3>
                  </header>

                  {isActive && (
                    <div className="mt-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm p-8 animate-in fade-in slide-in-from-top-6 duration-500 ease-out overflow-hidden">
                      {step.component === 'IDEATION' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Corp Name</label>
                              <input 
                                value={entity.name} 
                                onChange={e => setEntity({...entity, name: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="e.g. Nexus Forge"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Jurisdiction</label>
                              <select 
                                value={entity.jurisdiction}
                                onChange={e => setEntity({...entity, jurisdiction: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none cursor-pointer"
                              >
                                <option>Delaware, USA</option>
                                <option>Wyoming, USA</option>
                                <option>London, UK</option>
                                <option>Singapore</option>
                                <option>Estonia (Digital)</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Market Sector</label>
                            <input 
                              value={entity.industry}
                              onChange={e => setEntity({...entity, industry: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none"
                              placeholder="e.g. AI Infrastructure"
                            />
                          </div>
                          <button 
                            disabled={!entity.name || !entity.industry || loading}
                            onClick={handleIdeationSubmit}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl font-bold transition-all transform active:scale-[0.98]"
                          >
                            {loading ? 'Analyzing Regulations...' : 'Initialize Identity'}
                          </button>
                        </div>
                      )}

                      {step.component === 'FORMALIZATION' && (
                        <div className="space-y-6">
                          <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl">📋</div>
                            <div>
                              <h4 className="font-bold text-blue-900 text-sm">Target Entity: {advice?.recommendedEntity || 'LLC'}</h4>
                              <p className="text-xs text-blue-600">Time to Operational: {advice?.timeToSpinUp || 'Instant'}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-blue-200 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-xs">📄</div>
                                <span className="text-xs font-semibold text-slate-700">Incorporation Documents</span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">READY</span>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-blue-200 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-xs">🆔</div>
                                <span className="text-xs font-semibold text-slate-700">Tax ID Application</span>
                              </div>
                              <button className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg">Auto-File</button>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <button onClick={prev} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 text-sm">Back</button>
                            <button onClick={next} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100">Establish Registry</button>
                          </div>
                        </div>
                      )}

                      {step.component === 'FUNDING' && (
                        <div className="space-y-6">
                          <header className="flex justify-between items-center">
                            <h4 className="font-bold text-slate-800 text-sm">Venture Match Algorithm</h4>
                            <button 
                              onClick={handleFundingSearch}
                              className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100"
                              disabled={loading}
                            >
                              {loading ? 'Searching...' : 'Scan Market'}
                            </button>
                          </header>

                          <div className="max-h-60 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {vcMatches.length > 0 ? vcMatches.map((vc, idx) => (
                              <div key={idx} className="p-5 border border-slate-100 rounded-3xl hover:border-blue-300 transition-all bg-slate-50/30">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-bold text-slate-900">{vc.name}</h5>
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{vc.fitScore}%</span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">{vc.focus}</p>
                              </div>
                            )) : (
                              <div className="py-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                                <p className="text-xs text-slate-400 font-medium">Find capital partners for your mission.</p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button onClick={prev} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 text-sm">Back</button>
                            <button onClick={next} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm">Configure Infra</button>
                          </div>
                        </div>
                      )}

                      {step.component === 'INFRA' && (
                        <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                              <button onClick={handleInfraScan} className="p-5 bg-white border border-slate-200 rounded-3xl text-center hover:border-blue-500 transition-all">
                                <div className="text-2xl mb-2">💸</div>
                                <span className="text-xs font-bold block">Digital Banking</span>
                                <span className="text-[10px] text-slate-400">Mercury / Relay</span>
                              </button>
                              <button onClick={handleInfraScan} className="p-5 bg-white border border-slate-200 rounded-3xl text-center hover:border-blue-500 transition-all">
                                <div className="text-2xl mb-2">🌥️</div>
                                <span className="text-xs font-bold block">Cloud Stack</span>
                                <span className="text-[10px] text-slate-400">AWS / GCP / Vercel</span>
                              </button>
                           </div>

                           {infra.length > 0 && (
                             <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                               {infra.map((item, i) => (
                                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                   <div>
                                     <p className="text-xs font-bold">{item.tool}</p>
                                     <p className="text-[10px] text-slate-500">{item.benefit}</p>
                                   </div>
                                   <button className="text-[10px] font-bold text-blue-600">Provision</button>
                                 </div>
                               ))}
                             </div>
                           )}

                           <div className="flex gap-3 pt-4">
                            <button onClick={prev} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 text-sm">Back</button>
                            <button onClick={next} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm">Finalize Governance</button>
                          </div>
                        </div>
                      )}

                      {step.component === 'GOVERNANCE' && (
                        <div className="space-y-8">
                          <div className="bg-slate-900 rounded-[2rem] p-8 text-white text-center">
                            <span className="text-5xl block mb-6">🤝</span>
                            <h4 className="text-xl font-bold mb-2">Registry Finalization</h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                              Transmitting your corporation details to the global regulatory mesh and notifying registered stakeholders.
                            </p>
                            <div className="space-y-2 mb-8 text-left">
                               <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  Registry: Secretary of State Sync
                               </div>
                               <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  Compliance: KYC/AML Cleared
                               </div>
                               <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  Treasury: Cold Vault Linked
                               </div>
                            </div>
                            <button 
                              onClick={finishDeployment}
                              className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-xl transition-all hover:bg-slate-100 active:scale-95"
                            >
                              Execute Deployment
                            </button>
                          </div>
                          <button onClick={prev} className="w-full py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 text-sm">Back</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalStepper;
