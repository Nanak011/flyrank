const express = require('express');
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});