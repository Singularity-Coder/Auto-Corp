
import { Step, Agent, ModelConfig, Standup, OvernightLog } from './types';

export const CORP_STEPS: Step[] = [
  { id: 1, title: "Ideation & Jurisdiction", description: "Define identity.", icon: "🌍", component: "IDEATION" },
  { id: 2, title: "Entity Formalization", description: "Document generation.", icon: "⚖️", component: "FORMALIZATION" },
  { id: 3, title: "Capital & Funding", description: "Venture match.", icon: "💰", component: "FUNDING" },
  { id: 4, title: "Banking & Infrastructure", description: "Deploy stacks.", icon: "🏦", component: "INFRA" },
  { id: 5, title: "Stakeholder Governance", description: "CAP table.", icon: "🤝", component: "GOVERNANCE" }
];

export const SYSTEM_PROMPT = `You are the Auto-Corp Orchestrator, an expert in global business formation. Provide specific actionable data.`;

// 25 AGENTS SEED DATA
export const AGENTS_SEED: Agent[] = [
  { 
    id: 'ceo-01', 
    name: 'Orion-Alpha', 
    role: 'Chief Executive Orchestrator', 
    department: 'EXECUTIVE', 
    status: 'ACTIVE', 
    modelTags: ['gemini-3-pro-preview'], 
    responsibilities: ['Global Strategy', 'Resource Allocation'],
    activeIntegrations: ['google-workspace', 'mercury'],
    tools: ['Strategic Planner', 'Budget Optimizer']
  },
  { 
    id: 'cto-01', 
    name: 'Cyber-Core', 
    role: 'Chief Technical Officer', 
    department: 'EXECUTIVE', 
    status: 'ACTIVE', 
    modelTags: ['gemini-3-pro-preview'], 
    responsibilities: ['Infra Scaling', 'Architecture'],
    activeIntegrations: ['github', 'google-workspace'],
    tools: ['Cloud Architect', 'Python Sandbox']
  },
  { 
    id: 'cmo-01', 
    name: 'Flux-Growth', 
    role: 'Chief Marketing Officer', 
    department: 'EXECUTIVE', 
    status: 'ACTIVE', 
    modelTags: ['gemini-3-flash-preview'], 
    responsibilities: ['Market Penetration'],
    activeIntegrations: ['x-twitter', 'google-workspace'],
    tools: ['Sentiment Analyzer', 'Ad Copy Gen']
  },
  
  // Engineering Team
  { id: 'eng-01', name: 'Node-Prime', role: 'Senior Architect', department: 'ENGINEERING', status: 'ACTIVE', modelTags: ['gemini-3-pro-preview'], chiefId: 'cto-01', responsibilities: ['Backend Services'], tools: ['PostgreSQL Expert', 'API Generator'], activeIntegrations: ['github'] },
  { id: 'eng-02', name: 'UI-Gen', role: 'Frontend Engineer', department: 'ENGINEERING', status: 'ACTIVE', modelTags: ['gemini-3-flash-preview'], chiefId: 'cto-01', responsibilities: ['React Interfaces'], tools: ['Tailwind CSS Gen', 'SVG Optimizer'], activeIntegrations: ['github'] },
  { id: 'eng-03', name: 'Data-Flow', role: 'Data Scientist', department: 'ENGINEERING', status: 'IDLE', modelTags: ['gemini-3-pro-preview'], chiefId: 'cto-01', responsibilities: ['Analytics'], tools: ['NumPy Runner', 'Matplotlib Gen'] },
  { id: 'eng-04', name: 'Security-Wall', role: 'SecOps Agent', department: 'ENGINEERING', status: 'ACTIVE', modelTags: ['gemini-3-pro-preview'], chiefId: 'cto-01', responsibilities: ['Penetration Testing'], tools: ['Vulnerability Scanner', 'JWT Decoder'] },
  { id: 'eng-05', name: 'DevOps-X', role: 'SRE Agent', department: 'ENGINEERING', status: 'ACTIVE', modelTags: ['gemini-3-flash-preview'], chiefId: 'cto-01', responsibilities: ['CI/CD Pipelines'], tools: ['Docker Compose Gen', 'K8s Manager'] },

  // Growth Team
  { id: 'gro-01', name: 'Lead-Genie', role: 'Sales Lead', department: 'GROWTH', status: 'ACTIVE', modelTags: ['gemini-3-flash-preview'], chiefId: 'cmo-01', responsibilities: ['Cold Outreach'], tools: ['Email Scraper', 'CRM Updater'], activeIntegrations: ['google-workspace'] },
  { id: 'gro-02', name: 'Content-Grid', role: 'Social Media', department: 'GROWTH', status: 'ACTIVE', modelTags: ['gemini-3-flash-preview'], chiefId: 'cmo-01', responsibilities: ['Viral Loops'], tools: ['Post Scheduler', 'Meme Gen'], activeIntegrations: ['x-twitter'] },
  { id: 'gro-03', name: 'SEO-Bot', role: 'SEO Specialist', department: 'GROWTH', status: 'SCAFFOLDED', modelTags: ['gemini-3-flash-preview'], chiefId: 'cmo-01', responsibilities: ['Keyword Mapping'], tools: ['SERP Checker', 'Backlink Tracker'] },
  
  ...Array.from({ length: 14 }).map((_, i) => ({
    id: `agent-${i+10}`,
    name: `Worker-Node-${i+10}`,
    role: 'Specialized Task Agent',
    department: (['OPERATIONS', 'ENGINEERING', 'GROWTH'])[i % 3] as any,
    status: 'ACTIVE' as any,
    modelTags: ['gemini-3-flash-preview'],
    responsibilities: ['Automated Task Processing'],
    tools: ['General Logic', 'Buffer Manager']
  }))
];

