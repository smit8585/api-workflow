import React from 'react';
import { Handle, Position } from 'reactflow';
import { Globe } from 'lucide-react';

function HttpRequestNode({ data }) {
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
        <Globe size={16} color="#3b82f6" />
        <strong>{data.label}</strong>
      </div>
      
      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
        <div style={{ 
          background: '#0f172a', 
          padding: '4px 8px', 
          borderRadius: '4px',
          marginBottom: '4px',
          fontWeight: '600'
        }}>
          {data.method}
        </div>
        <div style={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {data.url}
        </div>
      </div>

      {data.executionResult && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '11px',
          color: data.executionResult.success ? '#10b981' : '#ef4444'
        }}>
          {data.executionResult.success 
            ? `✓ ${data.executionResult.data.status}` 
            : `✗ ${data.executionResult.error}`
          }
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default HttpRequestNode;
