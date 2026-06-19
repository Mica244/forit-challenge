import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

let tasks = []

app.get('/api/tasks', (req, res) => {
    res.json(tasks)
})
app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params
    const task = tasks.find(t => t.id === id)
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' })
    }
    res.json(task)
})
app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body
    if (!title) {
    return res.status(400).json({ error: 'El título es obligatorio' })}

    const newTasks = {
        id: crypto.randomUUID(),
        title: title,
        description: description || '',
        completed: false,
        createdAt: new Date()
    }
    tasks.push(newTasks)
    res.status(201).json(newTasks)
})

app.put('/api/tasks/:id', (req, res) => {
    const id = req.params.id
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1 ){
        res.status(404).json("Elemento no encontrado")
        return
    }
    tasks[index] = { ...tasks[index], ...req.body }
    res.json(tasks[index])
})

app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1 ){
        res.status(404).json("Elemento no encontrado")
        return
    }
    tasks.splice(index, 1)
    res.status(204).send()
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})