import React from 'react';
import { Handle, Position } from 'reactflow';
import { Clock } from 'lucide-react';

function DelayNode({ data }) {
  const getStatusIndicator = () => {
    if (!data.executionResult) return null;
    return (
      <div className={`node-status ${data.executionResult.success ? 'success' : 'error'}`} />
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {getStatusIndicator()}
      <Handle type="target" position={Position.Top} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Clock size={16} color="#f59e0b" />
        <strong>{data.label}</strong>
      </div>
      
      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
        Wait {data.duration}ms
      </div>

      {data.executionResult && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '11px',
          color: '#10b981'
        }}>
          ✓ Completed
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default DelayNode;
