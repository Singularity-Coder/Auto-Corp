
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
