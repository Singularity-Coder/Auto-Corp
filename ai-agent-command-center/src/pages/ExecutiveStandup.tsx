import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Calendar, Clock, Users, CheckCircle, Circle, Loader, FileText, Link, ChevronRight } from 'lucide-react';
import { standups, type Standup, type Task, type Artifact } from '../data/seedData';

const speakerColors: Record<string, string> = {
  'NEXUS': 'text-phosphor',
  'FORGE': 'text-amber',
  'SENTINEL': 'text-cyan-glow',
  'ORACLE': 'text-purple-glow',
  'AEGIS': 'text-red-glow',
  'ARCHITECT': 'text-amber',
  'CODER': 'text-cyan-glow',
};

const speakerBg: Record<string, string> = {
  'NEXUS': 'bg-phosphor/10 border-phosphor/20',
  'FORGE': 'bg-amber/10 border-amber/20',
  'SENTINEL': 'bg-cyan-glow/10 border-cyan-glow/20',
  'ORACLE': 'bg-purple-glow/10 border-purple-glow/20',
  'AEGIS': 'bg-red-glow/10 border-red-glow/20',
  'ARCHITECT': 'bg-amber/10 border-amber/20',
  'CODER': 'bg-cyan-glow/10 border-cyan-glow/20',
};

export function ExecutiveStandup() {
  const [selectedStandup, setSelectedStandup] = useState<Standup | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'tasks' | 'artifacts'>('transcript');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-phosphor glow-text tracking-wider">EXECUTIVE STANDUPS</h1>
        <p className="text-[11px] text-gray-600 mt-0.5">Meeting archives, transcripts, and extracted tasks</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Archive List */}
        <div className="col-span-1">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">Meeting Archive</h2>
          <div className="space-y-2">
            {standups.map(standup => (
              <button
                key={standup.id}
                onClick={() => { setSelectedStandup(standup); setActiveTab('transcript'); }}
                className={`w-full text-left panel p-3 transition-panel ${selectedStandup?.id === standup.id ? 'glow-border' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar size={12} className="text-phosphor-dim" />
                  <span className="text-[10px] text-gray-500">{standup.date}</span>
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">{standup.title}</h3>
                <div className="flex items-center gap-3 text-[10px] text-gray-600">
                  <span className="flex items-center gap-1"><Clock size={10} />{standup.duration}</span>
                  <span className="flex items-center gap-1"><Users size={10} />{standup.participants.length}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-phosphor/10 text-phosphor-dim">
                    {standup.tasks.filter(t => t.status === 'done').length}/{standup.tasks.length} tasks done
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-glow/10 text-purple-glow">
                    {standup.artifacts.length} artifacts
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail View */}
        <div className="col-span-3">
          {!selectedStandup ? (
            <div className="flex items-center justify-center h-96 panel">
              <div className="text-center">
                <Calendar size={32} className="text-gray-700 mx-auto mb-3" />
                <p className="text-xs text-gray-600">Select a standup to view details</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Standup Header */}
              <div className="panel p-4 glow-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white">{selectedStandup.title}</h2>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {selectedStandup.date} • {selectedStandup.duration} • {selectedStandup.participants.join(', ')}
                    </p>
                  </div>
                  {/* Playback Controls (UI only) */}
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-600 hover:text-phosphor transition-colors">
                      <SkipBack size={14} />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-full bg-phosphor/10 text-phosphor hover:bg-phosphor/20 transition-colors glow-border"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button className="p-1.5 text-gray-600 hover:text-phosphor transition-colors">
                      <SkipForward size={14} />
                    </button>
                    <div className="ml-3 flex-1 max-w-48 h-1 bg-terminal-border rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-phosphor rounded-full" />
                    </div>
                    <span className="text-[10px] text-gray-600 ml-2">04:12 / {selectedStandup.duration}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-0 border-b border-terminal-border">
                {(['transcript', 'tasks', 'artifacts'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs capitalize transition-colors ${
                      activeTab === tab ? 'tab-active' : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    {tab}
                    {tab === 'tasks' && ` (${selectedStandup.tasks.length})`}
                    {tab === 'artifacts' && ` (${selectedStandup.artifacts.length})`}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'transcript' && <TranscriptView standup={selectedStandup} />}
              {activeTab === 'tasks' && <TasksView tasks={selectedStandup.tasks} />}
              {activeTab === 'artifacts' && <ArtifactsView artifacts={selectedStandup.artifacts} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TranscriptView({ standup }: { standup: Standup }) {
  return (
    <div className="space-y-2 max-h-[60vh] overflow-auto">
      {standup.transcript.map((turn, i) => (
        <div key={i} className={`panel p-3 border ${speakerBg[turn.speaker] || 'bg-terminal-hover border-terminal-border'} transition-panel`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] text-gray-600 w-12">[{turn.ts}]</span>
            <span className={`text-xs font-bold ${speakerColors[turn.speaker] || 'text-white'}`}>{turn.speaker}</span>
            <span className="text-[9px] text-gray-600">— {turn.role}</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed pl-14">{turn.text}</p>
        </div>
      ))}
    </div>
  );
}

function TasksView({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div key={task.id} className="panel p-3 flex items-center gap-3 transition-panel">
          <TaskStatusIcon status={task.status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white font-medium">{task.title}</span>
              <PriorityBadge priority={task.priority} />
            </div>
            <p className="text-[10px] text-gray-600 mt-0.5">Assigned to {task.assignee}</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded ${
            task.status === 'done' ? 'bg-phosphor/10 text-phosphor' :
            task.status === 'in_progress' ? 'bg-amber/10 text-amber' :
            'bg-gray-800 text-gray-500'
          }`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      ))}
    </div>
  );
}

function ArtifactsView({ artifacts }: { artifacts: Artifact[] }) {
  return (
    <div className="space-y-2">
      {artifacts.map(artifact => (
        <div key={artifact.id} className="panel p-3 flex items-center gap-3 transition-panel hover:glow-border cursor-pointer">
          <ArtifactIcon type={artifact.type} />
          <div className="flex-1 min-w-0">
            <span className="text-xs text-white font-medium">{artifact.title}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-600">by {artifact.createdBy}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-terminal-hover text-gray-500">{artifact.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-phosphor-dim">
            <Link size={10} />
            <span className="truncate max-w-40">{artifact.path}</span>
            <ChevronRight size={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskStatusIcon({ status }: { status: string }) {
  if (status === 'done') return <CheckCircle size={16} className="text-phosphor flex-shrink-0" />;
  if (status === 'in_progress') return <Loader size={16} className="text-amber flex-shrink-0" />;
  return <Circle size={16} className="text-gray-600 flex-shrink-0" />;
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-red-glow/15 text-red-glow',
    high: 'bg-amber/15 text-amber',
    medium: 'bg-cyan-glow/15 text-cyan-glow',
    low: 'bg-gray-800 text-gray-500',
  };
  return <span className={`text-[9px] px-1.5 py-0.5 rounded ${colors[priority]}`}>{priority}</span>;
}

function ArtifactIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    doc: 'text-cyan-glow',
    report: 'text-phosphor',
    code: 'text-amber',
    config: 'text-purple-glow',
  };
  return <FileText size={16} className={`${colors[type] || 'text-gray-500'} flex-shrink-0`} />;
}
