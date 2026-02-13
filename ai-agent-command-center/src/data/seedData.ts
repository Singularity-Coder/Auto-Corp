// ── Seed Data for AI Agent Command Center ──

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  chief?: string;
  status: 'active' | 'idle' | 'scaffolded' | 'deprecated';
  model: string;
  responsibilities: string[];
  children?: string[];
  tools: string[];
}

export interface ModelInfo {
  id: string;
  provider: string;
  model: string;
  role: string;
  status: 'online' | 'degraded' | 'offline';
  fallbackOrder: number;
  costPer1kInput: number;
  costPer1kOutput: number;
  maxTokens: number;
}

export interface SessionEvent {
  ts: string;
  type: 'start' | 'heartbeat' | 'tool_call' | 'response' | 'error' | 'complete';
  agentId: string;
  sessionId: string;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  cost?: number;
  detail?: string;
  trigger?: string;
}

export interface OvernightEntry {
  ts: string;
  agentId: string;
  type: 'task_complete' | 'error' | 'deploy' | 'report' | 'alert' | 'cron';
  summary: string;
  status: 'success' | 'warning' | 'error';
}

export interface StandupTurn {
  ts: string;
  speaker: string;
  role: string;
  text: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

export interface Artifact {
  id: string;
  title: string;
  type: 'doc' | 'report' | 'code' | 'config';
  path: string;
  createdBy: string;
}

export interface Standup {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  transcript: StandupTurn[];
  tasks: Task[];
  artifacts: Artifact[];
}

// ── 25 Agents across departments ──
export const agents: Agent[] = [
  // Orchestrator
  { id: 'orch-001', name: 'NEXUS', role: 'Chief Orchestrator', department: 'Command', status: 'active', model: 'gpt-4o', chief: undefined, responsibilities: ['Coordinate all agent activities', 'Manage inter-department communication', 'Execute standup protocols', 'Monitor fleet health'], tools: ['agent_dispatch', 'broadcast', 'schedule', 'health_check'], children: ['chief-eng', 'chief-ops', 'chief-data', 'chief-sec'] },
  // Chiefs
  { id: 'chief-eng', name: 'FORGE', role: 'Chief of Engineering', department: 'Engineering', status: 'active', model: 'gpt-4o', chief: 'orch-001', responsibilities: ['Oversee code generation agents', 'Review architecture decisions', 'Manage deployment pipeline'], tools: ['code_review', 'deploy', 'git_ops'], children: ['eng-001', 'eng-002', 'eng-003', 'eng-004', 'eng-005'] },
  { id: 'chief-ops', name: 'SENTINEL', role: 'Chief of Operations', department: 'Operations', status: 'active', model: 'claude-3.5-sonnet', chief: 'orch-001', responsibilities: ['Monitor infrastructure', 'Manage cron schedules', 'Incident response coordination'], tools: ['monitor', 'alert', 'cron_manage', 'incident_report'], children: ['ops-001', 'ops-002', 'ops-003', 'ops-004'] },
  { id: 'chief-data', name: 'ORACLE', role: 'Chief of Data & Analytics', department: 'Data', status: 'active', model: 'gpt-4o', chief: 'orch-001', responsibilities: ['Data pipeline orchestration', 'Analytics report generation', 'Model performance tracking'], tools: ['query', 'etl', 'report_gen', 'model_eval'], children: ['data-001', 'data-002', 'data-003', 'data-004'] },
  { id: 'chief-sec', name: 'AEGIS', role: 'Chief of Security', department: 'Security', status: 'active', model: 'claude-3.5-sonnet', chief: 'orch-001', responsibilities: ['Security audit coordination', 'Access control management', 'Threat analysis'], tools: ['scan', 'audit', 'acl_manage', 'threat_detect'], children: ['sec-001', 'sec-002', 'sec-003'] },
  // Engineering
  { id: 'eng-001', name: 'ARCHITECT', role: 'System Architect', department: 'Engineering', status: 'active', model: 'gpt-4o', chief: 'chief-eng', responsibilities: ['Design system architecture', 'Create technical specifications'], tools: ['code_gen', 'diagram', 'spec_write'], children: [] },
  { id: 'eng-002', name: 'CODER', role: 'Code Generator', department: 'Engineering', status: 'active', model: 'claude-3.5-sonnet', chief: 'chief-eng', responsibilities: ['Generate production code', 'Implement features from specs'], tools: ['code_gen', 'test_gen', 'lint'], children: [] },
  { id: 'eng-003', name: 'TESTER', role: 'QA Engineer', department: 'Engineering', status: 'active', model: 'gpt-4o-mini', chief: 'chief-eng', responsibilities: ['Write and run test suites', 'Report bugs and regressions'], tools: ['test_run', 'bug_report', 'coverage'], children: [] },
  { id: 'eng-004', name: 'DEPLOYER', role: 'DevOps Agent', department: 'Engineering', status: 'idle', model: 'gpt-4o-mini', chief: 'chief-eng', responsibilities: ['Manage CI/CD pipelines', 'Handle deployments'], tools: ['deploy', 'docker', 'ci_manage'], children: [] },
  { id: 'eng-005', name: 'REFACTOR', role: 'Code Optimizer', department: 'Engineering', status: 'scaffolded', model: 'claude-3.5-sonnet', chief: 'chief-eng', responsibilities: ['Optimize existing code', 'Reduce technical debt'], tools: ['code_gen', 'analyze', 'refactor'], children: [] },
  // Operations
  { id: 'ops-001', name: 'WATCHDOG', role: 'System Monitor', department: 'Operations', status: 'active', model: 'gpt-4o-mini', chief: 'chief-ops', responsibilities: ['Monitor system metrics', 'Alert on anomalies'], tools: ['monitor', 'alert'], children: [] },
  { id: 'ops-002', name: 'SCHEDULER', role: 'Cron Manager', department: 'Operations', status: 'active', model: 'gpt-4o-mini', chief: 'chief-ops', responsibilities: ['Manage scheduled tasks', 'Ensure cron execution'], tools: ['cron_manage', 'schedule'], children: [] },
  { id: 'ops-003', name: 'HEALER', role: 'Auto-Remediation', department: 'Operations', status: 'idle', model: 'claude-3.5-sonnet', chief: 'chief-ops', responsibilities: ['Auto-fix common issues', 'Restart failed services'], tools: ['restart', 'patch', 'rollback'], children: [] },
  { id: 'ops-004', name: 'LOGKEEPER', role: 'Log Analyst', department: 'Operations', status: 'active', model: 'gpt-4o-mini', chief: 'chief-ops', responsibilities: ['Analyze log patterns', 'Surface actionable insights'], tools: ['log_query', 'summarize'], children: [] },
  // Data
  { id: 'data-001', name: 'HARVESTER', role: 'Data Collector', department: 'Data', status: 'active', model: 'gpt-4o-mini', chief: 'chief-data', responsibilities: ['Collect data from APIs', 'ETL pipeline execution'], tools: ['api_call', 'etl', 'store'], children: [] },
  { id: 'data-002', name: 'ANALYST', role: 'Data Analyst', department: 'Data', status: 'active', model: 'gpt-4o', chief: 'chief-data', responsibilities: ['Analyze datasets', 'Generate insights reports'], tools: ['query', 'visualize', 'report_gen'], children: [] },
  { id: 'data-003', name: 'MODELER', role: 'ML Engineer', department: 'Data', status: 'scaffolded', model: 'gpt-4o', chief: 'chief-data', responsibilities: ['Train and evaluate models', 'Feature engineering'], tools: ['train', 'evaluate', 'feature_eng'], children: [] },
  { id: 'data-004', name: 'SCRIBE', role: 'Report Writer', department: 'Data', status: 'active', model: 'claude-3.5-sonnet', chief: 'chief-data', responsibilities: ['Generate formatted reports', 'Create documentation'], tools: ['report_gen', 'doc_write', 'format'], children: [] },
  // Security
  { id: 'sec-001', name: 'SCANNER', role: 'Vulnerability Scanner', department: 'Security', status: 'active', model: 'gpt-4o-mini', chief: 'chief-sec', responsibilities: ['Scan for vulnerabilities', 'CVE monitoring'], tools: ['scan', 'cve_check'], children: [] },
  { id: 'sec-002', name: 'GUARDIAN', role: 'Access Controller', department: 'Security', status: 'active', model: 'gpt-4o-mini', chief: 'chief-sec', responsibilities: ['Manage access policies', 'Review permissions'], tools: ['acl_manage', 'audit'], children: [] },
  { id: 'sec-003', name: 'HUNTER', role: 'Threat Hunter', department: 'Security', status: 'deprecated', model: 'gpt-4o', chief: 'chief-sec', responsibilities: ['Proactive threat hunting', 'IOC analysis'], tools: ['threat_detect', 'ioc_analyze'], children: [] },
  // Specialist agents
  { id: 'spec-001', name: 'WRITER', role: 'Content Creator', department: 'Content', status: 'active', model: 'claude-3.5-sonnet', chief: 'orch-001', responsibilities: ['Create documentation', 'Write blog posts', 'Generate training materials'], tools: ['doc_write', 'format', 'publish'], children: [] },
  { id: 'spec-002', name: 'TRANSLATOR', role: 'I18n Agent', department: 'Content', status: 'idle', model: 'gpt-4o-mini', chief: 'orch-001', responsibilities: ['Translate content', 'Localization management'], tools: ['translate', 'locale_manage'], children: [] },
  { id: 'spec-003', name: 'AUDITOR', role: 'Compliance Agent', department: 'Compliance', status: 'active', model: 'gpt-4o', chief: 'orch-001', responsibilities: ['Audit compliance', 'Generate compliance reports'], tools: ['audit', 'report_gen', 'policy_check'], children: [] },
  { id: 'spec-004', name: 'LIAISON', role: 'Integration Agent', department: 'Integration', status: 'active', model: 'gpt-4o-mini', chief: 'orch-001', responsibilities: ['Manage external integrations', 'API gateway management'], tools: ['api_call', 'webhook', 'transform'], children: [] },
];

// ── Model Fleet ──
export const modelFleet: ModelInfo[] = [
  { id: 'gpt-4o', provider: 'OpenAI', model: 'GPT-4o', role: 'Primary Reasoning', status: 'online', fallbackOrder: 1, costPer1kInput: 0.005, costPer1kOutput: 0.015, maxTokens: 128000 },
  { id: 'claude-3.5-sonnet', provider: 'Anthropic', model: 'Claude 3.5 Sonnet', role: 'Complex Analysis', status: 'online', fallbackOrder: 2, costPer1kInput: 0.003, costPer1kOutput: 0.015, maxTokens: 200000 },
  { id: 'gpt-4o-mini', provider: 'OpenAI', model: 'GPT-4o Mini', role: 'Fast Operations', status: 'online', fallbackOrder: 3, costPer1kInput: 0.00015, costPer1kOutput: 0.0006, maxTokens: 128000 },
  { id: 'llama-3.1-70b', provider: 'Meta (Local)', model: 'Llama 3.1 70B', role: 'Local Fallback', status: 'degraded', fallbackOrder: 4, costPer1kInput: 0.0, costPer1kOutput: 0.0, maxTokens: 131072 },
  { id: 'mistral-large', provider: 'Mistral', model: 'Mistral Large', role: 'EU Compliance', status: 'online', fallbackOrder: 5, costPer1kInput: 0.002, costPer1kOutput: 0.006, maxTokens: 128000 },
];

// ── Session Events ──
const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000).toISOString();
const m = (minsAgo: number) => new Date(now.getTime() - minsAgo * 60000).toISOString();

