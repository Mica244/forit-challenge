import React from "react"
import { useNavigate } from "react-router-dom"
import './TaskItem.css'

function TaskItem ({task, onDelete}){
    const colors = ['#6c63ff', '#ff6584', '#43aa8b', '#f9844a', '#4cc9f0', '#e63946']
    const color = colors[task.id.charCodeAt(0) % colors.length]
    const navigate = useNavigate()
    const handleDelete = async () =>{
        await fetch (import.meta.env.VITE_API_URL + '/api/tasks/' + task.id,{
            method: 'DELETE'
        })
        onDelete()
        console.log('Tarea eliminada correctamente')
    }

    return (
        <div className="card-section border rounded">
            <div className="task-header" style={{background: `linear-gradient(-90deg, ${color}, ${color}cc)`}}>
                <h5>{task.title}</h5>
            </div>
            <div className="card-body text-center">
                <p className="card-text text-secondary">{task.description}</p>
                <div className="d-flex gap-2 mt-3 justify-content-center">
                    <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate("/edit/" + task.id)}>
                        Editar
                    </button>
                    <button 
                        className="btn btn-danger btn-sm"
                        onClick={handleDelete}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TaskItem