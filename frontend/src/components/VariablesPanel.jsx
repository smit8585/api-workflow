import React, { useState } from 'react';
import { Copy, ChevronDown, ChevronRight } from 'lucide-react';

function VariablesPanel({ nodes, selectedNodeId }) {
  const [expandedNodes, setExpandedNodes] = useState({});

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderValue = (value, path = 'data') => {
    if (value === null || value === undefined) {
      return <span style={{ color: '#64748b' }}>null</span>;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div style={{ marginLeft: '12px' }}>
          {Object.keys(value).slice(0, 5).map(key => (
            <div key={key} style={{ marginBottom: '4px' }}>
              <span style={{ color: '#94a3b8' }}>{key}: </span>
              <button
                className="secondary"
                onClick={() => copyToClipboard(`{{${path}.${key}}}`)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  marginLeft: '4px'
                }}
              >
                <Copy size={10} />
                {`{{${path}.${key}}}`}
              </button>
            </div>
          ))}
          {Object.keys(value).length > 5 && (
            <div style={{ color: '#64748b', fontSize: '10px' }}>
              ... and {Object.keys(value).length - 5} more
            </div>
          )}
        </div>
      );
    }

    return (
      <span style={{ color: '#3b82f6', fontSize: '11px' }}>
        {Array.isArray(value) ? `[${value.length} items]` : String(value)}
      </span>
    );
  };

  const executedNodes = nodes.filter(n => 
    n.data.executionResult?.success && n.id !== selectedNodeId
  );

  if (executedNodes.length === 0) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '13px'
      }}>
        <div style={{ marginBottom: '8px' }}>💡</div>
        <div>Execute the workflow to see available variables</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <h4 style={{
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Available Variables
      </h4>

      {executedNodes.map(node => (
        <div
          key={node.id}
          style={{
            marginBottom: '12px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '6px',
            overflow: 'hidden'
          }}
        >
          <div
            onClick={() => toggleNode(node.id)}
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#1e293b'
            }}
          >
            {expandedNodes[node.id] ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            <span style={{ fontSize: '13px', fontWeight: '500' }}>
              {node.data.label}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', marginLeft: 'auto' }}>
              {node.data.executionResult.duration}ms
            </span>
          </div>

          {expandedNodes[node.id] && (
            <div style={{ padding: '12px' }}>
              {node.data.executionResult.data && (
                <>
                  <div style={{ marginBottom: '8px' }}>
                    <button
                      className="secondary"
                      onClick={() => copyToClipboard(`{{data}}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        width: '100%',
                        padding: '6px 10px',
                        fontSize: '11px'
                      }}
                    >
                      <Copy size={12} />
                      Copy {`{{data}}`} (entire response)
                    </button>
                  </div>

                  <div style={{ fontSize: '12px' }}>
                    {renderValue(node.data.executionResult.data, 'data')}
                  </div>

                  <pre style={{
                    marginTop: '8px',
                    fontSize: '10px',
                    color: '#64748b',
                    background: '#0f172a',
                    padding: '8px',
                    borderRadius: '4px',
                    maxHeight: '150px',
                    overflow: 'auto',
                    fontFamily: 'monospace'
                  }}>
                    {JSON.stringify(node.data.executionResult.data, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#0f172a',
        borderRadius: '6px',
        fontSize: '11px',
        color: '#64748b'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '6px', color: '#94a3b8' }}>
          💡 Usage Tips:
        </div>
        <div>• Click any variable to copy</div>
        <div>• Use in URLs: <code style={{ color: '#3b82f6' }}>{`{{data.id}}`}</code></div>
        <div>• Nested access: <code style={{ color: '#3b82f6' }}>{`{{data.user.email}}`}</code></div>
      </div>
    </div>
  );
}

export default VariablesPanel;
