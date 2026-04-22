export const agentIds = [
  "troubleshoot",
  "service",
  "card-query",
  "knowledge-qa",
  "data-query",
  "rule-config",
] as const;

export type AgentId = (typeof agentIds)[number];

export type AgentStatus = "featured" | "preview";
export type MessageRole = "assistant" | "user" | "system";
export type FlowStatus = "success" | "warning" | "info";
export type DecisionFieldType = "text" | "textarea" | "chips" | "select" | "radio" | "checklist";

export interface AppUser {
  name: string;
  organization: string;
  role: string;
}

export interface AgentMeta {
  id: AgentId;
  name: string;
  shortName: string;
  description: string;
  capability: string;
  category: string;
  functionIntro: string;
  domainIntro: string;
  tags: string[];
  route: string;
  status: AgentStatus;
  featured: boolean;
  accent: string;
}

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  stepId?: string;
  tone?: FlowStatus;
}

export interface DecisionOption {
  label: string;
  value: string;
  hint?: string;
}

export interface DecisionField {
  id: string;
  label: string;
  type: DecisionFieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  options?: DecisionOption[];
}

export interface DecisionCard {
  id: string;
  title: string;
  description: string;
  submitLabel: string;
  fields: DecisionField[];
}

export interface AgentFlowStep {
  id: string;
  title: string;
  description: string;
  assistantPrompt: string;
  decisionCard?: DecisionCard;
}

export interface FlowResult {
  title: string;
  summary: string;
  nextActions: string[];
  ctaLabel: string;
  ctaHint: string;
  status: FlowStatus;
  reference?: string;
}

export function isAgentId(value: string): value is AgentId {
  return agentIds.includes(value as AgentId);
}
