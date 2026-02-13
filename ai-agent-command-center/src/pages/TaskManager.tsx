import { useState, useEffect } from 'react';
import { Activity, Zap, DollarSign, Clock, Server, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { agents, modelFleet, computeSessionSummaries, getKPIs, overnightLog, type SessionSummary } from '../data/seedData';

function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return tokens.toString();
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

export function TaskManager() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [kpis, setKpis] = useState({ active: 0, idle: 0, total: 0, totalTokens: 0, totalCost: 0 });
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [showAllLogs, setShowAllLogs] = useState(false);

  useEffect(() => {
    setSessions(computeSessionSummaries());
    setKpis(getKPIs());
  }, []);

  const displayedLogs = showAllLogs ? overnightLog : overnightLog.slice(0, 8);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-phosphor glow-text tracking-wider">TASK MANAGER</h1>
          <p className="text-[11px] text-gray-600 mt-0.5">Fleet operations overview</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-600">
          <RefreshCw size={12} className="text-phosphor-dim" />
          <span>Live • Updated {timeAgo(new Date().toISOString())}</span>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-5 gap-3">
        <KPITile icon={<Activity size={16} />} label="Active Sessions" value={kpis.active.toString()} color="phosphor" />
        <KPITile icon={<Clock size={16} />} label="Idle/Stalled" value={kpis.idle.toString()} color="amber" />
        <KPITile icon={<Server size={16} />} label="Total Sessions" value={kpis.total.toString()} color="cyan" />
        <KPITile icon={<Zap size={16} />} label="Tokens Used" value={formatTokens(kpis.totalTokens)} color="purple" />
        <KPITile icon={<DollarSign size={16} />} label="Total Cost" value={formatCost(kpis.totalCost)} color="phosphor" />
      </div>

      {/* Model Fleet */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">Model Fleet</h2>
        <div className="grid grid-cols-5 gap-3">
          {modelFleet.map(model => (
            <div key={model.id} className="panel p-3 transition-panel">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-600 tracking-wider">{model.provider}</span>
                <StatusDot status={model.status} />
              </div>
              <h3 className="text-xs font-semibold text-white mb-1">{model.model}</h3>
              <p className="text-[10px] text-phosphor-dim mb-2">{model.role}</p>
              <div className="space-y-1 text-[10px] text-gray-500">
                <div className="flex justify-between">
                  <span>Fallback #{model.fallbackOrder}</span>
                  <span>{formatTokens(model.maxTokens)} ctx</span>
                </div>
                <div className="flex justify-between">
                  <span>In: ${model.costPer1kInput}/1K</span>
                  <span>Out: ${model.costPer1kOutput}/1K</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Active Sessions */}
        <div className="col-span-2">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">Active Sessions</h2>
          <div className="space-y-2">
            {sessions.map(sess => (
              <div key={sess.sessionId} className="panel p-3 transition-panel">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedSession(expandedSession === sess.sessionId ? null : sess.sessionId)}
                >
                  <div className="flex items-center gap-3">
                    <SessionStatusIcon status={sess.status} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{sess.agentName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-phosphor/10 text-phosphor-dim">{sess.model}</span>
                      </div>
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        {sess.events.find(e => e.type === 'start')?.detail || 'Session'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-gray-500">
                    <span>Trigger: {sess.trigger}</span>
                    <span>{formatTokens(sess.tokensIn + sess.tokensOut)} tok</span>
                    <span className="text-phosphor-dim">{formatCost(sess.totalCost)}</span>
                    <span>{timeAgo(sess.lastHeartbeat)}</span>
                    {expandedSession === sess.sessionId ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>
                {expandedSession === sess.sessionId && (
                  <div className="mt-3 pt-3 border-t border-terminal-border">
                    <div className="space-y-1">
                      {sess.events.map((evt, i) => (
                        <div key={i} className="flex items-center gap-3 text-[10px] py-1">
                          <span className="text-gray-600 w-16">{new Date(evt.ts).toLocaleTimeString()}</span>
                          <EventBadge type={evt.type} />
                          <span className="text-gray-400">{evt.detail || evt.type}</span>
                          {evt.tokensIn && <span className="text-gray-600 ml-auto">↓{formatTokens(evt.tokensIn)} ↑{formatTokens(evt.tokensOut || 0)}</span>}
                          {evt.cost && <span className="text-phosphor-dim">{formatCost(evt.cost)}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Overnight Log */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">Overnight Log</h2>
          <div className="space-y-1.5">
            {displayedLogs.map((entry, i) => (
              <div key={i} className="panel p-2.5 transition-panel">
                <div className="flex items-start gap-2">
                  <LogStatusIcon status={entry.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold text-white">
                        {agents.find(a => a.id === entry.agentId)?.name || entry.agentId}
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-terminal-hover text-gray-600">{entry.type}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{entry.summary}</p>
                    <span className="text-[9px] text-gray-700 mt-1 block">{timeAgo(entry.ts)}</span>
                  </div>
                </div>
              </div>
            ))}
            {overnightLog.length > 8 && (
              <button
                onClick={() => setShowAllLogs(!showAllLogs)}
                className="w-full text-[10px] text-phosphor-dim hover:text-phosphor py-1.5 transition-colors"
              >
                {showAllLogs ? 'Show less' : `Show all ${overnightLog.length} entries`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPITile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const borderClass = color === 'phosphor' ? 'glow-border' : color === 'amber' ? 'glow-border-amber' : color === 'cyan' ? 'glow-border-cyan' : 'glow-border-purple';
  const textClass = color === 'phosphor' ? 'text-phosphor glow-text' : color === 'amber' ? 'text-amber glow-text-amber' : color === 'cyan' ? 'text-cyan-glow glow-text-cyan' : 'text-purple-glow';
  return (
    <div className={`panel p-3.5 ${borderClass} transition-panel`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={textClass}>{icon}</span>
        <span className="text-[10px] text-gray-600 tracking-wider uppercase">{label}</span>
      </div>
      <p className={`text-xl font-bold ${textClass}`}>{value}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'online' ? 'bg-phosphor' : status === 'degraded' ? 'bg-amber' : 'bg-red-glow';
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${color} ${status === 'online' ? 'pulse-active' : ''}`} />
      <span className="text-[9px] text-gray-600 capitalize">{status}</span>
    </div>
  );
}

function SessionStatusIcon({ status }: { status: string }) {
  if (status === 'active') return <Activity size={14} className="text-phosphor pulse-active flex-shrink-0" />;
  if (status === 'complete') return <CheckCircle size={14} className="text-gray-600 flex-shrink-0" />;
  return <AlertTriangle size={14} className="text-amber flex-shrink-0" />;
}

function LogStatusIcon({ status }: { status: string }) {
  if (status === 'success') return <CheckCircle size={12} className="text-phosphor flex-shrink-0 mt-0.5" />;
  if (status === 'warning') return <AlertTriangle size={12} className="text-amber flex-shrink-0 mt-0.5" />;
  return <XCircle size={12} className="text-red-glow flex-shrink-0 mt-0.5" />;
}

function EventBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    start: 'bg-phosphor/15 text-phosphor',
    heartbeat: 'bg-cyan-glow/15 text-cyan-glow',
    tool_call: 'bg-purple-glow/15 text-purple-glow',
    response: 'bg-amber/15 text-amber',
    error: 'bg-red-glow/15 text-red-glow',
    complete: 'bg-phosphor/15 text-phosphor',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${colors[type] || 'bg-gray-800 text-gray-500'}`}>
      {type}
    </span>
  );
}
