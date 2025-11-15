import { store } from '../store';
import { clearSession } from '../slices/authSlice';
import { API_BASE } from '../config';

const api = async (url: string, options: RequestInit = {}) => {
  const { sessionToken } = store.getState().auth;

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (sessionToken) {
    (headers as any)['Authorization'] = `Bearer ${sessionToken}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    store.dispatch(clearSession());
  }

  return response;
};

export default api;
