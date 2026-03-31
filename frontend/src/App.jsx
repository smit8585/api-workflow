import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { Play, Save, FileJson, Plus } from 'lucide-react';

import HttpRequestNode from './components/HttpRequestNode';
import TransformerNode from './components/TransformerNode';
import AssertionNode from './components/AssertionNode';
import DelayNode from './components/DelayNode';
import Sidebar from './components/Sidebar';
import NodeConfig from './components/NodeConfig';
import ExecutionPanel from './components/ExecutionPanel';

const nodeTypes = {
  httpRequest: HttpRequestNode,
  transformer: TransformerNode,
  assertion: AssertionNode,
  delay: DelayNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [executionResults, setExecutionResults] = useState(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowId, setWorkflowId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: getDefaultNodeData(type),
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const getDefaultNodeData = (type) => {
    switch (type) {
      case 'httpRequest':
        return {
          label: 'HTTP Request',
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          headers: {},
          body: null,
        };
      case 'transformer':
        return {
          label: 'Transformer',
          transformScript: 'return data;',
        };
      case 'assertion':
        return {
          label: 'Assertion',
          assertions: [],
        };
      case 'delay':
        return {
          label: 'Delay',
          duration: 1000,
        };
      default:
        return { label: 'Node' };
    }
  };

  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  };

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  };

  const saveWorkflow = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: workflowName,
        description: '',
        nodes,
        edges,
      };

      if (workflowId) {
        await axios.put(`/api/workflows/${workflowId}`, payload);
      } else {
        const response = await axios.post('/api/workflows', payload);
        setWorkflowId(response.data.id);
      }
      
      alert('Workflow saved successfully!');
    } catch (error) {
      alert('Error saving workflow: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const executeWorkflow = async () => {
    if (!workflowId) {
      alert('Please save the workflow first');
      return;
    }

    setIsExecuting(true);
    setExecutionResults(null);
    
    try {
      const response = await axios.post(`/api/workflows/${workflowId}/execute`);
      setExecutionResults(response.data.results);
      
      // Update nodes with execution status
      setNodes((nds) =>
        nds.map((node) => {
          const result = response.data.results[node.id];
          return {
            ...node,
            data: {
              ...node.data,
              executionResult: result,
            },
          };
        })
      );
    } catch (error) {
      alert('Error executing workflow: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const loadWorkflow = async (id) => {
    try {
      const response = await axios.get(`/api/workflows/${id}`);
      const workflow = response.data;
      
      setWorkflowId(workflow.id);
      setWorkflowName(workflow.name);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      setExecutionResults(null);
    } catch (error) {
      alert('Error loading workflow: ' + error.message);
    }
  };

  const newWorkflow = () => {
    setWorkflowId(null);
    setWorkflowName('Untitled Workflow');
    setNodes([]);
    setEdges([]);
    setExecutionResults(null);
    setSelectedNode(null);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <Sidebar onAddNode={addNode} onLoadWorkflow={loadWorkflow} onNewWorkflow={newWorkflow} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          height: '60px',
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '12px'
        }}>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            style={{ 
              width: '300px',
              background: '#0f172a',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600'
            }}
          />
          <div style={{ flex: 1 }} />
          <button onClick={saveWorkflow} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={executeWorkflow} disabled={isExecuting || !workflowId} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Play size={16} />
            {isExecuting ? 'Running...' : 'Execute'}
          </button>
        </div>

        {/* Main Flow Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap
              style={{ background: '#1e293b' }}
              nodeColor="#334155"
              maskColor="rgba(15, 23, 42, 0.8)"
            />
            <Background variant="dots" gap={12} size={1} color="#334155" />
          </ReactFlow>
        </div>
      </div>

      {/* Right Panel - Node Config or Execution Results */}
      <div style={{
        width: '350px',
        background: '#1e293b',
        borderLeft: '1px solid #334155',
        overflowY: 'auto'
      }}>
        {selectedNode ? (
          <NodeConfig
            node={selectedNode}
            onUpdate={updateNodeData}
            onDelete={deleteNode}
            nodes={nodes}
          />
        ) : executionResults ? (
          <ExecutionPanel results={executionResults} nodes={nodes} />
        ) : (
          <div style={{ padding: '20px', color: '#64748b', textAlign: 'center', marginTop: '40px' }}>
            <FileJson size={48} style={{ margin: '0 auto 16px' }} />
            <p>Select a node to configure</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>or execute the workflow to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
