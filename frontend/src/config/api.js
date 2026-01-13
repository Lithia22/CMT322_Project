const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('🔍 API_URL:', apiUrl);
console.log('🔍 All env vars:', import.meta.env);
export const API_URL = apiUrl;