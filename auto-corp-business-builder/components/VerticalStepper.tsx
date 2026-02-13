
import React, { useState, useEffect } from 'react';
import { CORP_STEPS } from '../constants';
import { BusinessEntity, EntityStatus, VCRecommendation, EntityAdvice } from '../types';
import { getVCMatch, getEntityAdvice, getInfraAdvice } from '../geminiService';
import { 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  Globe, 
  Scale, 
  DollarSign, 
  Building2, 
  Handshake,
  Search,
  Sparkles,
  Zap,
  LayoutGrid,
  FileText
} from 'lucide-react';

interface Props {
  entity: BusinessEntity;
  setEntity: (e: BusinessEntity) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
  onBack: () => void;
}

const stepIcons: Record<string, React.ReactNode> = {
  'IDEATION': <Globe size={20} />,
  'FORMALIZATION': <Scale size={20} />,
  'FUNDING': <DollarSign size={20} />,
  'INFRA': <Building2 size={20} />,
  'GOVERNANCE': <Handshake size={20} />,
};

const VerticalStepper: React.FC<Props> = ({ entity, setEntity, currentStep, setCurrentStep, onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [vcMatches, setVcMatches] = useState<VCRecommendation[]>([]);
  const [advice, setAdvice] = useState<EntityAdvice | null>(null);
  const [infra, setInfra] = useState<any[]>([]);

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
        >
          <ArrowLeft size={20} />
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
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-300 cursor-pointer ${
                    isActive ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-110 ring-4 ring-slate-50' : 
                    isCompleted ? 'bg-blue-100 text-blue-600' : 'bg-white border-2 border-slate-100 text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : stepIcons[step.component]}
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
                    <div className="mt-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm p-10 animate-in fade-in slide-in-from-top-6 duration-500 ease-out overflow-hidden">
                      {step.component === 'IDEATION' && (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Corp Name</label>
                              <input 
                                value={entity.name} 
                                onChange={e => setEntity({...entity, name: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="e.g. Nexus Forge"
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jurisdiction</label>
                              <select 
                                value={entity.jurisdiction}
                                onChange={e => setEntity({...entity, jurisdiction: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none cursor-pointer appearance-none"
                              >
                                <option>Delaware, USA</option>
                                <option>Wyoming, USA</option>
                                <option>London, UK</option>
                                <option>Singapore</option>
                                <option>Estonia (Digital)</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Sector</label>
                            <input 
                              value={entity.industry}
                              onChange={e => setEntity({...entity, industry: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none"
                              placeholder="e.g. AI Infrastructure"
                            />
                          </div>
                          <button 
                            disabled={!entity.name || !entity.industry || loading}
                            onClick={handleIdeationSubmit}
                            className="w-full py-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl font-bold transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                          >
                            {loading ? <Sparkles size={18} className="animate-pulse" /> : <ChevronRight size={18} />}
                            {loading ? 'Analyzing Regulations...' : 'Initialize Identity'}
                          </button>
                        </div>
                      )}

                      {step.component === 'FORMALIZATION' && (
                        <div className="space-y-8">
                          <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><Scale size={28} /></div>
                            <div>
                              <h4 className="font-bold text-blue-900 text-base">Target Entity: {advice?.recommendedEntity || 'LLC'}</h4>
                              <p className="text-xs text-blue-600">Time to Operational: {advice?.timeToSpinUp || 'Instant'}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-blue-200 transition-colors">
                              <div className="flex items-center gap-4">
                                {/* Fixed: Added FileText to imports */}
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><FileText size={18} /></div>
                                <span className="text-sm font-bold text-slate-700">Incorporation Documents</span>
                              </div>
                              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg uppercase">Generated</span>
                            </div>
                            <div className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-blue-200 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Zap size={18} /></div>
                                <span className="text-sm font-bold text-slate-700">Tax ID Auto-Filing</span>
                              </div>
                              <button className="text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-xl uppercase">Execute</button>
                            </div>
                          </div>

                          <div className="flex gap-4 pt-6">
                            <button onClick={prev} className="flex-1 py-5 bg-slate-50 rounded-2xl font-bold text-slate-500 text-sm">Back</button>
                            <button onClick={next} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100">Establish Registry</button>
                          </div>
                        </div>
                      )}

                      {step.component === 'FUNDING' && (
                        <div className="space-y-8">
                          <header className="flex justify-between items-center px-2">
                            <h4 className="font-bold text-slate-800 text-base">Venture Match Algorithm</h4>
                            <button 
                              onClick={handleFundingSearch}
                              className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 uppercase"
                              disabled={loading}
                            >
                              <Search size={14} className="inline mr-2" />
                              {loading ? 'Searching...' : 'Scan Market'}
                            </button>
                          </header>

                          <div className="max-h-72 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {vcMatches.length > 0 ? vcMatches.map((vc, idx) => (
                              <div key={idx} className="p-6 border border-slate-100 rounded-[2rem] hover:border-blue-300 transition-all bg-slate-50/50">
                                <div className="flex justify-between items-start mb-3">
                                  <h5 className="font-bold text-slate-900">{vc.name}</h5>
                                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{vc.fitScore}% FIT</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{vc.focus}</p>
                              </div>
                            )) : (
                              <div className="py-16 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                <p className="text-sm text-slate-400 font-bold">Find capital partners for your mission.</p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-4 pt-4">
                            <button onClick={prev} className="flex-1 py-5 bg-slate-50 rounded-2xl font-bold text-slate-500 text-sm">Back</button>
                            <button onClick={next} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold text-sm">Configure Infra</button>
                          </div>
                        </div>
                      )}

                      {step.component === 'INFRA' && (
                        <div className="space-y-8">
                           <div className="grid grid-cols-2 gap-6">
                              <button onClick={handleInfraScan} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-center hover:border-blue-500 transition-all group shadow-sm">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                  <Building2 size={24} />
                                </div>
                                <span className="text-sm font-black block text-slate-900 uppercase">Digital Banking</span>
                                <span className="text-[10px] text-slate-400 font-bold mt-1 block">Mercury / Relay</span>
                              </button>
                              <button onClick={handleInfraScan} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-center hover:border-blue-500 transition-all group shadow-sm">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                  <LayoutGrid size={24} />
                                </div>
                                <span className="text-sm font-black block text-slate-900 uppercase">Cloud Stack</span>
                                <span className="text-[10px] text-slate-400 font-bold mt-1 block">AWS / GCP / Vercel</span>
                              </button>
                           </div>

                           {infra.length > 0 && (
                             <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                               {infra.map((item, i) => (
                                 <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                   <div>
                                     <p className="text-sm font-black text-slate-900 uppercase">{item.tool}</p>
                                     <p className="text-[10px] text-slate-500 font-bold">{item.benefit}</p>
                                   </div>
                                   <button className="text-[10px] font-black text-blue-600 uppercase">Provision</button>
                                 </div>
                               ))}
                             </div>
                           )}

                           <div className="flex gap-4 pt-6">
                            <button onClick={prev} className="flex-1 py-5 bg-slate-50 rounded-2xl font-bold text-slate-500 text-sm">Back</button>
                            <button onClick={next} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold text-sm">Finalize Governance</button>
                          </div>
                        </div>
                      )}

                      {step.component === 'GOVERNANCE' && (
                        <div className="space-y-8">
                          <div className="bg-slate-900 rounded-[3rem] p-12 text-white text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5"><Handshake size={120} /></div>
                            <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                              <Handshake size={32} />
                            </div>
                            <h4 className="text-2xl font-black mb-3 uppercase tracking-tight">Registry Finalization</h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-8 max-w-sm mx-auto">
                              Transmitting your corporation details to the global mesh. Once executed, legal personality is established.
                            </p>
                            <div className="space-y-3 mb-10 text-left max-w-xs mx-auto">
                               <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  Registry: Ready
                               </div>
                               <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  Compliance: Cleared
                               </div>
                            </div>
                            <button 
                              onClick={finishDeployment}
                              className="w-full py-5 bg-white text-slate-900 rounded-2xl font-bold shadow-xl transition-all hover:bg-slate-100 active:scale-95 uppercase text-xs tracking-widest"
                            >
                              Execute Deployment
                            </button>
                          </div>
                          <button onClick={prev} className="w-full py-5 bg-slate-50 rounded-2xl font-bold text-slate-500 text-sm">Back</button>
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
