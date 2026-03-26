import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

const Home = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        setLoading(true);
        const result = await api.getAll();
        
        if (result.success) {
            setIncidents(result.data);
            setStatusMessage({
                type: 'success',
                text: result.message
            });
        } else {
            setStatusMessage({
                type: 'error',
                text: `Ошибка ${result.status}: ${result.message}`
            });
        }
        
        setLoading(false);
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить инцидент?')) return;
        
        const result = await api.delete(id);
        
        if (result.success) {
            setIncidents(incidents.filter(incident => incident.id !== id));
            setStatusMessage({
                type: 'success',
                text: result.message
            });
        } else {
            setStatusMessage({
                type: 'error',
                text: `Ошибка ${result.status}: ${result.message}`
            });
        }
        
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'Высокий': return '#e74c3c';
            case 'Средний': return '#f39c12';
            case 'Низкий': return '#27ae60';
            default: return '#7f8c8d';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'В работе': return '#3498db';
            case 'Завершен': return '#27ae60';
            case 'Требует внимания': return '#e74c3c';
            default: return '#7f8c8d';
        }
    };

    if (loading) {
        return <div className="loading">Загрузка списка инцидентов...</div>;
    }

    return (
        <div className="container">
            <h1>Безопасность в медицинских учреждениях</h1>
            
            {statusMessage && (
                <div className={`status-message status-${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}
            
            <div className="header-actions">
                <Link to="/add" className="btn-add">
                    Добавить инцидент
                </Link>
            </div>
            
            {incidents.length === 0 ? (
                <div className="error">
                    Нет зарегистрированных инцидентов.
                </div>
            ) : (
                <table className="incidents-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Тип</th>
                            <th>Серьезность</th>
                            <th>Дата</th>
                            <th>Место</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map(incident => (
                            <tr key={incident.id}>
                                <td>{incident.id}</td>
                                <td>
                                    <Link to={`/incident/${incident.id}`} className="incident-link">
                                        {incident.title}
                                    </Link>
                                </td>
                                <td>{incident.type}</td>
                                <td>
                                    <span style={{ color: getSeverityColor(incident.severity), fontWeight: 'bold' }}>
                                        {incident.severity}
                                    </span>
                                </td>
                                <td>{incident.date}</td>
                                <td>{incident.location}</td>
                                <td>
                                    <span style={{ color: getStatusColor(incident.status), fontWeight: 'bold' }}>
                                        {incident.status}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => navigate(`/edit/${incident.id}`)}
                                        className="btn-edit"
                                        title="Редактировать"
                                    >
                                        Изменить
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(incident.id)}
                                        className="btn-delete"
                                        title="Удалить"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#7f8c8d', textAlign: 'center' }}>
                <p>Всего инцидентов: {incidents.length}</p>
            </div>
        </div>
    );
};

export default Home;
