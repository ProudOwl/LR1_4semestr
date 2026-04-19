import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../App.css';

const Home = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const [filters, setFilters] = useState({
    title: '',
    type: '',
    severity: '',
    location: '',
    status: ''
  });

  const [typeOptions, setTypeOptions] = useState([]);
  const [severityOptions, setSeverityOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  const fetchIncidents = async () => {
    setLoading(true);
    const result = await api.getAll();
    if (result.success) {
      setIncidents(result.data);
      setFilteredIncidents(result.data);
      
      const types = [...new Set(result.data.map(item => item.type).filter(Boolean))];
      const severities = [...new Set(result.data.map(item => item.severity).filter(Boolean))];
      const statuses = [...new Set(result.data.map(item => item.status).filter(Boolean))];
      const locations = [...new Set(result.data.map(item => item.location).filter(Boolean))];
      
      setTypeOptions(types);
      setSeverityOptions(severities);
      setStatusOptions(statuses);
      setLocationOptions(locations);
    } else {
      setError(result.message);
      setStatusMessage({ type: 'error', text: result.message });
      setTimeout(() => setStatusMessage(null), 5000);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const applyFilters = () => {
    let filtered = [...incidents];
    
    if (filters.title.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }
    
    if (filters.severity) {
      filtered = filtered.filter(item => item.severity === filters.severity);
    }
    
    if (filters.location) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    
    setFilteredIncidents(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    applyFilters();
  }, [filters, incidents]);

  const clearFilters = () => {
    setFilters({
      title: '',
      type: '',
      severity: '',
      location: '',
      status: ''
    });
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Вы уверены, что хотите удалить инцидент "${title}"?`)) {
      const result = await api.delete(id);
      if (result.success) {
        setStatusMessage({ type: 'success', text: result.message });
        fetchIncidents(); // Перезагружаем список
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage({ type: 'error', text: result.message });
        setTimeout(() => setStatusMessage(null), 5000);
      }
    }
  };

  if (loading) {
    return <div className="loading">Загрузка инцидентов...</div>;
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
        <button className="btn-add" onClick={() => navigate('/add')}>
          + Добавить инцидент
        </button>
      </div>

      <div className="filters-container">
        <h3>Фильтры</h3>
        <div className="filters-row">
          <div className="filter-group">
            <label>Название</label>
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Тип</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Все</option>
              {typeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Уровень</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
            >
              <option value="">Все</option>
              {severityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Местоположение</label>
            <input
              type="text"
              placeholder="Поиск по местоположению..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              list="location-list"
            />
            <datalist id="location-list">
              {locationOptions.map(option => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <div className="filter-group">
            <label>Статус</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Все</option>
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="filter-group filter-actions">
            <label>&nbsp;</label>
            <button className="btn-clear-filters" onClick={clearFilters}>
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      <div className="records-info">
        Найдено записей: {filteredIncidents.length} из {incidents.length}
      </div>

      {filteredIncidents.length === 0 ? (
        <div className="no-data">Нет данных, соответствующих фильтрам</div>
      ) : (
        <table className="incidents-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Уровень</th>
              <th>Дата</th>
              <th>Местоположение</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((incident) => (
              <tr key={incident.id}>
                <td>
                  <a 
                    href={`/incident/${incident.id}`} 
                    className="incident-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/incident/${incident.id}`);
                    }}
                  >
                    {incident.title}
                  </a>
                </td>
                <td>{incident.type}</td>
                <td>
                  <span className={`severity-badge severity-${incident.severity?.toLowerCase()}`}>
                    {incident.severity}
                  </span>
                </td>
                <td>{incident.date}</td>
                <td>{incident.location}</td>
                <td>
                  <span className={`status-badge status-${incident.status?.toLowerCase().replace(' ', '-')}`}>
                    {incident.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button 
                    className="btn-edit"
                    onClick={() => navigate(`/edit/${incident.id}`)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(incident.id, incident.title)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;
