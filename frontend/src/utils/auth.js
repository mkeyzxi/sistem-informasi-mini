
const USER_KEY = 'siakad_user';
const TOKEN_KEY = 'siakad_token';

export const login = (user, token) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
};

export const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
};

export const isLoggedIn = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
};

export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};