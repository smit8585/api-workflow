import React from 'react';
import { Handle, Position } from 'reactflow';
import { CheckCircle } from 'lucide-react';

function AssertionNode({ data }) {
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
        <CheckCircle size={16} color="#10b981" />
        <strong>{data.label}</strong>
      </div>
      
      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
        {data.assertions?.length || 0} assertion(s)
      </div>

      {data.executionResult && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '11px',
          color: data.executionResult.success ? '#10b981' : '#ef4444'
        }}>
          {data.executionResult.success ? '✓ All passed' : `✗ ${data.executionResult.error}`}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default AssertionNode;