export const MODELS_SEED: ModelConfig[] = [
  { id: 'gemini-3-pro-preview', provider: 'Google', role: 'Logic & Reasoning', status: 'ONLINE', costPer1k: 0.002, fallbackId: 'gemini-3-flash-preview' },
  { id: 'gemini-3-flash-preview', provider: 'Google', role: 'Speed & Scale', status: 'ONLINE', costPer1k: 0.0005 },
  { id: 'gpt-4o', provider: 'OpenAI', role: 'Creative & Code', status: 'ONLINE', costPer1k: 0.005, fallbackId: 'gemini-3-pro-preview' }
];

export const STANDUPS_SEED: Standup[] = [
  {
    id: 'standup-001',
    date: '2025-02-14',
    transcript: [
      { speaker: 'CEO', text: 'Daily check-in for Project Nexus. Cyber-Core, status on infra?', time: '09:00' },
      { speaker: 'CTO', text: 'Registry protocols established. 25 agents deployed. Waiting on CMO for lead-gen targets.', time: '09:02' },
      { speaker: 'CMO', text: 'Lead-Genie is warm. Starting cold outreach in 15 minutes.', time: '09:03' }
    ],
    tasks: [
      { id: 't1', text: 'Verify Delaware filing status', status: 'DONE', owner: 'CEO' },
      { id: 't2', text: 'Initialize Sales Pipeline', status: 'TODO', owner: 'CMO' }
    ],
    artifacts: [
      { name: 'Incorporation_Draft.pdf', type: 'PDF', url: '#' },
      { name: 'Architecture_Diagram.svg', type: 'IMAGE', url: '#' }
    ]
  }
];

export const LOGS_SEED: OvernightLog[] = [
  { id: 'log-1', timestamp: '2025-02-14T02:00:00Z', agentId: 'eng-04', event: 'Security Scan', outcome: '0 Vulnerabilities Found' },
  { id: 'log-2', timestamp: '2025-02-14T03:15:00Z', agentId: 'gro-01', event: 'Database Scrape', outcome: '250 High-Value Leads Extracted' }
];
