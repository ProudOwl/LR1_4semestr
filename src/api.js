import axios from 'axios';

const API_URL = 'http://localhost:5000/incidents';

// Функция для обработки успешных ответов
const handleResponse = (response) => {
    const status = response.status;
    
    switch(status) {
        case 200:
            console.log('Успешно (200): Данные получены');
            break;
        case 201:
            console.log('Создано (201): Новый инцидент добавлен');
            break;
        case 204:
            console.log('Удалено (204): Инцидент удален');
            break;
        case 400:
            console.log('Ошибка запроса (400): Проверьте данные');
            break;
        case 404:
            console.log('Не найдено (404): Инцидент не существует');
            break;
        case 500:
            console.log('Ошибка сервера (500): Повторите позже');
            break;
        default:
            console.log(`Статус: ${status}`);
    }
    
    return response;
};

// Функция для обработки ошибок
const handleError = (error) => {
    if (error.response) {
        const status = error.response.status;
        const statusText = error.response.statusText;
        
        switch(status) {
            case 400:
                console.error('Ошибка 400: Неверный запрос');
                break;
            case 404:
                console.error('Ошибка 404: Ресурс не найден');
                break;
            case 500:
                console.error('Ошибка 500: Внутренняя ошибка сервера');
                break;
            default:
                console.error(`Ошибка ${status}: ${statusText}`);
        }
        
        return {
            status: status,
            message: statusText,
            data: error.response.data
        };
    } else if (error.request) {
        console.error('Ошибка: Сервер не отвечает');
        return {
            status: 0,
            message: 'Сервер не отвечает',
            data: null
        };
    } else {
        console.error('Ошибка:', error.message);
        return {
            status: 0,
            message: error.message,
            data: null
        };
    }
};

// API методы
export const api = {
    // GET - получение всех инцидентов
    getAll: async () => {
        try {
            const response = await axios.get(API_URL);
            handleResponse(response);
            return { 
                success: true,
                data: response.data, 
                status: response.status,
                message: `Статус ${response.status}: Успешно`
            };
        } catch (error) {
            const errorInfo = handleError(error);
            return { 
                success: false,
                data: null, 
                status: errorInfo.status,
                message: errorInfo.message
            };
        }
    },
    
    // GET - получение одного инцидента по ID
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            handleResponse(response);
            return { 
                success: true,
                data: response.data, 
                status: response.status,
                message: `Статус ${response.status}: Данные загружены`
            };
        } catch (error) {
            const errorInfo = handleError(error);
            return { 
                success: false,
                data: null, 
                status: errorInfo.status,
                message: errorInfo.message
            };
        }
    },
    
    // POST - создание инцидента
    create: async (incident) => {
        try {
            const { id, ...incidentData } = incident;
            
            const response = await axios.post(API_URL, incidentData, {
                headers: { 'Content-Type': 'application/json' }
            });
            handleResponse(response);
            return { 
                success: true,
                data: response.data, 
                status: response.status,
                message: `Статус ${response.status}: Инцидент создан`
            };
        } catch (error) {
            const errorInfo = handleError(error);
            return { 
                success: false,
                data: null, 
                status: errorInfo.status,
                message: errorInfo.message
            };
        }
    },
    
    // PUT - обновление инцидента
    update: async (id, incident) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, incident, {
                headers: { 'Content-Type': 'application/json' }
            });
            handleResponse(response);
            return { 
                success: true,
                data: response.data, 
                status: response.status,
                message: `Статус ${response.status}: Инцидент обновлен`
            };
        } catch (error) {
            const errorInfo = handleError(error);
            return { 
                success: false,
                data: null, 
                status: errorInfo.status,
                message: errorInfo.message
            };
        }
    },
    
    // DELETE - удаление инцидента
    delete: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            handleResponse(response);
            return { 
                success: true,
                data: null, 
                status: response.status,
                message: `Статус ${response.status}: Инцидент удален`
            };
        } catch (error) {
            const errorInfo = handleError(error);
            return { 
                success: false,
                data: null, 
                status: errorInfo.status,
                message: errorInfo.message
            };
        }
    }
};
