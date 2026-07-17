const express = require('express');
const app = express();
const port = 3000;

// Stage 3: Middleware to parse JSON request bodies
app.use(express.json());

//   Stage 0 print hello world
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });


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
    // Error handling: If the task is not found, return a 404 status code with an error message
    if (!task) {
        return res.status(404).json({ 
            error: "Task not found" 
        });
    }

    // If the task is found, return it in JSON format
    res.json(task);
});

// Stage 3: POST /tasks endpoint creates a new task and returns it in JSON format
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;

    // Validate if title is missing, not a string, or an empty string
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({  
            error: "Title is required and must be a non-empty string"
        });
    }

    // Create a new task object with the next available ID
    const newTask = {
        id: nextTaskId++, 
        title,
        description: description || "",
        completed: completed || false
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Return the newly created task in JSON format with a 201 status code
    res.status(201).json(newTask);
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});