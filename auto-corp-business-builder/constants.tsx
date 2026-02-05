
import { Step } from './types';

export const CORP_STEPS: Step[] = [
  {
    id: 1,
    title: "Ideation & Jurisdiction",
    description: "Define your core identity and legal home base.",
    icon: "🌍",
    component: "IDEATION"
  },
  {
    id: 2,
    title: "Entity Formalization",
    description: "Automatic document generation and government filing.",
    icon: "⚖️",
    component: "FORMALIZATION"
  },
  {
    id: 3,
    title: "Capital & Funding",
    description: "Venture match-making and debt infrastructure.",
    icon: "💰",
    component: "FUNDING"
  },
  {
    id: 4,
    title: "Banking & Infrastructure",
    description: "Deploy financial stacks and operational accounts.",
    icon: "🏦",
    component: "INFRA"
  },
  {
    id: 5,
    title: "Stakeholder Governance",
    description: "CAP table management and automated reporting.",
    icon: "🤝",
    component: "GOVERNANCE"
  }
];

export const SYSTEM_PROMPT = `
You are the Auto-Corp Orchestrator, an expert in global business formation and venture capital.
Your purpose is to provide highly specific, actionable data for business procedures.
Avoid generic advice. Focus on speed, efficiency, and automated compliance.
`;