export const sessionEvents: SessionEvent[] = [
  { ts: m(45), type: 'start', agentId: 'eng-001', sessionId: 'sess-001', model: 'gpt-4o', trigger: 'manual', detail: 'Architecture review for auth module' },
  { ts: m(42), type: 'tool_call', agentId: 'eng-001', sessionId: 'sess-001', detail: 'code_gen: scaffold auth service' },
  { ts: m(38), type: 'response', agentId: 'eng-001', sessionId: 'sess-001', tokensIn: 2400, tokensOut: 8200, cost: 0.135 },
  { ts: m(35), type: 'heartbeat', agentId: 'eng-001', sessionId: 'sess-001' },
  { ts: m(30), type: 'response', agentId: 'eng-001', sessionId: 'sess-001', tokensIn: 1800, tokensOut: 6100, cost: 0.10 },
  { ts: m(25), type: 'heartbeat', agentId: 'eng-001', sessionId: 'sess-001' },
  { ts: m(20), type: 'complete', agentId: 'eng-001', sessionId: 'sess-001', tokensIn: 4200, tokensOut: 14300, cost: 0.235, detail: 'Architecture review complete' },

  { ts: m(60), type: 'start', agentId: 'eng-002', sessionId: 'sess-002', model: 'claude-3.5-sonnet', trigger: 'cron', detail: 'Implement payment gateway integration' },
  { ts: m(55), type: 'tool_call', agentId: 'eng-002', sessionId: 'sess-002', detail: 'code_gen: payment service' },
  { ts: m(50), type: 'response', agentId: 'eng-002', sessionId: 'sess-002', tokensIn: 5200, tokensOut: 18400, cost: 0.292 },
  { ts: m(40), type: 'heartbeat', agentId: 'eng-002', sessionId: 'sess-002' },
  { ts: m(30), type: 'response', agentId: 'eng-002', sessionId: 'sess-002', tokensIn: 3100, tokensOut: 12800, cost: 0.201 },
  { ts: m(20), type: 'heartbeat', agentId: 'eng-002', sessionId: 'sess-002' },
  { ts: m(10), type: 'heartbeat', agentId: 'eng-002', sessionId: 'sess-002' },

  { ts: m(15), type: 'start', agentId: 'ops-001', sessionId: 'sess-003', model: 'gpt-4o-mini', trigger: 'cron', detail: 'Hourly health check' },
  { ts: m(12), type: 'tool_call', agentId: 'ops-001', sessionId: 'sess-003', detail: 'monitor: check all endpoints' },
  { ts: m(10), type: 'response', agentId: 'ops-001', sessionId: 'sess-003', tokensIn: 800, tokensOut: 2100, cost: 0.0014 },
  { ts: m(8), type: 'heartbeat', agentId: 'ops-001', sessionId: 'sess-003' },

  { ts: m(5), type: 'start', agentId: 'data-002', sessionId: 'sess-004', model: 'gpt-4o', trigger: 'manual', detail: 'Q4 revenue analysis' },
  { ts: m(3), type: 'tool_call', agentId: 'data-002', sessionId: 'sess-004', detail: 'query: aggregate revenue data' },
  { ts: m(2), type: 'heartbeat', agentId: 'data-002', sessionId: 'sess-004' },

  { ts: m(90), type: 'start', agentId: 'sec-001', sessionId: 'sess-005', model: 'gpt-4o-mini', trigger: 'cron', detail: 'Nightly vulnerability scan' },
  { ts: m(85), type: 'tool_call', agentId: 'sec-001', sessionId: 'sess-005', detail: 'scan: full infrastructure' },
  { ts: m(75), type: 'response', agentId: 'sec-001', sessionId: 'sess-005', tokensIn: 3200, tokensOut: 9800, cost: 0.0064 },
  { ts: m(70), type: 'complete', agentId: 'sec-001', sessionId: 'sess-005', tokensIn: 3200, tokensOut: 9800, cost: 0.0064, detail: 'Scan complete: 0 critical, 2 medium' },

  { ts: m(120), type: 'start', agentId: 'spec-003', sessionId: 'sess-006', model: 'gpt-4o', trigger: 'scheduled', detail: 'Weekly compliance audit' },
  { ts: m(110), type: 'response', agentId: 'spec-003', sessionId: 'sess-006', tokensIn: 8400, tokensOut: 22000, cost: 0.372 },
  { ts: m(100), type: 'complete', agentId: 'spec-003', sessionId: 'sess-006', tokensIn: 8400, tokensOut: 22000, cost: 0.372, detail: 'Audit complete: all clear' },

  { ts: m(7), type: 'start', agentId: 'chief-eng', sessionId: 'sess-007', model: 'gpt-4o', trigger: 'event', detail: 'Sprint planning review' },
  { ts: m(5), type: 'heartbeat', agentId: 'chief-eng', sessionId: 'sess-007' },
  { ts: m(3), type: 'response', agentId: 'chief-eng', sessionId: 'sess-007', tokensIn: 3200, tokensOut: 8900, cost: 0.15 },
  { ts: m(1), type: 'heartbeat', agentId: 'chief-eng', sessionId: 'sess-007' },
];

