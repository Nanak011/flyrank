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

app.get('/tasks', (req, res) => {
    const rows = db.prepare('SELECT id, title, done FROM tasks').all();
    const formattedTasks = rows.map(task => ({
        id: task.id,
        title: task.title,
        completed: Boolean(task.done)
    }));
    res.json(formattedTasks);
});

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

app.post('/tasks', (req, res) => {
    const { title, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({  
            error: "Title is required and must be a non-empty string"
        });
    }

    const isDone = completed ? 1 : 0;
    const stmt = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
    const result = stmt.run(title.trim(), isDone);

    const newTask = {
        id: result.lastInsertRowid,
        title: title.trim(),
        completed: Boolean(isDone)
    };

    res.status(201).json(newTask);
});

// Stage 3: PUT /tasks/:id - Update existing task in SQLite
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!existingTask) {
        return res.status(404).json({ error: "Task not found" });
    }

    const { title, done, completed } = req.body;
    
    const hasTitle = title !== undefined;
    const hasDone = done !== undefined || completed !== undefined;
    
    if (!hasTitle && !hasDone) {
        return res.status(400).json({ error: "Empty or invalid body" });
    }

    if (hasTitle && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ error: "Title must be a non-empty string" });
    }

    const newDoneStatus = done !== undefined ? done : completed;

    if (newDoneStatus !== undefined && typeof newDoneStatus !== 'boolean') {
        return res.status(400).json({ error: "Completion status must be a boolean" });
    }

    const updatedTitle = hasTitle ? title.trim() : existingTask.title;
    const updatedDone = newDoneStatus !== undefined ? (newDoneStatus ? 1 : 0) : existingTask.done;

    db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(updatedTitle, updatedDone, taskId);

    res.json({
        id: taskId,
        title: updatedTitle,
        completed: Boolean(updatedDone)
    });
});

// Stage 3: DELETE /tasks/:id - Remove task from SQLite
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!existingTask) {
        return res.status(404).json({ error: "Task not found" });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);

    res.status(204).send();
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(`SQLite database connected (tasks.db)`);
    console.log(`Swagger UI documentation available at http://localhost:${port}/docs`);
});