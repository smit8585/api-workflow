import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

function NodeConfig({ node, onUpdate, onDelete, nodes }) {
  const [localData, setLocalData] = useState(node.data);

  const handleUpdate = (updates) => {
    const newData = { ...localData, ...updates };
    setLocalData(newData);
    onUpdate(node.id, updates);
  };

  const renderConfig = () => {
    switch (node.type) {
      case 'httpRequest':
        return (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label>Label</label>
              <input
                type="text"
                value={localData.label}
                onChange={(e) => handleUpdate({ label: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>Method</label>
              <select
                value={localData.method}
                onChange={(e) => handleUpdate({ method: e.target.value })}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>URL</label>
              <input
                type="text"
                value={localData.url}
                onChange={(e) => handleUpdate({ url: e.target.value })}
                placeholder="https://api.example.com/endpoint"
              />
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Use {`{{path}}`} to reference previous node data
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>Headers (JSON)</label>
              <textarea
                value={JSON.stringify(localData.headers, null, 2)}
                onChange={(e) => {
                  try {
                    handleUpdate({ headers: JSON.parse(e.target.value) });
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder='{"Content-Type": "application/json"}'
              />
            </div>

            {['POST', 'PUT', 'PATCH'].includes(localData.method) && (
              <div style={{ marginBottom: '16px' }}>
                <label>Body (JSON)</label>
                <textarea
                  value={localData.body ? JSON.stringify(localData.body, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      handleUpdate({ body: e.target.value ? JSON.parse(e.target.value) : null });
                    } catch (err) {
                      // Invalid JSON, don't update
                    }
                  }}
                  placeholder='{"key": "value"}'
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label>Source Node (for variable substitution)</label>
              <select
                value={localData.sourceNodeId || ''}
                onChange={(e) => handleUpdate({ sourceNodeId: e.target.value })}
              >
                <option value="">None</option>
                {nodes
                  .filter((n) => n.id !== node.id)
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.data.label}
                    </option>
                  ))}
              </select>
            </div>
          </>
        );

      case 'transformer':
        return (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label>Label</label>
              <input
                type="text"
                value={localData.label}
                onChange={(e) => handleUpdate({ label: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>Transform Script (JavaScript)</label>
              <textarea
                value={localData.transformScript}
                onChange={(e) => handleUpdate({ transformScript: e.target.value })}
                placeholder="return data.items.map(i => i.name);"
                style={{ minHeight: '120px', fontFamily: 'monospace', fontSize: '12px' }}
              />
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Input data is available as 'data' variable
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>Source Node</label>
              <select
                value={localData.sourceNodeId || ''}
                onChange={(e) => handleUpdate({ sourceNodeId: e.target.value })}
              >
                <option value="">Select source...</option>
                {nodes
                  .filter((n) => n.id !== node.id)
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.data.label}
                    </option>
                  ))}
              </select>
            </div>
          </>
        );

      case 'assertion':
        return (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label>Label</label>
              <input
                type="text"
                value={localData.label}
                onChange={(e) => handleUpdate({ label: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>Source Node</label>
              <select
                value={localData.sourceNodeId || ''}
                onChange={(e) => handleUpdate({ sourceNodeId: e.target.value })}
              >
                <option value="">Select source...</option>
                {nodes
                  .filter((n) => n.id !== node.id)
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.data.label}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>Assertions</label>
              {(localData.assertions || []).map((assertion, index) => (
                <div
                  key={index}
                  style={{
                    background: '#0f172a',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <input
                    type="text"
                    value={assertion.path}
                    onChange={(e) => {
                      const newAssertions = [...localData.assertions];
                      newAssertions[index].path = e.target.value;
                      handleUpdate({ assertions: newAssertions });
                    }}
                    placeholder="data.status"
                    style={{ marginBottom: '8px' }}
                  />
                  <select
                    value={assertion.operator}
                    onChange={(e) => {
                      const newAssertions = [...localData.assertions];
                      newAssertions[index].operator = e.target.value;
                      handleUpdate({ assertions: newAssertions });
                    }}
                    style={{ marginBottom: '8px' }}
                  >
                    <option value="equals">equals</option>
                    <option value="notEquals">not equals</option>
                    <option value="contains">contains</option>
                    <option value="greaterThan">&gt;</option>
                    <option value="lessThan">&lt;</option>
                    <option value="exists">exists</option>
                  </select>
                  <input
                    type="text"
                    value={assertion.expected}
                    onChange={(e) => {
                      const newAssertions = [...localData.assertions];
                      newAssertions[index].expected = e.target.value;
                      handleUpdate({ assertions: newAssertions });
                    }}
                    placeholder="expected value"
                    style={{ marginBottom: '8px' }}
                  />
                  <button
                    className="danger"
                    onClick={() => {
                      const newAssertions = localData.assertions.filter((_, i) => i !== index);
                      handleUpdate({ assertions: newAssertions });
                    }}
                    style={{ width: '100%', fontSize: '12px', padding: '6px' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="secondary"
                onClick={() => {
                  const newAssertions = [
                    ...(localData.assertions || []),
                    { path: '', operator: 'equals', expected: '' },
                  ];
                  handleUpdate({ assertions: newAssertions });
                }}
                style={{ width: '100%' }}
              >
                + Add Assertion
              </button>
            </div>
          </>
        );

      case 'delay':
        return (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label>Label</label>
              <input
                type="text"
                value={localData.label}
                onChange={(e) => handleUpdate({ label: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>Duration (milliseconds)</label>
              <input
                type="number"
                value={localData.duration}
                onChange={(e) => handleUpdate({ duration: parseInt(e.target.value, 10) })}
                min="0"
                step="100"
              />
            </div>
          </>
        );

      default:
        return <p>Unknown node type</p>;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Configure Node</h3>
      </div>

      {renderConfig()}

      <button
        className="danger"
        onClick={() => onDelete(node.id)}
        style={{ 
          width: '100%', 
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <Trash2 size={16} />
        Delete Node
      </button>
    </div>
  );
}

export default NodeConfig;
