import { useState, useEffect} from 'react'
import TaskItem from '../components/TaskItem'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import './TaskList.css'

function TaskList (){
    const [tasks, setTasks] = useState([])

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
                    <Link to="/create" className="btn-new">+ Nueva tarea</Link>
                </div>
            </div>
            <div className="tasks-grid">
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} onDelete={fetchTasks}/>
                ))}
            </div>
            {tasks.length === 0 && <p className="empty-message">No hay tareas todavía</p>}
            <Footer />
        </div>
    )
}

export default TaskList