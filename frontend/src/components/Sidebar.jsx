import React, { useState, useEffect } from 'react';
import { Globe, Wand2, CheckCircle, Clock, Plus, FileJson, FolderOpen } from 'lucide-react';
import axios from 'axios';

function Sidebar({ onAddNode, onLoadWorkflow, onNewWorkflow }) {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await axios.get('/api/workflows');
      setWorkflows(response.data);
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  };

  const nodeTypes = [
    { type: 'httpRequest', label: 'HTTP Request', icon: Globe, color: '#3b82f6' },
    { type: 'transformer', label: 'Transformer', icon: Wand2, color: '#a855f7' },
    { type: 'assertion', label: 'Assertion', icon: CheckCircle, color: '#10b981' },
    { type: 'delay', label: 'Delay', icon: Clock, color: '#f59e0b' },
  ];

  return (
    <div style={{
      width: '280px',
      background: '#1e293b',
      borderRight: '1px solid #334155',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #334155' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
          FlowTest
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b' }}>
          API Workflow Testing Platform
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        <button 
          onClick={onNewWorkflow}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Plus size={16} />
          New Workflow
        </button>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Components
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nodeTypes.map((node) => (
              <button
                key={node.type}
                onClick={() => onAddNode(node.type)}
                className="secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  justifyContent: 'flex-start',
                  padding: '10px 12px'
                }}
              >
                <node.icon size={18} color={node.color} />
                <span>{node.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Saved Workflows
          </h3>
          {workflows.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
              No saved workflows yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {workflows.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => onLoadWorkflow(workflow.id)}
                  className="secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'flex-start',
                    padding: '8px 10px',
                    fontSize: '13px'
                  }}
                >
                  <FileJson size={14} />
                  <span style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    textAlign: 'left'
                  }}>
                    {workflow.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
