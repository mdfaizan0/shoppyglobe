// getting API URL from .env
const API = import.meta.env.VITE_API_URL;

// setting endpoints for ease of access
const ENDPOINTS = {
    LOGIN: `${API}/api/auth/login`,
    REGISTER: `${API}/api/auth/register`,
    USER_PROFILE: `${API}/api/auth/profile`,
    CART: `${API}/api/cart/`,
    CLEAR_CART: `${API}/api/cartclear`,
    ORDER: `${API}/api/order`,
    ORDER_LATEST: `${API}/api/order/latest`,
    ORDER_HISTORY: `${API}/api/order/history`,
    ALL_PRODUCTS: `${API}/api/products`,
    ONE_PRODUCT: `${API}/api/products/`,
};

// exporting API and ENDPOINTs object
export { API, ENDPOINTS }