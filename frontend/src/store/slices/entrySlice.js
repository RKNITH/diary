import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { entryAPI } from '../../api/services';

export const fetchEntries = createAsyncThunk('entries/fetchByDiary', async (diaryId, { rejectWithValue }) => {
  try {
    const res = await entryAPI.getByDiary(diaryId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch entries');
  }
});

export const bulkUpdateEntries = createAsyncThunk('entries/bulkUpdate', async ({ diaryId, entries }, { rejectWithValue }) => {
  try {
    const res = await entryAPI.bulkUpdate(diaryId, entries);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to save entries');
  }
});

export const updateSingleEntry = createAsyncThunk('entries/updateSingle', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await entryAPI.update(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update entry');
  }
});

const entrySlice = createSlice({
  name: 'entries',
  initialState: {
    list: [],
    totals: { totalDone: 0, totalDue: 0, totalPending: 0, grandTotal: 0 },
    diary: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearEntries(state) {
      state.list = [];
      state.totals = { totalDone: 0, totalDue: 0, totalPending: 0, grandTotal: 0 };
      state.diary = null;
    },
    updateLocalEntry(state, action) {
      const { index, field, value } = action.payload;
      if (state.list[index]) {
        state.list[index] = { ...state.list[index], [field]: value };
      }
      // Recompute totals
      const totals = state.list.reduce(
        (acc, e) => {
          acc.totalDone += Number(e.doneAmount) || 0;
          acc.totalDue += Number(e.dueAmount) || 0;
          acc.totalPending += Number(e.pendingAmount) || 0;
          return acc;
        },
        { totalDone: 0, totalDue: 0, totalPending: 0 }
      );
      totals.grandTotal = totals.totalDone + totals.totalDue + totals.totalPending;
      state.totals = totals;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.entries;
        state.totals = action.payload.totals;
        state.diary = action.payload.diary;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bulkUpdateEntries.pending, (state) => { state.saving = true; })
      .addCase(bulkUpdateEntries.fulfilled, (state, action) => {
        state.saving = false;
        state.list = action.payload.entries;
        state.totals = action.payload.totals;
      })
      .addCase(bulkUpdateEntries.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateSingleEntry.fulfilled, (state, action) => {
        const idx = state.list.findIndex((e) => e._id === action.payload.entry._id);
        if (idx !== -1) state.list[idx] = action.payload.entry;
      });
  },
});

export const { clearEntries, updateLocalEntry } = entrySlice.actions;
export default entrySlice.reducer;
