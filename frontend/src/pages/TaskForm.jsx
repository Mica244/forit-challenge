import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './TaskForm.css'

function TaskForm (){
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (!id) return;
        fetch(import.meta.env.VITE_API_URL + '/api/tasks/' + id)
        .then((res) => res.json())
        .then ((data) => {
            setTitle(data.title);
            setDescription(data.description);
        })
    }, [id])

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (!title.trim()){
            setError('El titulo es obligatorio')
            return
        }
        if (title.trim().length < 3){
            setError('El titulo debe tener al menos 3 caracteres')
            return
        }
        setError('')
        if(id){
            await fetch(import.meta.env.VITE_API_URL + '/api/tasks/' + id,{
                method: 'PUT',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({ title,description })
            })
        }
        else{
            await fetch(import.meta.env.VITE_API_URL + '/api/tasks',{
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({ title,description })
            })
        }
        navigate('/')
    }

    return (
        <div className="form-container">
            <div className="form-card">
                <button 
                    type="button" 
                    onClick={() => navigate('/')}
                    className="btn-back">
                    ← Volver
                </button>
                <h2>{id ? 'Editar tarea' : 'Nueva tarea'}</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Título"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    {error && <p style={{color:'#000000', fontSize:'0.85rem', marginTop:'-10px', marginBottom:'10px'}}>{error}</p>}
                    <textarea 
                        rows="4" 
                        placeholder="Descripción"
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button type="submit" className="btn-submit">
                        {id ? 'Guardar cambios' : 'Crear tarea'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TaskForm