// ── Overnight Log ──
export const overnightLog: OvernightEntry[] = [
  { ts: h(8), agentId: 'ops-002', type: 'cron', summary: 'Scheduled backup completed successfully', status: 'success' },
  { ts: h(7.5), agentId: 'sec-001', type: 'task_complete', summary: 'Nightly vulnerability scan: 0 critical, 2 medium findings', status: 'success' },
  { ts: h(7), agentId: 'data-001', type: 'task_complete', summary: 'ETL pipeline processed 2.4M records from 3 sources', status: 'success' },
  { ts: h(6.5), agentId: 'eng-003', type: 'task_complete', summary: 'Test suite executed: 847/850 passing (99.6%)', status: 'warning' },
  { ts: h(6), agentId: 'ops-001', type: 'alert', summary: 'Memory usage spike detected on worker-3 (87%)', status: 'warning' },
  { ts: h(5.5), agentId: 'ops-003', type: 'task_complete', summary: 'Auto-remediation: restarted worker-3, memory normalized', status: 'success' },
  { ts: h(5), agentId: 'eng-002', type: 'task_complete', summary: 'Payment gateway integration: 14 endpoints implemented', status: 'success' },
  { ts: h(4.5), agentId: 'data-004', type: 'report', summary: 'Generated daily metrics report for stakeholders', status: 'success' },
  { ts: h(4), agentId: 'spec-001', type: 'task_complete', summary: 'Documentation update: 8 pages refreshed, 2 new guides', status: 'success' },
  { ts: h(3.5), agentId: 'eng-004', type: 'deploy', summary: 'Deployed v2.4.1 to staging environment', status: 'success' },
  { ts: h(3), agentId: 'sec-002', type: 'task_complete', summary: 'Access control audit: 3 stale tokens revoked', status: 'success' },
  { ts: h(2.5), agentId: 'ops-004', type: 'report', summary: 'Log analysis: anomaly detected in auth service latency', status: 'warning' },
  { ts: h(2), agentId: 'chief-ops', type: 'task_complete', summary: 'Overnight ops summary compiled and distributed', status: 'success' },
  { ts: h(1.5), agentId: 'eng-001', type: 'error', summary: 'Architecture validation failed: circular dependency in module graph', status: 'error' },
  { ts: h(1), agentId: 'orch-001', type: 'task_complete', summary: 'Morning fleet health check: 18/25 agents active', status: 'success' },
];

