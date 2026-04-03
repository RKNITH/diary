import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { diaryAPI } from '../../api/services';

export const fetchDiaries = createAsyncThunk('diaries/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await diaryAPI.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch diaries');
  }
});

export const fetchDiaryById = createAsyncThunk('diaries/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await diaryAPI.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch diary');
  }
});

export const createDiary = createAsyncThunk('diaries/create', async (data, { rejectWithValue }) => {
  try {
    const res = await diaryAPI.create(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create diary');
  }
});

export const updateDiary = createAsyncThunk('diaries/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await diaryAPI.update(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update diary');
  }
});

export const deleteDiary = createAsyncThunk('diaries/delete', async (id, { rejectWithValue }) => {
  try {
    await diaryAPI.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete diary');
  }
});

const diarySlice = createSlice({
  name: 'diaries',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchDiaries.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.diaries;
      })
      .addCase(fetchDiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchDiaryById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDiaryById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.diary;
      })
      .addCase(fetchDiaryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createDiary.fulfilled, (state, action) => {
        state.list.push({ ...action.payload.diary, totals: { totalDone: 0, totalDue: 0, totalPending: 0, grandTotal: 0 } });
      })
      // Update
      .addCase(updateDiary.fulfilled, (state, action) => {
        const idx = state.list.findIndex((d) => d._id === action.payload.diary._id);
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], ...action.payload.diary };
        }
        if (state.current?._id === action.payload.diary._id) {
          state.current = { ...state.current, ...action.payload.diary };
        }
      })
      // Delete
      .addCase(deleteDiary.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
      });
  },
});

export const { clearCurrent, clearError } = diarySlice.actions;
export default diarySlice.reducer;
