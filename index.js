require('dotenv').config({ quiet: true });
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const { taskRepository, ensureSchemaAndSeed } = require('./repository.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.get('/tasks', async (req, res) => {
    const rows = await taskRepository.getAll();
    const formattedTasks = rows.map(task => ({
        id: task.id,
        title: task.title,
        completed: Boolean(task.done)
    }));
    res.json(formattedTasks);
});

app.get('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = await taskRepository.getById(taskId);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.json({
        id: task.id,
        title: task.title,
        completed: Boolean(task.done)
    });
});

app.post('/tasks', async (req, res) => {
    const { title, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
            error: "Title is required and must be a non-empty string"
        });
    }

    const isDone = Boolean(completed);
    const newTask = await taskRepository.create(title.trim(), isDone);

    res.status(201).json({
        id: newTask.id,
        title: newTask.title,
        completed: Boolean(newTask.done)
    });
});

// Stage 3: PUT /tasks/:id - Update existing task in Postgres
app.put('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);

    const existingTask = await taskRepository.getById(taskId);
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
    const updatedDone = newDoneStatus !== undefined ? newDoneStatus : existingTask.done;

    const updated = await taskRepository.update(taskId, updatedTitle, updatedDone);

    res.json({
        id: updated.id,
        title: updated.title,
        completed: Boolean(updated.done)
    });
});

// Stage 3: DELETE /tasks/:id - Remove task from Postgres
app.delete('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);

    const existingTask = await taskRepository.getById(taskId);
    if (!existingTask) {
        return res.status(404).json({ error: "Task not found" });
    }

    await taskRepository.remove(taskId);

    res.status(204).send();
});

async function start() {
    await ensureSchemaAndSeed();
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
        console.log(`Postgres database connected`);
        console.log(`Swagger UI documentation available at http://localhost:${port}/docs`);
    });
}

start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

module.exports = { app };
