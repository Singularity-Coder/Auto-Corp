
export enum EntityStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SLEEPING = 'SLEEPING',
  BANKRUPT = 'BANKRUPT'
}

export interface BusinessEntity {
  id: string;
  name: string;
  status: EntityStatus;
  jurisdiction: string;
  industry: string;
  objective?: string;
  fundingGoal: number;
  currentCapital: number;
  stepsCompleted: number;
  incorporationDate?: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  component: 'IDEATION' | 'FORMALIZATION' | 'FUNDING' | 'INFRA' | 'GOVERNANCE';
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  category: 'COMMUNICATION' | 'PRODUCTION' | 'FINANCE' | 'GROWTH' | 'DEV';
  status: 'CONNECTED' | 'DISCONNECTED' | 'PENDING';
  lastSync?: string;
  capabilities: string[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: 'EXECUTIVE' | 'ENGINEERING' | 'GROWTH' | 'OPERATIONS';
  status: 'ACTIVE' | 'IDLE' | 'SCAFFOLDED' | 'DEPRECATED';
  modelTags: string[];
  chiefId?: string;
  responsibilities: string[];
  customInstructions?: string;
  assignedEntityId?: string;
  activeIntegrations?: string[];
  tools?: string[];
}

export interface SessionEvent {
  timestamp: string;
  agentId: string;
  type: 'INFO' | 'ACTION' | 'ERROR' | 'HEARTBEAT';
  message: string;
  tokenCount?: number;
  cost?: number;
}

export interface ModelConfig {
  id: string;
  provider: string;
  role: string;
  status: 'ONLINE' | 'OFFLINE';
  costPer1k: number;
  fallbackId?: string;
}

export interface Standup {
  id: string;
  date: string;
  transcript: { speaker: string; text: string; time: string }[];
  tasks: { id: string; text: string; status: 'DONE' | 'TODO'; owner: string }[];
  artifacts: { name: string; type: string; url: string }[];
}

export interface OvernightLog {
  id: string;
  timestamp: string;
  agentId: string;
  event: string;
  outcome: string;
}

// Fix: Exporting missing types used for Gemini API structured outputs
export interface VCRecommendation {
  name: string;
  focus: string;
  fitScore: number;
  reason: string;
}

export interface EntityAdvice {
  recommendedEntity: string;
  keyRegulation: string;
  timeToSpinUp: string;
}
