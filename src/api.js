const API_URL = "http://localhost:8000/api/";

export const fetchData = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Błąd serwera');
    }

    // Sprawdzamy, czy odpowiedź zawiera treść
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json(); // Parsujemy tylko jeśli odpowiedź zawiera JSON
    }

    return null; // Brak treści w odpowiedzi (np. przy DELETE)
};

export const postData = async (endpoint, data, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            ...options.headers,
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.error || 'Something went wrong');
    }
    return responseData;
};

export const updateData = async (endpoint, data, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            ...options.headers,
        },
        body: JSON.stringify(data),
    });
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
    }
    return response.json();
};

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}auth/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const getUserInfo = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}user-info/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
    }
    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }
    return response.json();
};

export const deleteData = async (endpoint) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
    }
    return response.json();
};