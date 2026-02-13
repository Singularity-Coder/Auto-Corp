import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FolderOpen, FileText, Edit3, Eye, Save, Bot, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { agents, agentFiles } from '../data/seedData';

export function AgentWorkspaces() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [savedFiles, setSavedFiles] = useState<Record<string, Record<string, string>>>(() => {
    // Deep copy the seed data
    const copy: Record<string, Record<string, string>> = {};
    for (const [agentId, files] of Object.entries(agentFiles)) {
      copy[agentId] = { ...files };
    }
    return copy;
  });
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const agentList = agents.filter(a => savedFiles[a.id]);
  const currentFiles = selectedAgent ? savedFiles[selectedAgent] : null;
  const currentContent = selectedAgent && selectedFile && currentFiles ? currentFiles[selectedFile] : null;

  const handleSelectFile = (file: string) => {
    setSelectedFile(file);
    setEditMode(false);
    if (selectedAgent && savedFiles[selectedAgent]) {
      setEditContent(savedFiles[selectedAgent][file] || '');
    }
  };

  const handleEdit = () => {
    if (currentContent !== null) {
      setEditContent(currentContent);
      setEditMode(true);
    }
  };

  const handleSave = () => {
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    if (selectedAgent && selectedFile) {
      setSavedFiles(prev => ({
        ...prev,
        [selectedAgent]: {
          ...prev[selectedAgent],
          [selectedFile]: editContent,
        },
      }));
      setEditMode(false);
      setShowSaveConfirm(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-phosphor glow-text tracking-wider">AGENT WORKSPACES</h1>
          <p className="text-[11px] text-gray-600 mt-0.5">View and edit agent configuration files</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 text-phosphor text-[11px] glow-border px-3 py-1.5 rounded">
            <CheckCircle size={14} />
            <span>File saved successfully</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Agent Selector */}
        <div className="w-48 flex-shrink-0 space-y-2 overflow-auto">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">Agents</h2>
          {agentList.map(agent => {
            const statusColor = agent.status === 'active' ? 'bg-phosphor' : agent.status === 'idle' ? 'bg-amber' : 'bg-gray-600';
            return (
              <button
                key={agent.id}
                onClick={() => { setSelectedAgent(agent.id); setSelectedFile(null); setEditMode(false); }}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
                  selectedAgent === agent.id
                    ? 'bg-phosphor/10 text-phosphor glow-border'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-terminal-hover'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                  <Bot size={12} />
                  <span className="font-semibold">{agent.name}</span>
                </div>
                <span className="text-[9px] text-gray-600 ml-5 block mt-0.5">{agent.role}</span>
              </button>
            );
          })}
          <div className="border-t border-terminal-border pt-2 mt-2">
            <p className="text-[9px] text-gray-700 px-2">
              {agents.length - agentList.length} agents without workspace files
            </p>
          </div>
        </div>

        {/* File List */}
        {selectedAgent && currentFiles && (
          <div className="w-44 flex-shrink-0 space-y-1 overflow-auto">
            <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">Files</h2>
            {Object.keys(currentFiles).map(filename => (
              <button
                key={filename}
                onClick={() => handleSelectFile(filename)}
                className={`w-full text-left px-2.5 py-2 rounded text-[11px] flex items-center gap-2 transition-all ${
                  selectedFile === filename
                    ? 'bg-phosphor/10 text-phosphor'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-terminal-hover'
                }`}
              >
                <FileText size={12} />
                <span className="truncate">{filename}</span>
                {selectedFile === filename && <ChevronRight size={10} className="ml-auto" />}
              </button>
            ))}
          </div>
        )}

        {/* Content Panel */}
        <div className="flex-1 min-w-0 flex flex-col">
          {!selectedAgent ? (
            <div className="flex items-center justify-center h-full panel">
              <div className="text-center">
                <FolderOpen size={32} className="text-gray-700 mx-auto mb-3" />
                <p className="text-xs text-gray-600">Select an agent to browse workspace</p>
              </div>
            </div>
          ) : !selectedFile ? (
            <div className="flex items-center justify-center h-full panel">
              <div className="text-center">
                <FileText size={32} className="text-gray-700 mx-auto mb-3" />
                <p className="text-xs text-gray-600">Select a file to preview</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* File Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-phosphor-dim" />
                  <span className="text-xs text-white font-semibold">{selectedFile}</span>
                  <span className="text-[9px] text-gray-600">
                    {agents.find(a => a.id === selectedAgent)?.name} / {selectedFile}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {editMode ? (
                    <>
                      <button
                        onClick={() => setEditMode(false)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-gray-500 border border-terminal-border rounded hover:bg-terminal-hover transition-colors"
                      >
                        <Eye size={12} /> Preview
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-phosphor border border-phosphor/30 rounded hover:bg-phosphor/10 transition-colors"
                      >
                        <Save size={12} /> Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-amber border border-amber/20 rounded hover:bg-amber/10 transition-colors"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-h-0 overflow-auto panel p-4">
                {editMode ? (
                  <textarea
                    className="editor-textarea h-full"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                  />
                ) : (
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentContent || ''}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Confirmation Modal */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="panel p-6 max-w-md glow-border-amber">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-amber" />
              <h3 className="text-sm font-bold text-amber">Confirm Write Operation</h3>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">
              You are about to modify <span className="text-white font-semibold">{selectedFile}</span> for agent{' '}
              <span className="text-white font-semibold">{agents.find(a => a.id === selectedAgent)?.name}</span>.
              This is a write operation that will update the agent's configuration.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveConfirm(false)}
                className="px-3 py-1.5 text-[10px] text-gray-500 border border-terminal-border rounded hover:bg-terminal-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-3 py-1.5 text-[10px] text-amber border border-amber/30 rounded hover:bg-amber/10 transition-colors"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
