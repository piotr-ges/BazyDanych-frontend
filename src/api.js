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
        credentials: 'include', // Umożliwia wysyłanie ciasteczek
    });
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
    }
    return response.json();
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
        console.error('Error response:', responseData);
        console.error('Request data:', data);
        console.error('Request options:', options);
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
    const responseData = await response.json();
    if (!response.ok) {
        console.error('Error response:', responseData);
        console.error('Request data:', data);
        console.error('Request options:', options);
        throw new Error(responseData.error || 'Something went wrong');
    }
    return responseData;
};

export const deleteData = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            ...options.headers,
        },
    });
    if (!response.ok) {
        const responseData = await response.json();
        console.error('Error response:', responseData);
        throw new Error(responseData.error || 'Something went wrong');
    }
    return response;
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