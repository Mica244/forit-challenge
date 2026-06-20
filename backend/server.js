import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Database from 'better-sqlite3'

dotenv.config()

const db = new Database('tasks.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        createdAt TEXT
    )
`)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks').all()
    res.json(tasks)
})

app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' })
    }
    res.json(task)
})

app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body
    if (!title) {
        return res.status(400).json({ error: 'El título es obligatorio' })
    }
    const newTask = {
        id: crypto.randomUUID(),
        title: title,
        description: description || '',
        completed: 0,
        createdAt: new Date().toISOString()
    }
    db.prepare('INSERT INTO tasks (id, title, description, completed, createdAt) VALUES (?, ?, ?, ?, ?)').run(
        newTask.id, newTask.title, newTask.description, newTask.completed, newTask.createdAt
    )
    res.status(201).json(newTask)
})

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' })
    }
    const { title, description, completed } = req.body
    db.prepare('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?').run(
        title ?? task.title,
        description ?? task.description,
        completed !== undefined ? (completed ? 1 : 0) : task.completed,
        id
    )
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
    res.json(updatedTask)
})

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' })
    }
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
    res.status(204).send()
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})