import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Shield, Crown, Bot, Cpu, Minus, Plus } from 'lucide-react';
import { agents, type Agent } from '../data/seedData';

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return { bg: 'bg-phosphor/15', text: 'text-phosphor', dot: 'bg-phosphor', border: 'border-phosphor/20' };
    case 'idle': return { bg: 'bg-amber/15', text: 'text-amber', dot: 'bg-amber', border: 'border-amber/20' };
    case 'scaffolded': return { bg: 'bg-cyan-glow/15', text: 'text-cyan-glow', dot: 'bg-cyan-glow', border: 'border-cyan-glow/20' };
    case 'deprecated': return { bg: 'bg-red-glow/15', text: 'text-red-glow', dot: 'bg-red-glow', border: 'border-red-glow/20' };
    default: return { bg: 'bg-gray-800', text: 'text-gray-500', dot: 'bg-gray-500', border: 'border-gray-700' };
  }
}

function getDeptIcon(dept: string) {
  switch (dept) {
    case 'Command': return <Crown size={14} />;
    case 'Engineering': return <Cpu size={14} />;
    case 'Security': return <Shield size={14} />;
    default: return <Bot size={14} />;
  }
}

export function OrgChart() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(agents.filter(a => a.children && a.children.length > 0).map(a => a.id)));

  const chiefs = agents.filter(a => a.role.includes('Chief'));
  const activeCount = agents.filter(a => a.status === 'active').length;
  const scaffoldedCount = agents.filter(a => a.status === 'scaffolded').length;
  const deprecatedCount = agents.filter(a => a.status === 'deprecated').length;
  const orchestrator = agents.find(a => a.id === 'orch-001')!;

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(agents.filter(a => a.children && a.children.length > 0).map(a => a.id)));
  const collapseAll = () => setExpanded(new Set());

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-phosphor glow-text tracking-wider">ORGANIZATION CHART</h1>
          <p className="text-[11px] text-gray-600 mt-0.5">Agent hierarchy and department structure</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={expandAll} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-phosphor-dim border border-phosphor/20 rounded hover:bg-phosphor/10 transition-colors">
            <Plus size={12} /> Expand All
          </button>
          <button onClick={collapseAll} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-gray-500 border border-terminal-border rounded hover:bg-terminal-hover transition-colors">
            <Minus size={12} /> Collapse All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        <StatTile label="Chiefs" value={chiefs.length.toString()} icon={<Crown size={14} />} color="text-amber glow-text-amber" />
        <StatTile label="Total Agents" value={agents.length.toString()} icon={<Users size={14} />} color="text-phosphor glow-text" />
        <StatTile label="Active" value={activeCount.toString()} icon={<Bot size={14} />} color="text-phosphor glow-text" />
        <StatTile label="Scaffolded" value={scaffoldedCount.toString()} icon={<Cpu size={14} />} color="text-cyan-glow glow-text-cyan" />
        <StatTile label="Deprecated" value={deprecatedCount.toString()} icon={<Shield size={14} />} color="text-red-glow glow-text-red" />
      </div>

      {/* Tree */}
      <div className="space-y-2">
        <AgentNode agent={orchestrator} depth={0} expanded={expanded} onToggle={toggleExpand} />
      </div>
    </div>
  );
}

function StatTile({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="panel p-3 transition-panel">
      <div className="flex items-center gap-2 mb-1.5">
        <span className={color}>{icon}</span>
        <span className="text-[10px] text-gray-600 tracking-wider uppercase">{label}</span>
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function AgentNode({ agent, depth, expanded, onToggle }: { agent: Agent; depth: number; expanded: Set<string>; onToggle: (id: string) => void }) {
  const hasChildren = agent.children && agent.children.length > 0;
  const isExpanded = expanded.has(agent.id);
  const statusColors = getStatusColor(agent.status);
  const childAgents = hasChildren ? agents.filter(a => agent.children!.includes(a.id)) : [];

  return (
    <div style={{ marginLeft: depth > 0 ? depth * 20 : 0 }}>
      <div className={`panel p-3 transition-panel ${depth === 0 ? 'glow-border' : ''}`}>
        <div className="flex items-center gap-3">
          {/* Expand/Collapse */}
          {hasChildren ? (
            <button onClick={() => onToggle(agent.id)} className="text-gray-600 hover:text-phosphor transition-colors">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          {/* Icon */}
          <span className={statusColors.text}>{getDeptIcon(agent.department)}</span>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{agent.name}</span>
              <span className="text-[10px] text-gray-500">({agent.id})</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${statusColors.bg} ${statusColors.text}`}>
                {agent.status}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-terminal-hover text-gray-500">
                {agent.model}
              </span>
            </div>
            <p className="text-[10px] text-gray-600 mt-0.5">{agent.role} — {agent.department}</p>
          </div>

          {/* Responsibilities */}
          <div className="hidden xl:flex items-center gap-1 flex-wrap max-w-xs">
            {agent.responsibilities.slice(0, 2).map((r, i) => (
              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-phosphor/5 text-phosphor-dim/60 truncate max-w-32">{r}</span>
            ))}
            {agent.responsibilities.length > 2 && (
              <span className="text-[9px] text-gray-700">+{agent.responsibilities.length - 2}</span>
            )}
          </div>

          {/* Children count */}
          {hasChildren && (
            <span className="text-[10px] text-gray-600">
              {childAgents.length} agent{childAgents.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Expanded responsibilities for smaller screens */}
        {isExpanded && (
          <div className="xl:hidden mt-2 pt-2 border-t border-terminal-border">
            <div className="flex flex-wrap gap-1">
              {agent.responsibilities.map((r, i) => (
                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-phosphor/5 text-phosphor-dim/60">{r}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="mt-1 space-y-1 relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-terminal-border" />
          {childAgents.map(child => (
            <AgentNode key={child.id} agent={child} depth={depth + 1} expanded={expanded} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
