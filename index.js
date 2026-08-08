const express = require('express');
const Database = require('better-sqlite3');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const app = express();
const port = 3000;

// Stage 3: Middleware to parse JSON request bodies
app.use(express.json());

// Stage 5: Server ineractive Swagger UI documentation at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Stage 00: Initialize SQLite Database
const db = new Database('tasks.db');

// Create tasks table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT 0
    )
`);

// Seed example tasks if the table is empty
const countRow = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();
if (countRow.count === 0) {
    const insertTask = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
    insertTask.run('Task 1: Create a hello world server', 1);
    insertTask.run('Task 2: Create root and health endpoints', 1);
    insertTask.run('Task 3: Implement task CRUD operations', 0);
}

app.get('/', (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

// Stage 2: In memory array to store tasks acting as a temporary database
let tasks = [
    {id: 1, title: "Task 1", description: "Create a hello world server", completed: true},
    {id: 2, title: "Task 2", description: "Create root and health endpoints ", completed: true},
    {id: 3, title: "Task 3", description: "Implement task CRUD operations", completed: false}  
];

// Stage 3: Keep track of the next task ID to assign when creating a new task
let nextTaskId = 4;

// Stage 1: root endpoint returns JSON with name, version, and endpoints
app.get('/', (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints:["/tasks"]
    });
}); 

// Stage 1: health check endpoint returns JSON with status and timestamp
app.get('/health', (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

// Stage 2: GET /tasks endpoint returns the list of tasks in JSON format
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Stage 2: GET /tasks/:id endpoint returns a specific task by ID in JSON format
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ 
            error: "Task not found" 
        });
    }

    res.json(task);
});

// Stage 3: POST /tasks endpoint creates a new task and returns it in JSON format
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({  
            error: "Title is required and must be a non-empty string"
        });
    }

    const newTask = {
        id: nextTaskId++, 
        title,
        description: description || "",
        completed: completed || false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Stage 4: PUT /tasks/:id endpoint updates an existing task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    // 404 handling if the task does not exist
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const { title, done, completed } = req.body;
    
    // Check if the body is empty or missing both updateable properties
    const hasTitle = title !== undefined;
    const hasDone = done !== undefined || completed !== undefined;
    
    if (!hasTitle && !hasDone) {
        return res.status(400).json({ error: "Empty or invalid body" });
    }

    // Validate title if it was provided in the payload
    if (hasTitle && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ error: "Title must be a non-empty string" });
    }

    // Normalize incoming done status (accepts either 'done' or 'completed' based on stage docs)
    const newDoneStatus = done !== undefined ? done : completed;

    // Validate boolean status if it was provided
    if (newDoneStatus !== undefined && typeof newDoneStatus !== 'boolean') {
        return res.status(400).json({ error: "Completion status must be a boolean" });
    }

    // Apply updates directly to the record
    if (hasTitle) tasks[taskIndex].title = title;
    if (newDoneStatus !== undefined) {
        tasks[taskIndex].completed = newDoneStatus; // Keeping database property consistent with your array
    }

    res.json(tasks[taskIndex]);
});

// Stage 4: DELETE /tasks/:id endpoint removes a task completely
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    // 404 handling if the task does not exist
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    // Remove item from the local array
    tasks.splice(taskIndex, 1);

    // 204 No Content response carries an empty body
    res.status(204).send();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`Swagger UI documentation available at http://localhost:${port}/docs`);
});
