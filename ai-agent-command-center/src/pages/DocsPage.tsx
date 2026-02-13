import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, Book, ChevronRight } from 'lucide-react';
import { docs } from '../data/seedData';

const docList = Object.keys(docs).map(filename => ({
  id: filename,
  title: filename.replace(/-/g, ' ').replace('.md', '').replace(/\b\w/g, l => l.toUpperCase()),
  filename,
}));

const categories: { name: string; items: typeof docList }[] = [
  { name: 'Guides', items: docList.filter(d => ['getting-started.md'].includes(d.id)) },
  { name: 'Reports', items: docList.filter(d => ['daily-metrics.md', 'vuln-scan.md'].includes(d.id)) },
  { name: 'Specs & RFCs', items: docList.filter(d => ['payment-api.md', 'type-split-rfc.md', 'auth-latency-pr.md', 'modeler-scaffold.md'].includes(d.id)) },
];

export function DocsPage() {
  const [selectedDoc, setSelectedDoc] = useState<string>('getting-started.md');

  const content = docs[selectedDoc] || '';

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-terminal-border p-4 overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <Book size={16} className="text-phosphor" />
          <h2 className="text-xs font-bold text-phosphor glow-text tracking-wider">DOCUMENTATION</h2>
        </div>

        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.name}>
              <h3 className="text-[10px] text-gray-600 tracking-widest uppercase mb-1.5 px-2">{cat.name}</h3>
              <div className="space-y-0.5">
                {cat.items.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center gap-2 transition-all ${
                      selectedDoc === doc.id
                        ? 'bg-phosphor/10 text-phosphor'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-terminal-hover'
                    }`}
                  >
                    <FileText size={11} />
                    <span className="truncate">{doc.title}</span>
                    {selectedDoc === doc.id && <ChevronRight size={10} className="ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-terminal-border">
            <FileText size={14} className="text-phosphor-dim" />
            <span className="text-[10px] text-gray-600 tracking-wider">/data/docs/{selectedDoc}</span>
          </div>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
