# FlowTest - API Workflow Testing Platform

A visual drag-and-drop platform for building and testing API workflows.

## 🎯 Features

- **Visual Workflow Builder** - Drag and drop components on a canvas
- **Multiple Node Types**:
  - **HTTP Request** - Make API calls (GET, POST, PUT, PATCH, DELETE)
  - **Transformer** - Transform response data with JavaScript
  - **Assertion** - Validate API responses
  - **Delay** - Add delays between requests
- **Variable Substitution** - Use `{{path.to.data}}` to reference previous node outputs
- **Real-time Execution** - Run workflows and see results instantly
- **Error Highlighting** - Visual indicators show which nodes succeeded/failed
- **Data Inspector** - View request/response data at each step
- **Workflow Management** - Save and load workflows

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed

### Installation

1. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Start the servers:**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm start
   # Runs on http://localhost:3000

   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   # Runs on http://localhost:5173
   ```

3. **Open your browser:**
   Navigate to http://localhost:5173

## 📖 How to Use

### Building a Workflow

1. **Add Nodes** - Click component buttons in the left sidebar
2. **Connect Nodes** - Drag from the bottom handle of one node to the top of another
3. **Configure Nodes** - Click a node to edit its settings in the right panel
4. **Save Workflow** - Click "Save" in the top toolbar
5. **Execute** - Click "Execute" to run the workflow

### Example Workflow: Fetch User Data

1. **Add HTTP Request Node**
   - Method: `GET`
   - URL: `https://jsonplaceholder.typicode.com/users/1`

2. **Add Transformer Node**
   - Connect from HTTP Request
   - Script: `return { name: data.data.name, email: data.data.email };`

3. **Add Assertion Node**
   - Connect from Transformer
   - Add assertion: `name` `exists` (leave expected empty)

4. **Execute and View Results**
   - Click Execute
   - Check the right panel for detailed results

### Variable Substitution

Reference data from previous nodes using `{{path}}` syntax:

```
# If previous node returned: { "data": { "userId": 123 } }
# You can use: https://api.example.com/users/{{data.userId}}
```

### Transform Scripts

Access previous node data via the `data` variable:

```javascript
// Extract array of names
return data.data.users.map(u => u.name);

// Filter results
return data.data.items.filter(i => i.active);

// Build new structure
return {
  total: data.data.length,
  items: data.data.slice(0, 10)
};
```

### Assertions

Validate API responses:

- **Path**: `data.status` (JSON path to value)
- **Operator**: `equals`, `notEquals`, `contains`, `>`, `<`, `exists`
- **Expected**: The value to compare against

Example assertions:
- `data.status` `equals` `200`
- `data.users` `exists`
- `data.items.length` `greaterThan` `0`

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌──────────────┐
│  React Frontend │ ───> │  Express Backend │ ───> │  SQLite DB   │
│  (Port 5173)    │      │  (Port 3000)     │      │              │
└─────────────────┘      └──────────────────┘      └──────────────┘
     React Flow                Workflow                Workflows
     Components                Execution               Executions
```

### Tech Stack

**Frontend:**
- React 18
- React Flow (visual workflow canvas)
- Vite (build tool)
- Axios (HTTP client)
- Lucide React (icons)

**Backend:**
- Node.js + Express
- better-sqlite3 (database)
- Axios (for executing HTTP requests)

## 📁 Project Structure

```
flowtest/
├── backend/
│   ├── server.js          # Express server + execution engine
│   ├── package.json
│   └── flowtest.db        # SQLite database (auto-created)
│
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main app component
    │   ├── main.jsx       # Entry point
    │   ├── components/
    │   │   ├── HttpRequestNode.jsx
    │   │   ├── TransformerNode.jsx
    │   │   ├── AssertionNode.jsx
    │   │   ├── DelayNode.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── NodeConfig.jsx
    │   │   └── ExecutionPanel.jsx
    │   └── styles/
    │       └── global.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🔌 API Endpoints

### Workflows
- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get single workflow
- `POST /api/workflows` - Create workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow

### Execution
- `POST /api/workflows/:id/execute` - Execute workflow
- `GET /api/workflows/:id/executions` - Get execution history

## 🎨 Customization

### Adding New Node Types

1. **Create the node component** in `frontend/src/components/`
2. **Register it** in `App.jsx` `nodeTypes`
3. **Add backend handler** in `server.js` `executeNode()`
4. **Add to sidebar** in `Sidebar.jsx`

### Styling

Edit `frontend/src/styles/global.css` to customize colors, fonts, spacing.

## 🔒 Security Notes

⚠️ **This is a development/demo tool. Do NOT use in production without:**
- Input sanitization
- Safe JavaScript execution (replace `eval`/`Function` with vm2 or similar)
- Authentication & authorization
- Rate limiting
- HTTPS

## 🐛 Troubleshooting

**Backend not starting?**
- Check if port 3000 is available
- Verify Node.js version: `node -v` (need 18+)

**Frontend not connecting?**
- Check backend is running
- Verify proxy config in `vite.config.js`

**Workflow not executing?**
- Make sure workflow is saved first
- Check browser console for errors
- Verify all nodes have required fields filled

## 📝 License

MIT

## 🤝 Contributing

This is a demo project. Feel free to fork and extend!

---

**Built with ❤️ for API testing**
