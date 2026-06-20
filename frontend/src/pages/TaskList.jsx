import { useState, useEffect} from 'react'
import TaskItem from '../components/TaskItem'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import './TaskList.css'

function TaskList (){
    const [tasks, setTasks] = useState([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')

    const filteredTasks = tasks
        .filter(task => {
            if (filter === 'completed') return task.completed
            if (filter === 'pending') return !task.completed
            return true

        })
        .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))

    const fetchTasks = () => {
        fetch(import.meta.env.VITE_API_URL + '/api/tasks')
        .then((res) => res.json())
        .then((data) => {
            setTasks(data)
        })
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
        <div className="task-list-container">
            <div className="task-list-hero">
                <div className="task-list-header">
                    <h1>Mis tareas</h1>
                    <div className="task-counter">
                        <span> {tasks.length} Tarea/s</span>
                        <span> {tasks.filter(t => t.completed).length} Completada/s</span>
                        <span> {tasks.filter(t => !t.completed).length} Pendiente/s</span>
                    </div>
                    <Link to="/create" className="btn-new">+ Nueva tarea</Link>
                </div>
            </div>
            <div className="search-filter">
            <input 
                    type="text" 
                    placeholder="Buscar tarea..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-buttons">
                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Todas</button>
                <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Pendientes</button>
                <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completadas</button>
            </div>
            </div>
            <div className="tasks-grid">
                {filteredTasks.map((task) => (
                    <TaskItem key={task.id} task={task} onDelete={fetchTasks}/>
                ))}
            </div>
            {filteredTasks.length === 0 && filter === 'all' && <p className="empty-message">No hay tareas todavía</p>}
            {filteredTasks.length === 0 && filter === 'pending' && <p className="empty-message">No tenés ninguna tarea pendiente </p>}
            {filteredTasks.length === 0 && filter === 'completed' && <p className="empty-message">No completaste ninguna tarea todavía</p>}
            <Footer />
        </div>
    )
}

export default TaskList