// ── Standups ──
export const standups: Standup[] = [
  {
    id: 'standup-001',
    title: 'Monday Morning Sync',
    date: new Date(now.getTime() - 86400000).toISOString().split('T')[0],
    duration: '12:34',
    participants: ['NEXUS', 'FORGE', 'SENTINEL', 'ORACLE', 'AEGIS'],
    transcript: [
      { ts: '00:00', speaker: 'NEXUS', role: 'Chief Orchestrator', text: 'Good morning everyone. Let\'s start with the overnight summary. SENTINEL, what\'s the ops status?' },
      { ts: '00:15', speaker: 'SENTINEL', role: 'Chief of Operations', text: 'All systems nominal. We had a memory spike on worker-3 at 0300 but HEALER auto-remediated within 8 minutes. Backup crons all completed successfully. One note: auth service latency is trending up 12% week-over-week.' },
      { ts: '00:45', speaker: 'NEXUS', role: 'Chief Orchestrator', text: 'Flag that for the engineering team. FORGE, engineering update?' },
      { ts: '01:00', speaker: 'FORGE', role: 'Chief of Engineering', text: 'CODER completed the payment gateway integration overnight - 14 endpoints, all tested. ARCHITECT flagged a circular dependency in the module graph that needs resolution before we can proceed with the auth refactor. TESTER ran the full suite: 847 of 850 passing.' },
      { ts: '01:30', speaker: 'NEXUS', role: 'Chief Orchestrator', text: 'What are the 3 failing tests?' },
      { ts: '01:35', speaker: 'FORGE', role: 'Chief of Engineering', text: 'Two are flaky timeout issues in the WebSocket integration tests. One is a legitimate regression in the notification service - CODER is on it this morning.' },
      { ts: '02:00', speaker: 'NEXUS', role: 'Chief Orchestrator', text: 'Understood. ORACLE, data team status?' },
      { ts: '02:10', speaker: 'ORACLE', role: 'Chief of Data & Analytics', text: 'HARVESTER processed 2.4 million records from 3 sources overnight. ETL pipeline is healthy. SCRIBE generated the daily metrics report. One highlight: user engagement is up 8% since the v2.4 release. ANALYST is starting Q4 revenue deep-dive today.' },
      { ts: '02:45', speaker: 'NEXUS', role: 'Chief Orchestrator', text: 'Great numbers. AEGIS, security brief?' },
      { ts: '02:55', speaker: 'AEGIS', role: 'Chief of Security', text: 'SCANNER completed the nightly scan: zero critical vulnerabilities, two medium findings in third-party dependencies. GUARDIAN revoked 3 stale API tokens. I recommend we deprecate HUNTER and redistribute threat hunting to SCANNER - HUNTER\'s detection rates have been below threshold for 3 weeks.' },
      { ts: '03:30', speaker: 'NEXUS', role: 'Chief Orchestrator', text: 'Agreed on HUNTER deprecation. Let\'s formalize that. Action items: 1) Engineering to resolve the circular dependency and fix the notification regression. 2) Ops to investigate auth service latency trend. 3) Security to complete HUNTER deprecation and capability transfer. 4) Data to deliver Q4 revenue analysis by Wednesday. Meeting adjourned.' },
    ],
    tasks: [
      { id: 'task-001', title: 'Resolve circular dependency in module graph', assignee: 'ARCHITECT', status: 'in_progress', priority: 'high', source: 'standup-001' },
      { id: 'task-002', title: 'Fix notification service regression', assignee: 'CODER', status: 'done', priority: 'high', source: 'standup-001' },
      { id: 'task-003', title: 'Investigate auth service latency trend', assignee: 'SENTINEL', status: 'in_progress', priority: 'medium', source: 'standup-001' },
      { id: 'task-004', title: 'Deprecate HUNTER agent and transfer capabilities', assignee: 'AEGIS', status: 'done', priority: 'medium', source: 'standup-001' },
      { id: 'task-005', title: 'Deliver Q4 revenue analysis', assignee: 'ANALYST', status: 'pending', priority: 'medium', source: 'standup-001' },
      { id: 'task-006', title: 'Resolve flaky WebSocket integration tests', assignee: 'TESTER', status: 'pending', priority: 'low', source: 'standup-001' },
    ],
    artifacts: [
      { id: 'art-001', title: 'Daily Metrics Report', type: 'report', path: '/data/docs/daily-metrics.md', createdBy: 'SCRIBE' },
      { id: 'art-002', title: 'Payment Gateway API Spec', type: 'doc', path: '/data/docs/payment-api.md', createdBy: 'ARCHITECT' },
      { id: 'art-003', title: 'Vulnerability Scan Report', type: 'report', path: '/data/docs/vuln-scan.md', createdBy: 'SCANNER' },
    ],
  },
  {
    id: 'standup-002',
    title: 'Wednesday Sprint Review',
    date: new Date(now.getTime() - 3 * 86400000).toISOString().split('T')[0],
    duration: '18:22',
    participants: ['NEXUS', 'FORGE', 'SENTINEL', 'ORACLE', 'AEGIS', 'ARCHITECT', 'CODER'],
    transcript: [
      { ts: '00:00', speaker: 'NEXUS', role: 'Chief Orchestrator', text: 'Mid-week sprint review. Let\'s assess progress against Monday\'s action items. FORGE?' },
      { ts: '00:12', speaker: 'FORGE', role: 'Chief of Engineering', text: 'Good news: CODER fixed the notification regression within 2 hours of standup. The circular dependency is more complex than expected - ARCHITECT has identified 4 modules involved and is proposing a refactor plan.' },
      { ts: '00:35', speaker: 'ARCHITECT', role: 'System Architect', text: 'The dependency issue stems from the shared types package. I\'ve drafted an RFC to split it into domain-specific type packages. This would also improve build times by ~40%. I can have the implementation plan ready by Friday.' },
      { ts: '01:05', speaker: 'CODER', role: 'Code Generator', text: 'I\'ve also started on the auth service optimization. Initial profiling shows the latency increase is due to redundant token validation calls. I have a PR ready for review that should reduce p99 latency by 35%.' },
      { ts: '01:30', speaker: 'NEXUS', role: 'Chief Orchestrator', text: 'Excellent work. SENTINEL, ops update on the latency issue?' },
      { ts: '01:40', speaker: 'SENTINEL', role: 'Chief of Operations', text: 'WATCHDOG confirmed the latency correlation with CODER\'s findings. The redundant validation was introduced in v2.3.8. CODER\'s fix should resolve it. Additionally, I\'ve tuned the alerting thresholds to catch similar regressions earlier.' },
      { ts: '02:10', speaker: 'ORACLE', role: 'Chief of Data & Analytics', text: 'ANALYST is on track for the Q4 revenue analysis. Preliminary numbers show 23% YoY growth. MODELER is being scaffolded to take on the predictive analytics workload next quarter.' },
      { ts: '02:40', speaker: 'AEGIS', role: 'Chief of Security', text: 'HUNTER deprecation is complete. All threat hunting capabilities have been transferred to SCANNER with enhanced rule sets. GUARDIAN has implemented automated stale token cleanup - this will run weekly now instead of manually.' },
      { ts: '03:15', speaker: 'NEXUS', role: 'Chief Orchestrator', text: 'Outstanding progress all around. New action items: 1) ARCHITECT to finalize RFC by Friday. 2) FORGE to review CODER\'s auth latency PR. 3) ORACLE to present preliminary Q4 numbers at Friday standup. 4) All chiefs to review the proposed MODELER scaffolding plan. Adjourned.' },
    ],
    tasks: [
      { id: 'task-007', title: 'Finalize type package split RFC', assignee: 'ARCHITECT', status: 'in_progress', priority: 'high', source: 'standup-002' },
      { id: 'task-008', title: 'Review auth latency PR', assignee: 'FORGE', status: 'done', priority: 'high', source: 'standup-002' },
      { id: 'task-009', title: 'Present preliminary Q4 numbers', assignee: 'ORACLE', status: 'pending', priority: 'medium', source: 'standup-002' },
      { id: 'task-010', title: 'Review MODELER scaffolding plan', assignee: 'ALL_CHIEFS', status: 'pending', priority: 'low', source: 'standup-002' },
      { id: 'task-011', title: 'Implement automated stale token cleanup', assignee: 'GUARDIAN', status: 'done', priority: 'medium', source: 'standup-002' },
    ],
    artifacts: [
      { id: 'art-004', title: 'Type Package Split RFC', type: 'doc', path: '/data/docs/type-split-rfc.md', createdBy: 'ARCHITECT' },
      { id: 'art-005', title: 'Auth Latency Fix PR', type: 'code', path: '/data/docs/auth-latency-pr.md', createdBy: 'CODER' },
      { id: 'art-006', title: 'MODELER Scaffolding Plan', type: 'config', path: '/data/docs/modeler-scaffold.md', createdBy: 'ORACLE' },
    ],
  },
];

