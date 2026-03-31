import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
}

// Initialize SQLite database
const db = new Database('flowtest.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS workflows (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    nodes TEXT NOT NULL,
    edges TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS executions (
    id TEXT PRIMARY KEY,
    workflow_id TEXT NOT NULL,
    status TEXT NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    results TEXT,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id)
  );
`);

// Routes

// Get all workflows
app.get('/api/workflows', (req, res) => {
  try {
    const workflows = db.prepare('SELECT * FROM workflows ORDER BY updated_at DESC').all();
    res.json(workflows.map(w => ({
      ...w,
      nodes: JSON.parse(w.nodes),
      edges: JSON.parse(w.edges)
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single workflow
app.get('/api/workflows/:id', (req, res) => {
  try {
    const workflow = db.prepare('SELECT * FROM workflows WHERE id = ?').get(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({
      ...workflow,
      nodes: JSON.parse(workflow.nodes),
      edges: JSON.parse(workflow.edges)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create workflow
app.post('/api/workflows', (req, res) => {
  try {
    const { name, description, nodes, edges } = req.body;
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO workflows (id, name, description, nodes, edges)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, name, description || '', JSON.stringify(nodes), JSON.stringify(edges));
    
    res.status(201).json({ id, name, description, nodes, edges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update workflow
app.put('/api/workflows/:id', (req, res) => {
  try {
    const { name, description, nodes, edges } = req.body;
    
    const stmt = db.prepare(`
      UPDATE workflows 
      SET name = ?, description = ?, nodes = ?, edges = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(name, description || '', JSON.stringify(nodes), JSON.stringify(edges), req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json({ id: req.params.id, name, description, nodes, edges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete workflow
app.delete('/api/workflows/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM workflows WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json({ message: 'Workflow deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute workflow
app.post('/api/workflows/:id/execute', async (req, res) => {
  const workflowId = req.params.id;
  const executionId = uuidv4();
  
  try {
    // Get workflow
    const workflow = db.prepare('SELECT * FROM workflows WHERE id = ?').get(workflowId);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    const nodes = JSON.parse(workflow.nodes);
    const edges = JSON.parse(workflow.edges);
    
    // Create execution record
    db.prepare(`
      INSERT INTO executions (id, workflow_id, status)
      VALUES (?, ?, 'running')
    `).run(executionId, workflowId);
    
    // Execute workflow
    const results = await executeWorkflow(nodes, edges);
    
    // Update execution record
    db.prepare(`
      UPDATE executions 
      SET status = ?, completed_at = CURRENT_TIMESTAMP, results = ?
      WHERE id = ?
    `).run('completed', JSON.stringify(results), executionId);
    
    res.json({ executionId, results });
  } catch (error) {
    // Update execution record with error
    db.prepare(`
      UPDATE executions 
      SET status = ?, completed_at = CURRENT_TIMESTAMP, results = ?
      WHERE id = ?
    `).run('failed', JSON.stringify({ error: error.message }), executionId);
    
    res.status(500).json({ error: error.message });
  }
});

// Get execution history
app.get('/api/workflows/:id/executions', (req, res) => {
  try {
    const executions = db.prepare(`
      SELECT * FROM executions 
      WHERE workflow_id = ? 
      ORDER BY started_at DESC 
      LIMIT 50
    `).all(req.params.id);
    
    res.json(executions.map(e => ({
      ...e,
      results: e.results ? JSON.parse(e.results) : null
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Workflow execution engine
async function executeWorkflow(nodes, edges) {
  const nodeResults = {};
  const executionOrder = getExecutionOrder(nodes, edges);
  
  for (const nodeId of executionOrder) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) continue;
    
    try {
      const startTime = Date.now();
      const result = await executeNode(node, nodeResults);
      const duration = Date.now() - startTime;
      
      nodeResults[nodeId] = {
        success: true,
        data: result,
        duration,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      nodeResults[nodeId] = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      // Stop execution on error (you could make this configurable)
      break;
    }
  }
  
  return nodeResults;
}

// Execute individual node based on type
async function executeNode(node, previousResults) {
  const { type, data } = node;
  
  switch (type) {
    case 'httpRequest':
      return await executeHttpRequest(data, previousResults);
    
    case 'transformer':
      return executeTransformer(data, previousResults);
    
    case 'assertion':
      return executeAssertion(data, previousResults);
    
    case 'delay':
      return await executeDelay(data);
    
    case 'conditional':
      return executeConditional(data, previousResults);
    
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

// Execute HTTP request node
async function executeHttpRequest(data, previousResults) {
  const { method, url, headers, body, sourceNodeId } = data;
  
  // Replace variables from previous node results
  let processedUrl = url;
  let processedBody = body;
  
  if (sourceNodeId && previousResults[sourceNodeId]) {
    const sourceData = previousResults[sourceNodeId].data;
    processedUrl = replaceVariables(url, sourceData);
    if (processedBody) {
      processedBody = replaceVariables(JSON.stringify(processedBody), sourceData);
      processedBody = JSON.parse(processedBody);
    }
  }
  
  const response = await axios({
    method: method.toLowerCase(),
    url: processedUrl,
    headers: headers || {},
    data: processedBody,
    validateStatus: () => true // Don't throw on any status
  });
  
  return {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: response.data
  };
}

// Execute data transformer
function executeTransformer(data, previousResults) {
  const { sourceNodeId, transformScript } = data;
  
  if (!sourceNodeId || !previousResults[sourceNodeId]) {
    throw new Error('No source data available');
  }
  
  const sourceData = previousResults[sourceNodeId].data;
  
  // Simple transformation using eval (in production, use a safe sandbox like vm2)
  try {
    const transformFn = new Function('data', transformScript);
    return transformFn(sourceData);
  } catch (error) {
    throw new Error(`Transform error: ${error.message}`);
  }
}

// Execute assertion
function executeAssertion(data, previousResults) {
  const { sourceNodeId, assertions } = data;
  
  if (!sourceNodeId || !previousResults[sourceNodeId]) {
    throw new Error('No source data available');
  }
  
  const sourceData = previousResults[sourceNodeId].data;
  const results = [];
  
  for (const assertion of assertions) {
    const { path, operator, expected } = assertion;
    const actual = getValueByPath(sourceData, path);
    const passed = evaluateAssertion(actual, operator, expected);
    
    results.push({
      path,
      operator,
      expected,
      actual,
      passed
    });
    
    if (!passed) {
      throw new Error(`Assertion failed: ${path} ${operator} ${expected}, got ${actual}`);
    }
  }
  
  return { assertions: results, allPassed: true };
}

// Execute delay
function executeDelay(data) {
  const { duration } = data;
  return new Promise(resolve => setTimeout(() => resolve({ delayed: duration }), duration));
}

// Execute conditional
function executeConditional(data, previousResults) {
  const { sourceNodeId, condition } = data;
  
  if (!sourceNodeId || !previousResults[sourceNodeId]) {
    throw new Error('No source data available');
  }
  
  const sourceData = previousResults[sourceNodeId].data;
  
  try {
    const conditionFn = new Function('data', `return ${condition}`);
    const result = conditionFn(sourceData);
    return { condition, result: !!result };
  } catch (error) {
    throw new Error(`Condition error: ${error.message}`);
  }
}

// Helper: Get execution order (topological sort)
function getExecutionOrder(nodes, edges) {
  const graph = new Map();
  const inDegree = new Map();
  
  // Initialize
  nodes.forEach(node => {
    graph.set(node.id, []);
    inDegree.set(node.id, 0);
  });
  
  // Build graph
  edges.forEach(edge => {
    graph.get(edge.source).push(edge.target);
    inDegree.set(edge.target, inDegree.get(edge.target) + 1);
  });
  
  // Topological sort (Kahn's algorithm)
  const queue = [];
  const result = [];
  
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) queue.push(nodeId);
  });
  
  while (queue.length > 0) {
    const nodeId = queue.shift();
    result.push(nodeId);
    
    graph.get(nodeId).forEach(neighbor => {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }
  
  return result;
}

// Helper: Replace variables in string
function replaceVariables(str, data) {
  return str.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    return getValueByPath(data, path.trim()) || match;
  });
}

// Helper: Get value by path (e.g., "data.user.name")
function getValueByPath(obj, path) {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
}

// Helper: Evaluate assertion
function evaluateAssertion(actual, operator, expected) {
  switch (operator) {
    case 'equals':
      return actual === expected;
    case 'notEquals':
      return actual !== expected;
    case 'contains':
      return String(actual).includes(expected);
    case 'greaterThan':
      return Number(actual) > Number(expected);
    case 'lessThan':
      return Number(actual) < Number(expected);
    case 'exists':
      return actual !== undefined && actual !== null;
    default:
      return false;
  }
}

// Catch-all route to serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 FlowTest running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
