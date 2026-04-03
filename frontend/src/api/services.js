import api from './axios';

// Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Diaries
export const diaryAPI = {
  getAll: () => api.get('/diaries'),
  getById: (id) => api.get(`/diaries/${id}`),
  create: (data) => api.post('/diaries', data),
  update: (id, data) => api.put(`/diaries/${id}`, data),
  delete: (id) => api.delete(`/diaries/${id}`),
};

// Entries
export const entryAPI = {
  getByDiary: (diaryId) => api.get(`/entries/diary/${diaryId}`),
  update: (id, data) => api.put(`/entries/${id}`, data),
  bulkUpdate: (diaryId, entries) => api.put(`/entries/diary/${diaryId}/bulk`, { entries }),
};

// Summary
export const summaryAPI = {
  getGlobal: () => api.get('/summary'),
};