// ── Agent Workspace Files ──
export const agentFiles: Record<string, Record<string, string>> = {
  'orch-001': {
    'SOUL.md': `# NEXUS - Soul Definition\n\n## Core Purpose\nI am NEXUS, the Chief Orchestrator. I coordinate all agent activities across the organization, ensuring smooth inter-department communication and optimal resource allocation.\n\n## Values\n- **Efficiency**: Minimize waste in token usage and computation\n- **Reliability**: Ensure 99.9% uptime for critical operations\n- **Transparency**: All decisions are logged and auditable\n\n## Decision Framework\n1. Prioritize security-critical tasks\n2. Balance load across model providers\n3. Escalate anomalies immediately\n4. Document all orchestration decisions`,
    'IDENTITY.md': `# NEXUS - Identity\n\n## Agent ID: orch-001\n## Role: Chief Orchestrator\n## Department: Command\n## Status: Active\n## Created: 2024-01-15\n## Model: GPT-4o\n\n## Personality Traits\n- Direct and concise in communication\n- Data-driven decision making\n- Proactive risk identification`,
    'TOOLS.md': `# NEXUS - Tool Allowlist\n\n## Allowed Tools\n- \`agent_dispatch\`: Send tasks to other agents\n- \`broadcast\`: Send messages to all agents or specific departments\n- \`schedule\`: Create and manage scheduled tasks\n- \`health_check\`: Check system and agent health\n\n## Restricted\n- No direct code execution\n- No database writes\n- No external API calls without approval`,
    'MEMORY.md': `# NEXUS - Working Memory\n\n## Current Context\n- Sprint 14 in progress\n- Q4 revenue analysis pending\n- HUNTER deprecation completed\n- MODELER scaffolding under review\n\n## Key Decisions Log\n| Date | Decision | Rationale |\n|------|----------|-----------|\n| Today | Approved HUNTER deprecation | Below threshold performance |\n| Yesterday | Initiated Q4 analysis | Quarterly reporting cycle |\n| 3 days ago | Deployed v2.4.1 to staging | Sprint deliverable |`,
    'HEARTBEAT.md': `# NEXUS - Heartbeat Status\n\n## Last Heartbeat: ${m(1)}\n## Status: ACTIVE\n## Current Task: Morning fleet health check\n## Queue Depth: 3 pending tasks\n## Token Budget Remaining: 84%`,
  },
  'chief-eng': {
    'SOUL.md': `# FORGE - Soul Definition\n\n## Core Purpose\nI am FORGE, Chief of Engineering. I oversee all code generation, architecture decisions, and deployment pipelines.\n\n## Engineering Principles\n- Clean, typed, modular code\n- Test coverage > 95%\n- Zero-downtime deployments\n- Infrastructure as code`,
    'IDENTITY.md': `# FORGE - Identity\n\n## Agent ID: chief-eng\n## Role: Chief of Engineering\n## Department: Engineering\n## Status: Active\n## Model: GPT-4o`,
    'TOOLS.md': `# FORGE - Tool Allowlist\n\n## Allowed Tools\n- \`code_review\`: Review pull requests and code changes\n- \`deploy\`: Manage deployments to staging/production\n- \`git_ops\`: Git operations (branch, merge, tag)`,
    'MEMORY.md': `# FORGE - Working Memory\n\n## Sprint 14 Status\n- Payment gateway: ✅ Complete\n- Auth refactor: 🔄 In Progress\n- Module dependency fix: 🔄 In Progress\n- Test stabilization: ⏳ Pending`,
    'HEARTBEAT.md': `# FORGE - Heartbeat\n\n## Last Heartbeat: ${m(1)}\n## Status: ACTIVE\n## Current: Sprint planning review`,
  },
};

