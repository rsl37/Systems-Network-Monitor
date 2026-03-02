import React, { useState } from 'react';
import SystemTypeSelector from './components/SystemTypeSelector';
import TopologyView from './components/TopologyView';
import AlertPanel from './components/AlertPanel';
import NodeDetailsPanel from './components/NodeDetailsPanel';
import DataUpload from './components/DataUpload';
import ErrorBoundary from './components/ErrorBoundary';
import { Upload } from 'lucide-react';
import './styles/App.css';

function App() {
  const [systemType, setSystemType] = useState('supply-chain');
  const [selectedNode, setSelectedNode] = useState(null);
  const [importedData, setImportedData] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleImport = (data) => {
    setImportedData(data);
    setSelectedNode(null);
  };

  const handleReset = () => {
    setImportedData(null);
    setSelectedNode(null);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>Systems Network Monitor</h1>
          <div className="header-controls">
            <SystemTypeSelector
              systemType={systemType}
              onSystemTypeChange={setSystemType}
            />
            <div className="header-data-controls">
              <button
                className="import-data-btn"
                onClick={() => setShowUpload(true)}
                title="Import data from CSV or JSON"
              >
                <Upload size={15} />
                Import Data
              </button>
              {importedData && (
                <button
                  className="reset-data-btn"
                  onClick={handleReset}
                  title="Return to demo data"
                >
                  Reset to Demo
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="app-main">
          <div className="main-panel">
            <TopologyView
              systemType={systemType}
              selectedNode={selectedNode}
              onNodeSelect={setSelectedNode}
              importedNodes={importedData?.nodes || null}
              importedConnections={importedData?.connections || null}
            />
          </div>

          <aside className="sidebar-panel">
            <AlertPanel
              systemType={systemType}
              importedAlerts={importedData?.alerts || null}
            />
            <NodeDetailsPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </aside>
        </main>

        {showUpload && (
          <DataUpload
            systemType={systemType}
            onImport={handleImport}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
