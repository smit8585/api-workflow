# FlowTest - Quick Start Guide

## 🚀 Starting the App

```bash
# Option 1: Use the start script
./start.sh

# Option 2: Manual start (2 terminals)
# Terminal 1:
cd backend && npm start

# Terminal 2:
cd frontend && npm run dev
```

**Access the app:** http://localhost:5173

---

## 📝 Creating Your First Workflow

### Step 1: Add an HTTP Request Node
1. Click **"HTTP Request"** in the left sidebar
2. Node appears on canvas
3. Click the node to configure it

### Step 2: Configure the Node
In the right panel:
- **Label:** "Get User"
- **Method:** GET
- **URL:** `https://jsonplaceholder.typicode.com/users/1`

### Step 3: Add an Assertion
1. Click **"Assertion"** in sidebar
2. Drag from bottom of HTTP Request node to top of Assertion node
3. Click Assertion node to configure
4. **Source Node:** Select "Get User"
5. Click **"+ Add Assertion"**
   - Path: `data.status`
   - Operator: `equals`
   - Expected: `200`

### Step 4: Save & Execute
1. Type workflow name at top (e.g., "Test User API")
2. Click **"Save"** button
3. Click **"Execute"** button
4. View results in right panel

---

## 🎯 Common Patterns

### Pattern: Chain Multiple APIs

```
[Get Post] → [Get Comments for that Post]
```

**Get Post:**
- URL: `https://jsonplaceholder.typicode.com/posts/1`

**Get Comments:**
- URL: `https://jsonplaceholder.typicode.com/posts/{{data.data.id}}/comments`
- Source Node: Get Post

### Pattern: Transform & Validate

```
[Get Users] → [Extract Names] → [Assert Count]
```

**Get Users:**
- URL: `https://jsonplaceholder.typicode.com/users`

**Extract Names (Transformer):**
```javascript
return data.data.map(u => u.name);
```

**Assert Count:**
- Path: `length`
- Operator: `greaterThan`
- Expected: `5`

### Pattern: POST with Validation

```
[Create Post] → [Assert Success]
```

**Create Post:**
- Method: POST
- URL: `https://jsonplaceholder.typicode.com/posts`
- Headers:
  ```json
  {"Content-Type": "application/json"}
  ```
- Body:
  ```json
  {"title": "Test", "body": "Content", "userId": 1}
  ```

**Assert Success:**
- Path: `data.status`
- Operator: `equals`
- Expected: `201`

---

## 💡 Tips & Tricks

### Variable Substitution
Use `{{path.to.value}}` in URLs and bodies to reference previous node data:
```
https://api.example.com/users/{{data.data.userId}}
```

### Transformer Scripts
Access previous node data via `data` variable:
```javascript
// Extract specific fields
return {
  id: data.data.id,
  name: data.data.name
};

// Filter array
return data.data.filter(item => item.active);

// Map array
return data.data.map(item => item.id);
```

### Assertion Paths
Use dot notation to access nested values:
- `data.status` - Direct property
- `data.user.email` - Nested property
- `data.items[0].name` - Array element

### Common Assertions
- **Response status:** `data.status` equals `200`
- **Data exists:** `data.data` exists
- **Array not empty:** `data.data.length` greaterThan `0`
- **Contains text:** `data.data.message` contains `success`

---

## 🎨 Keyboard Shortcuts

- **Delete node:** Select node → Delete key
- **Select all:** Ctrl/Cmd + A
- **Zoom in/out:** Mouse wheel
- **Pan canvas:** Click and drag background

---

## 🔧 Troubleshooting

**Workflow won't execute?**
- Make sure workflow is saved first
- Check all nodes have required fields filled

**Node shows error?**
- Click node to see execution result
- Check API URL is correct
- Verify previous node succeeded

**Can't connect nodes?**
- Drag from bottom handle (source) to top handle (target)
- Nodes must be compatible types

**Frontend won't load?**
- Check backend is running on port 3000
- Clear browser cache

---

## 📚 More Resources

- **Full documentation:** See README.md
- **Example workflows:** See DEMO_WORKFLOW.md
- **Project overview:** See PROJECT_SUMMARY.md

---

**Happy testing! 🎯**
