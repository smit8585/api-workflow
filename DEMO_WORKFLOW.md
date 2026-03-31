# Demo Workflow Examples

## Example 1: Simple API Test

**Goal:** Fetch a user and verify the response

1. **HTTP Request Node**
   - Method: GET
   - URL: `https://jsonplaceholder.typicode.com/users/1`
   
2. **Assertion Node** (connect from HTTP Request)
   - Source: HTTP Request node
   - Assertions:
     - Path: `data.status` | Operator: `equals` | Expected: `200`
     - Path: `data.data.name` | Operator: `exists`
     - Path: `data.data.email` | Operator: `contains` | Expected: `@`

---

## Example 2: Chain Multiple APIs

**Goal:** Fetch a post, then fetch comments for that post

1. **HTTP Request Node #1** - "Get Post"
   - Method: GET
   - URL: `https://jsonplaceholder.typicode.com/posts/1`

2. **HTTP Request Node #2** - "Get Comments"
   - Method: GET
   - URL: `https://jsonplaceholder.typicode.com/posts/{{data.data.id}}/comments`
   - Source Node: Get Post

3. **Assertion Node**
   - Source: Get Comments
   - Assertions:
     - Path: `data.data.length` | Operator: `greaterThan` | Expected: `0`

---

## Example 3: Transform and Validate

**Goal:** Fetch users and extract just names

1. **HTTP Request Node** - "Get Users"
   - Method: GET
   - URL: `https://jsonplaceholder.typicode.com/users`

2. **Transformer Node** - "Extract Names"
   - Source: Get Users
   - Script:
     ```javascript
     return data.data.map(user => ({
       name: user.name,
       username: user.username
     }));
     ```

3. **Assertion Node**
   - Source: Extract Names
   - Assertions:
     - Path: `length` | Operator: `greaterThan` | Expected: `5`

---

## Example 4: POST Request with Body

**Goal:** Create a new post

1. **HTTP Request Node** - "Create Post"
   - Method: POST
   - URL: `https://jsonplaceholder.typicode.com/posts`
   - Headers:
     ```json
     {
       "Content-Type": "application/json"
     }
     ```
   - Body:
     ```json
     {
       "title": "Test Post",
       "body": "This is a test",
       "userId": 1
     }
     ```

2. **Assertion Node**
   - Source: Create Post
   - Assertions:
     - Path: `data.status` | Operator: `equals` | Expected: `201`
     - Path: `data.data.id` | Operator: `exists`

---

## Example 5: Rate Limiting with Delay

**Goal:** Make multiple requests with delays

1. **HTTP Request #1**
   - URL: `https://jsonplaceholder.typicode.com/posts/1`

2. **Delay Node**
   - Duration: `2000` (2 seconds)

3. **HTTP Request #2**
   - URL: `https://jsonplaceholder.typicode.com/posts/2`

---

## Tips

- **Use JSONPlaceholder** (https://jsonplaceholder.typicode.com) for testing - it's a free fake API
- **Chain nodes** by connecting their handles
- **Reference previous data** with `{{path.to.value}}`
- **Test incrementally** - add one node, test, then add more
- **Check execution results** in the right panel after running

---

Happy testing! 🚀
