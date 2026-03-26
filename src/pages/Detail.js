import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        fetchIncident();
    }, [id]);

    const fetchIncident = async () => {
        setLoading(true);
        const result = await api.getById(id);
        
        if (result.success) {
            setIncident(result.data);
        } else {
            setStatusMessage({
                type: 'error',
                text: `Ошибка ${result.status}: ${result.message}`
            });
        }
        
        setLoading(false);
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
        return <div className="loading">Загрузка информации об инциденте...</div>;
    }

    if (!incident && !loading) {
        return (
            <div className="container">
                <div className="error">
                    Инцидент с ID {id} не найден
                </div>
                <Link to="/" className="btn-back">← Вернуться к списку</Link>
            </div>
        );
    }

    return (
        <div className="detail-container">
            {statusMessage && (
                <div className={`status-message status-${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}
            
            <div className="detail-header">
                <h1>Детальная информация</h1>
                <div className="detail-actions">
                    <Link to={`/edit/${incident.id}`} className="btn-edit">
                        Редактировать
                    </Link>
                    <button onClick={() => navigate('/')} className="btn-back">
                        Назад
                    </button>
                </div>
            </div>
            
            <div className="detail-card">
                <div className="detail-section">
                    <h3>Основная информация</h3>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <strong>ID:</strong> {incident.id}
                        </div>
                        <div className="detail-item">
                            <strong>Название:</strong> {incident.title}
                        </div>
                        <div className="detail-item">
                            <strong>Тип:</strong> {incident.type}
                        </div>
                        <div className="detail-item">
                            <strong>Серьезность:</strong>
                            <span style={{ color: getSeverityColor(incident.severity), fontWeight: 'bold', marginLeft: '5px' }}>
                                {incident.severity}
                            </span>
                        </div>
                        <div className="detail-item">
                            <strong>Дата:</strong> {incident.date}
                        </div>
                        <div className="detail-item">
                            <strong>Место:</strong> {incident.location}
                        </div>
                        <div className="detail-item">
                            <strong>Статус:</strong>
                            <span style={{ color: getStatusColor(incident.status), fontWeight: 'bold', marginLeft: '5px' }}>
                                {incident.status}
                            </span>
                        </div>
                        <div className="detail-item">
                            <strong>Решен:</strong> {incident.resolved ? 'Да' : 'Нет'}
                        </div>
                    </div>
                </div>
                
                <div className="detail-section">
                    <h3>Описание инцидента</h3>
                    <div className="detail-description">
                        {incident.description}
                    </div>
                </div>
                
                <div className="detail-section">
                    <h3>Рекомендации по реагированию</h3>
                    <div className="recommendations">
                        <ul>
                            <li>Немедленно изолировать затронутые системы</li>
                            <li>Уведомить службу информационной безопасности</li>
                            <li>Задокументировать все действия по расследованию</li>
                            <li>Провести анализ причин и разработать меры предотвращения</li>
                            <li>Подготовить отчет для руководства</li>
                        </ul>
                    </div>
                </div>
                
                {incident.status === 'В работе' && (
                    <div className="detail-section">
                        <div style={{ 
                            backgroundColor: '#fff3cd', 
                            padding: '10px', 
                            borderRadius: '4px',
                            border: '1px solid #ffeaa7'
                        }}>
                            <strong>Внимание:</strong> Данный инцидент находится в работе. Требуется мониторинг.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Detail;
