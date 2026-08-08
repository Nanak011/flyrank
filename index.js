const express = require('express');
const Database = require('better-sqlite3');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const db = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0
  )
`);

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

// Stage 1: GET /tasks - Fetch all tasks from SQLite
app.get('/tasks', (req, res) => {
    const rows = db.prepare('SELECT id, title, done FROM tasks').all();
    const formattedTasks = rows.map(task => ({
        id: task.id,
        title: task.title,
        completed: Boolean(task.done)
    }));
    res.json(formattedTasks);
});

// Stage 1: GET /tasks/:id - Fetch single task by ID from SQLite
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(taskId);
    
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.json({
        id: task.id,
        title: task.title,
        completed: Boolean(task.done)
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(`SQLite database connected (tasks.db)`);
});