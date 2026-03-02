import React, { useState, useRef } from 'react';
import { Upload, X, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { processETL, getJSONTemplate, getCSVTemplate } from '../utils/etl';
import './DataUpload.css';

function DataUpload({ systemType, onImport, onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = processETL(e.target.result, file.name);
      setParseResult({ ...result, fileName: file.name });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
    // Reset so the same file can be re-selected if the user corrects and re-uploads
    e.target.value = '';
  };

  const handleImport = () => {
    if (parseResult && parseResult.errors.length === 0) {
      onImport({
        nodes: parseResult.nodes,
        connections: parseResult.connections,
        alerts: parseResult.alerts,
      });
      onClose();
    }
  };

  const downloadTemplate = (format) => {
    const content = format === 'json' ? getJSONTemplate(systemType) : getCSVTemplate(systemType);
    const mime = format === 'json' ? 'application/json' : 'text/csv';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-monitor-template.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isValid = parseResult !== null && parseResult.errors.length === 0;
  const hasErrors = parseResult !== null && parseResult.errors.length > 0;

  return (
    <div className="data-upload-overlay" onClick={onClose}>
      <div
        className="data-upload-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Import data"
      >
        <div className="data-upload-header">
          <h3>Import Data</h3>
          <button
            className="data-upload-close"
            onClick={onClose}
            aria-label="Close import panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="data-upload-body">
          {/* Drop / browse zone */}
          <div
            className={`drop-zone${dragActive ? ' drag-active' : ''}${isValid ? ' valid' : ''}${hasErrors ? ' invalid' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Drop file or click to browse"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              className="file-input-hidden"
              onChange={handleFileChange}
              aria-hidden="true"
            />
            {isValid ? (
              <>
                <CheckCircle size={32} className="drop-icon drop-icon--valid" />
                <p className="drop-text">{parseResult.fileName}</p>
                <p className="drop-subtext">
                  {parseResult.nodes.length} node{parseResult.nodes.length !== 1 ? 's' : ''} ·{' '}
                  {parseResult.connections.length} connection{parseResult.connections.length !== 1 ? 's' : ''} ·{' '}
                  {parseResult.alerts.length} alert{parseResult.alerts.length !== 1 ? 's' : ''}
                </p>
              </>
            ) : hasErrors ? (
              <>
                <AlertCircle size={32} className="drop-icon drop-icon--invalid" />
                <p className="drop-text">Fix errors below, then drop a corrected file</p>
              </>
            ) : (
              <>
                <Upload size={32} className="drop-icon" />
                <p className="drop-text">Drop a file here or click to browse</p>
                <p className="drop-subtext">Accepts .json or .csv</p>
              </>
            )}
          </div>

          {/* Validation errors */}
          {hasErrors && (
            <div className="upload-errors">
              <h4>Validation Errors</h4>
              <ul>
                {parseResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Format guide */}
          <div className="format-guide">
            <h4>Supported Formats</h4>
            <p>
              <strong>JSON</strong> – full ETL (nodes, connections, alerts):
            </p>
            <pre className="format-example">{`{
  "nodes":       [{ "id", "name", "type", "status", "location" }],
  "connections": [{ "id", "fromNodeId", "toNodeId", "type", "bandwidth", "latency" }],
  "alerts":      [{ "id", "nodeId", "severity", "message", "type" }]
}`}</pre>
            <p>
              <strong>CSV</strong> – nodes only, comma-separated with header row:
            </p>
            <pre className="format-example">id,name,type,status,location</pre>
            <p className="format-note">
              Valid statuses: <code>operational</code>, <code>warning</code>, <code>critical</code>,{' '}
              <code>maintenance</code>
              <br />
              Valid alert severities: <code>critical</code>, <code>warning</code>, <code>info</code>
            </p>
            <div className="template-downloads">
              <button className="template-btn" onClick={() => downloadTemplate('json')}>
                <Download size={14} />
                JSON Template
              </button>
              <button className="template-btn" onClick={() => downloadTemplate('csv')}>
                <Download size={14} />
                CSV Template
              </button>
            </div>
          </div>
        </div>

        <div className="data-upload-footer">
          <button className="upload-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="upload-import-btn"
            onClick={handleImport}
            disabled={!isValid}
          >
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataUpload;
