import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/services';

const storedToken = localStorage.getItem('diary_token');
const storedAdmin = localStorage.getItem('diary_admin');

export const loginAdmin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authAPI.login(credentials);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await authAPI.getMe();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedToken || null,
    admin: storedAdmin ? JSON.parse(storedAdmin) : null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem('diary_token');
      localStorage.removeItem('diary_admin');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
        state.isAuthenticated = true;
        localStorage.setItem('diary_token', action.payload.token);
        localStorage.setItem('diary_admin', JSON.stringify(action.payload.admin));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.token = null;
        state.admin = null;
        state.isAuthenticated = false;
        localStorage.removeItem('diary_token');
        localStorage.removeItem('diary_admin');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
