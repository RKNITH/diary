import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { summaryAPI } from '../../api/services';

export const fetchSummary = createAsyncThunk('summary/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await summaryAPI.getGlobal();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch summary');
  }
});

const summarySlice = createSlice({
  name: 'summary',
  initialState: {
    global: null,
    perDiary: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => { state.loading = true; })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.global = action.payload.global;
        state.perDiary = action.payload.perDiary;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default summarySlice.reducer;
