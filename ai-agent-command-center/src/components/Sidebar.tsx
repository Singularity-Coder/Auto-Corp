import { Activity, GitBranch, Users, MessageSquare, FolderOpen, FileText, Cpu } from 'lucide-react';
import type { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'tasks', label: 'Task Manager', icon: <Activity size={18} /> },
  { id: 'org', label: 'Org Chart', icon: <GitBranch size={18} /> },
  { id: 'standup', label: 'Standups', icon: <MessageSquare size={18} /> },
  { id: 'workspaces', label: 'Workspaces', icon: <FolderOpen size={18} /> },
  { id: 'docs', label: 'Docs', icon: <FileText size={18} /> },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-terminal-border bg-terminal-surface/50 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-terminal-border">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Cpu size={22} className="text-phosphor glow-text" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-phosphor rounded-full pulse-active" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-phosphor glow-text tracking-wider">COMMAND</h1>
            <p className="text-[10px] text-phosphor-dim/60 tracking-widest">CENTER v2.4</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all duration-150 ${
              currentPage === item.id
                ? 'bg-phosphor/10 text-phosphor glow-text border border-phosphor/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-terminal-hover border border-transparent'
            }`}
          >
            {item.icon}
            <span className="tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Status */}
      <div className="p-3 border-t border-terminal-border">
        <div className="flex items-center gap-2 mb-2">
          <Users size={13} className="text-phosphor-dim/60" />
          <span className="text-[10px] text-phosphor-dim/60 tracking-wider">FLEET STATUS</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-phosphor pulse-active" />
            <span className="text-gray-500">18 Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber" />
            <span className="text-gray-500">4 Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow" />
            <span className="text-gray-500">2 Scaffold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-glow" />
            <span className="text-gray-500">1 Depr.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
