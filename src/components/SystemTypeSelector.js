import React from 'react';
import './SystemTypeSelector.css';

function SystemTypeSelector({ systemType, onSystemTypeChange }) {
  return (
    <div className="system-type-selector">
      <button
        className={systemType === 'supply-chain' ? 'active' : ''}
        onClick={() => onSystemTypeChange('supply-chain')}
      >
        Supply Chain
      </button>
      <button
        className={systemType === 'atc' ? 'active' : ''}
        onClick={() => onSystemTypeChange('atc')}
      >
        Air Traffic Control
      </button>
    </div>
  );
}

export default SystemTypeSelector;
