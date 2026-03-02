import React, { useState } from 'react';
import SystemTypeSelector from './components/SystemTypeSelector';
import TopologyView from './components/TopologyView';
import AlertPanel from './components/AlertPanel';
import NodeDetailsPanel from './components/NodeDetailsPanel';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/App.css';

function App() {
  const [systemType, setSystemType] = useState('supply-chain');
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>Systems Network Monitor</h1>
          <SystemTypeSelector 
            systemType={systemType} 
            onSystemTypeChange={setSystemType} 
          />
        </header>
        
        <main className="app-main">
          <div className="main-panel">
            <TopologyView 
              systemType={systemType}
              selectedNode={selectedNode}
              onNodeSelect={setSelectedNode}
            />
          </div>
          
          <aside className="sidebar-panel">
            <AlertPanel systemType={systemType} />
            <NodeDetailsPanel 
              node={selectedNode} 
              onClose={() => setSelectedNode(null)}
            />
          </aside>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
