import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskManager } from './pages/TaskManager';
import { OrgChart } from './pages/OrgChart';
import { ExecutiveStandup } from './pages/ExecutiveStandup';
import { AgentWorkspaces } from './pages/AgentWorkspaces';
import { DocsPage } from './pages/DocsPage';

export type Page = 'tasks' | 'org' | 'standup' | 'workspaces' | 'docs';

export function App() {
  const [page, setPage] = useState<Page>('tasks');

  const renderPage = () => {
    switch (page) {
      case 'tasks': return <TaskManager />;
      case 'org': return <OrgChart />;
      case 'standup': return <ExecutiveStandup />;
      case 'workspaces': return <AgentWorkspaces />;
      case 'docs': return <DocsPage />;
    }
  };

  return (
    <div className="flex h-screen bg-terminal-bg grid-bg overflow-hidden">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}
