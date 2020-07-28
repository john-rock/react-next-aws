import cookie from 'js-cookie';

// Set in cookie
export const setCookie = (key, value) => {
    // proces.browser = next.js client side
    if (process.browser) {
        cookie.set(key, value, {
            expires: 7,
        });
    }
};

// Remove from cookie
export const removeCookie = (key) => {
    // proces.browser = next.js client side
    if (process.browser) {
        cookie.set(key);
    }
};

// Get from cookie - stored token
export const getCookie = (key) => {
    if (process.browser) {
        return cookie.get(key);
    }
};

// Set in localstorage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// Remove from localstorage
export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
};

// Authenticate user by passing data to cookie and localstorage from sign in
export const authenticate = (response, next) => {
    setCookie('token', response.data.token);
    setLocalStorage('user', response.data.user);
    next();
};

// Access user info from localstorage - isAuth()
export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else {
                return false;
            }
        }
    }
};
