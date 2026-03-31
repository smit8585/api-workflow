import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';

function ExecutionPanel({ results, nodes }) {
  const [expandedNodes, setExpandedNodes] = useState({});

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const getNodeLabel = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node?.data?.label || nodeId;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '600',
        marginBottom: '16px'
      }}>
        Execution Results
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(results).map(([nodeId, result]) => (
          <div
            key={nodeId}
            style={{
              background: '#0f172a',
              border: `1px solid ${result.success ? '#10b981' : '#ef4444'}`,
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <div
              onClick={() => toggleNode(nodeId)}
              style={{
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: result.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              }}
            >
              {expandedNodes[nodeId] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              
              {result.success ? (
                <CheckCircle size={16} color="#10b981" />
              ) : (
                <XCircle size={16} color="#ef4444" />
              )}

              <span style={{ flex: 1, fontWeight: '500', fontSize: '14px' }}>
                {getNodeLabel(nodeId)}
              </span>

              {result.duration && (
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {result.duration}ms
                </span>
              )}
            </div>

            {expandedNodes[nodeId] && (
              <div style={{ padding: '12px', borderTop: '1px solid #1e293b' }}>
                {result.error ? (
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#ef4444',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Error:
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      color: '#94a3b8',
                      background: '#1e293b',
                      padding: '8px',
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}>
                      {result.error}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#10b981',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Result:
                    </div>
                    <pre style={{ 
                      fontSize: '11px',
                      color: '#94a3b8',
                      background: '#1e293b',
                      padding: '8px',
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '300px',
                      margin: 0,
                      fontFamily: 'monospace'
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}

                <div style={{ 
                  fontSize: '11px', 
                  color: '#64748b',
                  marginTop: '8px'
                }}>
                  {result.timestamp}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExecutionPanel;