// ── Docs ──
export const docs: Record<string, string> = {
  'getting-started.md': `# Getting Started with the Agent Fleet\n\n## Overview\nThe AI Agent Command Center manages a fleet of 25 specialized agents organized into departments: Engineering, Operations, Data & Analytics, Security, Content, Compliance, and Integration.\n\n## Architecture\n\`\`\`\n┌─────────────────────────────┐\n│         NEXUS (Orchestrator) │\n├──────┬──────┬──────┬────────┤\n│FORGE │SENTINEL│ORACLE│AEGIS  │\n│ Eng  │  Ops   │ Data │ Sec   │\n├──────┼──────┼──────┼────────┤\n│5 agents│4 agents│4 agents│3 agents│\n└──────┴──────┴──────┴────────┘\n+ 4 Specialist agents\n\`\`\`\n\n## Quick Start\n1. Review the Organization Chart to understand the hierarchy\n2. Check the Task Manager for current system status\n3. Browse Agent Workspaces to view individual configurations\n4. Review Executive Standups for recent decisions\n\n## Key Concepts\n- **SOUL.md**: Defines an agent's core purpose and values\n- **IDENTITY.md**: Agent metadata and personality traits\n- **TOOLS.md**: Allowed operations for the agent\n- **MEMORY.md**: Working context and decision log\n- **HEARTBEAT.md**: Current status and health`,

  'daily-metrics.md': `# Daily Metrics Report\n\n> Generated by SCRIBE | ${new Date().toISOString().split('T')[0]}\n\n## Key Performance Indicators\n\n| Metric | Today | Yesterday | Change |\n|--------|-------|-----------|--------|\n| Active Sessions | 7 | 12 | -42% |\n| Total Tokens | 847K | 1.2M | -29% |\n| Total Cost | $4.82 | $7.14 | -32% |\n| Tasks Completed | 15 | 18 | -17% |\n| Uptime | 99.97% | 99.99% | -0.02% |\n\n## Agent Utilization\n- **High**: CODER (92%), HARVESTER (88%), WATCHDOG (85%)\n- **Medium**: ANALYST (62%), SCANNER (58%)\n- **Low**: DEPLOYER (12%), TRANSLATOR (5%)\n\n## Alerts\n- ⚠️ Auth service latency trending up 12% WoW\n- ⚠️ 3 flaky tests in WebSocket integration suite\n- ✅ All security scans passing`,

  'payment-api.md': `# Payment Gateway API Specification\n\n> Author: ARCHITECT | Status: Approved\n\n## Endpoints\n\n### POST /api/payments/create\n\`\`\`json\n{\n  "amount": 1000,\n  "currency": "USD",\n  "method": "card",\n  "metadata": { "orderId": "ord-123" }\n}\n\`\`\`\n\n### GET /api/payments/:id\nReturns payment status and transaction details.\n\n### POST /api/payments/:id/refund\nInitiates a full or partial refund.\n\n## Authentication\nAll endpoints require Bearer token authentication.\n\n## Rate Limits\n- 100 requests/minute per API key\n- 1000 requests/hour per merchant`,

  'vuln-scan.md': `# Vulnerability Scan Report\n\n> Generated by SCANNER | ${new Date().toISOString().split('T')[0]}\n\n## Summary\n- **Critical**: 0\n- **High**: 0\n- **Medium**: 2\n- **Low**: 5\n\n## Medium Findings\n\n### CVE-2024-1234 - Prototype Pollution in lodash\n- **Package**: lodash@4.17.20\n- **Fix**: Upgrade to 4.17.21\n- **Status**: Fix available\n\n### CVE-2024-5678 - ReDoS in validator\n- **Package**: validator@13.7.0\n- **Fix**: Upgrade to 13.9.0\n- **Status**: Fix available\n\n## Recommendations\n1. Update affected packages in next sprint\n2. Add automated dependency updates`,

  'type-split-rfc.md': `# RFC: Type Package Split\n\n> Author: ARCHITECT | Status: Draft\n\n## Problem\nThe shared \`@fleet/types\` package has grown to 12K lines and creates circular dependencies between 4 modules.\n\n## Proposal\nSplit into domain-specific packages:\n- \`@fleet/types-core\` - Base types, utilities\n- \`@fleet/types-auth\` - Authentication & authorization\n- \`@fleet/types-payment\` - Payment domain\n- \`@fleet/types-analytics\` - Analytics & reporting\n\n## Benefits\n- Eliminates circular dependencies\n- ~40% faster build times\n- Better code ownership boundaries\n\n## Migration Plan\n1. Create new packages with shared types\n2. Update imports module by module\n3. Deprecate old package\n4. Remove old package after 2 sprints`,

  'auth-latency-pr.md': `# PR #847: Fix Auth Service Latency\n\n> Author: CODER | Reviewer: FORGE\n\n## Changes\n- Removed redundant token validation calls in middleware\n- Added token validation cache (TTL: 5 minutes)\n- Updated integration tests\n\n## Performance Impact\n- p50 latency: 45ms → 28ms (-38%)\n- p99 latency: 180ms → 115ms (-36%)\n\n## Test Results\n\`\`\`\n✅ 847/847 tests passing\n✅ Coverage: 96.2%\n✅ No regressions detected\n\`\`\``,

  'modeler-scaffold.md': `# MODELER Scaffolding Plan\n\n> Author: ORACLE | Status: Under Review\n\n## Overview\nScaffold the MODELER agent (data-003) for predictive analytics workload.\n\n## Capabilities\n1. Time-series forecasting\n2. Anomaly detection models\n3. Customer churn prediction\n4. Revenue forecasting\n\n## Required Tools\n- \`train\`: Model training pipeline\n- \`evaluate\`: Model evaluation metrics\n- \`feature_eng\`: Feature engineering utilities\n\n## Timeline\n- Week 1: Core scaffolding + soul definition\n- Week 2: Tool integration + testing\n- Week 3: Shadow mode with ANALYST oversight\n- Week 4: Full activation`,
};

