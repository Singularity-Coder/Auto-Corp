
import React, { useState } from 'react';
import Layout from './components/Layout';
import VerticalStepper from './components/VerticalStepper';
import FleetDashboard from './components/FleetDashboard';
import EntityDetail from './components/EntityDetail';
import ChatInterface from './components/ChatInterface';
import AgentMarketplace from './components/AgentMarketplace';
import IntegrationsGallery from './components/IntegrationsGallery';
import { BusinessEntity, EntityStatus, Agent } from './types';
import { AGENTS_SEED } from './constants';

const INITIAL_DUMMY_DATA: BusinessEntity[] = [
  {
    id: 'node-101',
    name: 'Spectral Dynamics',
    status: EntityStatus.ACTIVE,
    jurisdiction: 'Delaware, USA',
    industry: 'Generative AI Infrastructure',
    objective: 'Build the worlds most efficient neural routing layer.',
    fundingGoal: 2000000,
    currentCapital: 125000,
    stepsCompleted: 5,
    incorporationDate: '2025-01-12T10:00:00.000Z'
  },
  {
    id: 'node-204',
    name: 'EcoLogix Global',
    status: EntityStatus.SLEEPING,
    jurisdiction: 'Singapore',
    industry: 'Supply Chain Optimization',
    objective: 'Reduce global logistics carbon footprint by 40%.',
    fundingGoal: 500000,
    currentCapital: 82000,
    stepsCompleted: 5,
    incorporationDate: '2024-11-05T14:30:00.000Z'
  },
  {
    id: 'node-311',
    name: 'BioNexus Labs',
    status: EntityStatus.ACTIVE,
    jurisdiction: 'London, UK',
    industry: 'Synthetic Biology',
    objective: 'Enable rapid DNA synthesis for climate-resilient crops.',
    fundingGoal: 5000000,
    currentCapital: 42000,
    stepsCompleted: 5,
    incorporationDate: '2025-02-01T09:15:00.000Z'
  }
];

const INITIAL_ENTITY = (id: string): BusinessEntity => ({
  id,
  name: '',
  status: EntityStatus.DRAFT,
  jurisdiction: 'Delaware, USA',
  industry: '',
  objective: '',
  fundingGoal: 0,
  currentCapital: 0,
  stepsCompleted: 0
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fleet, setFleet] = useState<BusinessEntity[]>(INITIAL_DUMMY_DATA);
  const [globalAgents, setGlobalAgents] = useState<Agent[]>(
    AGENTS_SEED.map(a => ({ ...a, assignedEntityId: 'node-101' }))
  );
  const [view, setView] = useState<'LIST' | 'CREATE' | 'DETAIL'>('LIST');
  const [activeEntity, setActiveEntity] = useState<BusinessEntity>(INITIAL_ENTITY('new-node'));
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleEntityAction = (id: string, action: 'SLEEP' | 'KILL' | 'ACTIVATE') => {
    setFleet(prev => prev.map(e => {
      if (e.id === id) {
        let newStatus = e.status;
        if (action === 'SLEEP') newStatus = EntityStatus.SLEEPING;
        if (action === 'KILL') newStatus = EntityStatus.BANKRUPT;
        if (action === 'ACTIVATE') newStatus = EntityStatus.ACTIVE;
        return { ...e, status: newStatus };
      }
      return e;
    }));
  };

  const handleHireAgent = (agent: Agent) => {
    setGlobalAgents(prev => [...prev, agent]);
  };

  const deployToFleet = () => {
    setFleet(prev => {
      const exists = prev.find(e => e.id === activeEntity.id);
      if (exists) return prev.map(e => e.id === activeEntity.id ? activeEntity : e);
      return [...prev, { ...activeEntity, status: EntityStatus.ACTIVE }];
    });
    setView('LIST');
  };

  const startCreation = () => {
    const newId = `node-${Math.floor(Math.random() * 900) + 100}`;
    setActiveEntity(INITIAL_ENTITY(newId));
    setCurrentStep(1);
    setView('CREATE');
    setIsChatOpen(true);
  };

  const openDetail = (id: string) => {
    setSelectedEntityId(id);
    setView('DETAIL');
  };

  const updateEntityInFleet = (updated: BusinessEntity) => {
    setFleet(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const getActiveContext = () => {
    if (view === 'DETAIL' && selectedEntityId) return fleet.find(e => e.id === selectedEntityId) || null;
    if (view === 'CREATE') return activeEntity;
    return null;
  };

  const context = getActiveContext();

  const renderContent = () => {
    if (view === 'CREATE') {
      return (
        <VerticalStepper 
          entity={activeEntity} 
          setEntity={setActiveEntity} 
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onComplete={deployToFleet}
          onBack={() => setView('LIST')}
        />
      );
    }

    if (view === 'DETAIL' && selectedEntityId) {
      const entity = fleet.find(e => e.id === selectedEntityId);
      if (entity) {
        return (
          <EntityDetail 
            entity={entity} 
            agents={globalAgents}
            onAction={handleEntityAction}
            onUpdate={updateEntityInFleet}
            onBack={() => setView('LIST')}
          />
        );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <FleetDashboard 
            fleet={fleet} 
            onViewDetail={openDetail} 
            onDeploy={startCreation}
          />
        );
      case 'marketplace':
        return (
          <AgentMarketplace 
            fleet={fleet}
            onHire={handleHireAgent}
          />
        );
      case 'bridge':
        return (
          <IntegrationsGallery />
        );
      case 'settings':
        return (
          <div className="p-12 max-w-4xl mx-auto animate-in fade-in duration-500">
             <h2 className="text-3xl font-black mb-8">Node Configuration</h2>
             <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 space-y-10 shadow-sm">
                <section>
                   <div className="flex items-center gap-3 mb-4">
                     <span className="text-2xl">🔑</span>
                     <h4 className="font-bold text-slate-900">Automation Credentials</h4>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Government Gateway API</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">CONNECTED</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Venture Mesh protocol</span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">ACTIVE</span>
                      </div>
                   </div>
                </section>
             </div>
          </div>
        );
      default:
        return <FleetDashboard fleet={fleet} onViewDetail={openDetail} onDeploy={startCreation} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(t) => { setActiveTab(t); setView('LIST'); }} 
      entityName={context?.name || ''} 
      entityStatus={context?.status || EntityStatus.DRAFT}
      isChatOpen={isChatOpen}
      onToggleChat={() => setIsChatOpen(!isChatOpen)}
    >
      {renderContent()}
      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        activeEntity={context}
        currentStep={view === 'CREATE' ? currentStep : null}
        onUpdateStep={(step) => setCurrentStep(step)}
        onUpdateEntity={(updates) => {
          if (view !== 'CREATE') {
            const newId = `node-${Math.floor(Math.random() * 900) + 100}`;
            setActiveEntity({ ...INITIAL_ENTITY(newId), ...updates });
            setCurrentStep(1);
            setView('CREATE');
          } else {
            setActiveEntity(prev => ({ ...prev, ...updates }));
          }
        } }
      />
    </Layout>
  );
};

export default App;
