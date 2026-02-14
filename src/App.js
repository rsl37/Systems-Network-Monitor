import React, { useState } from 'react';
import SystemTypeSelector from './components/SystemTypeSelector';
import TopologyView from './components/TopologyView';
import AlertPanel from './components/AlertPanel';
import './styles/App.css';

function App() {
  const [systemType, setSystemType] = useState('supply-chain');
  const [selectedNode, setSelectedNode] = useState(null);

  return (
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
          {selectedNode && (
            <div className="node-details">
              <h3>Node Details</h3>
              <p><strong>ID:</strong> {selectedNode.id}</p>
              <p><strong>Name:</strong> {selectedNode.name}</p>
              <p><strong>Type:</strong> {selectedNode.type}</p>
              <p><strong>Status:</strong> {selectedNode.status}</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
