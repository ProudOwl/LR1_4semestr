import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

const Form = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        severity: 'Средний',
        date: new Date().toISOString().split('T')[0],
        location: '',
        description: '',
        status: 'В работе',
        resolved: false
    });

    const incidentTypes = [
        'Несанкционированный доступ',
        'Утечка данных',
        'Физическое нарушение',
        'Вирусная атака',
        'Ошибка персонала',
        'Отказ оборудования',
        'Другое'
    ];

    const severityLevels = ['Высокий', 'Средний', 'Низкий'];
    const statuses = ['В работе', 'Завершен', 'Требует внимания'];

    useEffect(() => {
        if (id) {
            fetchIncident();
        }
    }, [id]);

    const fetchIncident = async () => {
        setLoading(true);
        const result = await api.getById(id);
        
        if (result.success) {
            setFormData(result.data);
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setStatusMessage({
                type: 'error',
                text: 'Ошибка: Название инцидента обязательно'
            });
            setTimeout(() => setStatusMessage(null), 3000);
            return false;
        }
        
        if (!formData.type) {
            setStatusMessage({
                type: 'error',
                text: 'Ошибка: Выберите тип инцидента'
            });
            setTimeout(() => setStatusMessage(null), 3000);
            return false;
        }
        
        if (!formData.location.trim()) {
            setStatusMessage({
                type: 'error',
                text: 'Ошибка: Укажите место происшествия'
            });
            setTimeout(() => setStatusMessage(null), 3000);
            return false;
        }
        
        if (!formData.description.trim()) {
            setStatusMessage({
                type: 'error',
                text: 'Ошибка: Описание инцидента обязательно'
            });
            setTimeout(() => setStatusMessage(null), 3000);
            return false;
        }
        
        if (formData.description.trim().length < 10) {
            setStatusMessage({
                type: 'error',
                text: 'Ошибка: Описание должно содержать минимум 10 символов'
            });
            setTimeout(() => setStatusMessage(null), 3000);
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        
        // Создаем объект для отправки
        const incidentToSend = {
            title: formData.title,
            type: formData.type,
            severity: formData.severity,
            date: formData.date,
            location: formData.location,
            description: formData.description,
            status: formData.status,
            resolved: formData.resolved
        };
        
        let result;
        if (id) {
            // PUT - обновление существующего
            result = await api.update(id, incidentToSend);
        } else {
            // POST - создание нового
            result = await api.create(incidentToSend);
        }
        
        if (result.success) {
            setStatusMessage({
                type: 'success',
                text: result.message
            });
            setTimeout(() => navigate('/'), 1500);
        } else {
            setStatusMessage({
                type: 'error',
                text: `Ошибка ${result.status}: ${result.message}`
            });
            setLoading(false);
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    if (loading && id) {
        return <div className="loading">Загрузка данных инцидента...</div>;
    }

    return (
        <div className="form-container">
            <h1>{id ? 'Редактирование инцидента' : 'Добавление нового инцидента'}</h1>
            
            {statusMessage && (
                <div className={`status-message status-${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="incident-form">
                <div className="form-group">
                    <label>Название инцидента *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Введите краткое название инцидента"
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label>Тип инцидента *</label>
                    <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="">Выберите тип инцидента</option>
                        {incidentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Серьезность</label>
                        <select 
                            name="severity" 
                            value={formData.severity} 
                            onChange={handleChange}
                            disabled={loading}
                        >
                            {severityLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Дата происшествия</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Место происшествия *</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Например: Кардиологическое отделение, 3-й этаж"
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label>Описание инцидента *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Подробно опишите, что произошло, кто участвовал, какие последствия..."
                        disabled={loading}
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label>Статус расследования</label>
                    <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange}
                        disabled={loading}
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="resolved"
                            checked={formData.resolved}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        Инцидент решен
                    </label>
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate('/')} 
                        className="btn-cancel"
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="btn-submit"
                    >
                        {loading ? 'Сохранение...' : (id ? 'Обновить' : 'Создать')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;