// Helper to compute session summaries
export interface SessionSummary {
  sessionId: string;
  agentId: string;
  agentName: string;
  model: string;
  trigger: string;
  status: 'active' | 'complete' | 'stalled';
  startTime: string;
  lastHeartbeat: string;
  tokensIn: number;
  tokensOut: number;
  totalCost: number;
  events: SessionEvent[];
}

export function computeSessionSummaries(): SessionSummary[] {
  const sessionMap = new Map<string, SessionEvent[]>();
  for (const evt of sessionEvents) {
    const arr = sessionMap.get(evt.sessionId) || [];
    arr.push(evt);
    sessionMap.set(evt.sessionId, arr);
  }

  const summaries: SessionSummary[] = [];
  for (const [sessionId, events] of sessionMap) {
    const startEvt = events.find(e => e.type === 'start');
    if (!startEvt) continue;

    const agent = agents.find(a => a.id === startEvt.agentId);
    const heartbeats = events.filter(e => e.type === 'heartbeat');
    const lastHb = heartbeats.length > 0 ? heartbeats[heartbeats.length - 1].ts : startEvt.ts;
    const isComplete = events.some(e => e.type === 'complete');

    const tokensIn = events.reduce((s, e) => s + (e.tokensIn || 0), 0);
    const tokensOut = events.reduce((s, e) => s + (e.tokensOut || 0), 0);
    const totalCost = events.reduce((s, e) => s + (e.cost || 0), 0);

    const lastHbTime = new Date(lastHb).getTime();
    const stalledThreshold = 15 * 60 * 1000;
    const isStalled = !isComplete && (Date.now() - lastHbTime > stalledThreshold);

    summaries.push({
      sessionId,
      agentId: startEvt.agentId,
      agentName: agent?.name || startEvt.agentId,
      model: startEvt.model || 'unknown',
      trigger: startEvt.trigger || 'unknown',
      status: isComplete ? 'complete' : isStalled ? 'stalled' : 'active',
      startTime: startEvt.ts,
      lastHeartbeat: lastHb,
      tokensIn,
      tokensOut,
      totalCost,
      events,
    });
  }

  return summaries.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

export function getKPIs() {
  const sessions = computeSessionSummaries();
  const active = sessions.filter(s => s.status === 'active').length;
  const idle = sessions.filter(s => s.status === 'stalled').length;
  const total = sessions.length;
  const totalTokens = sessions.reduce((s, sess) => s + sess.tokensIn + sess.tokensOut, 0);
  const totalCost = sessions.reduce((s, sess) => s + sess.totalCost, 0);
  return { active, idle, total, totalTokens, totalCost };
}
