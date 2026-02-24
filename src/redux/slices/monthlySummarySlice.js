import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMonthlySummaryAPI,
  setMonthlyBudgetAPI,
  getMonthlyBudgetAPI,
  deleteMonthlyBudgetAPI,
  setCategoryBudgetAPI,
  updateCategoryBudgetAPI,
  deleteCategoryBudgetAPI,
} from "../../api/api";

// --- Thunks ---
export const fetchMonthlySummary = createAsyncThunk(
  "monthlySummary/fetchSummary",
  async (monthString, { rejectWithValue }) => {
    try {
      const [year, month] = monthString.split("-").map(Number);
      const res = await getMonthlySummaryAPI({ month, year });
      return { ...res, month: monthString };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMonthlyBudget = createAsyncThunk(
  "monthlySummary/fetchMonthlyBudget",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMonthlyBudgetAPI();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createMonthlyBudget = createAsyncThunk(
  "monthlySummary/createMonthlyBudget",
  async ({ monthlyBudget, month }, { rejectWithValue }) => {
    try {
      const res = await setMonthlyBudgetAPI({ monthlyBudget, month });
      return { ...res, month };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeMonthlyBudget = createAsyncThunk(
  "monthlySummary/removeMonthlyBudget",
  async (_, { rejectWithValue }) => {
    try {
      const res = await deleteMonthlyBudgetAPI();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Category Budgets
export const createCategoryBudget = createAsyncThunk(
  "monthlySummary/createCategoryBudget",
  async ({ category, amount, month }, { rejectWithValue }) => {
    try {
      const res = await setCategoryBudgetAPI({ category, amount, month });
      return { ...res, month };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const modifyCategoryBudget = createAsyncThunk(
  "monthlySummary/modifyCategoryBudget",
  async ({ category, amount, month }, { rejectWithValue }) => {
    try {
      const res = await updateCategoryBudgetAPI(category, amount, month);
      return { ...res, month };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeCategoryBudget = createAsyncThunk(
  "monthlySummary/removeCategoryBudget",
  async ({ category, month }, { rejectWithValue }) => {
    try {
      const res = await deleteCategoryBudgetAPI(category, month);
      return { ...res, category, month };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---
const monthlySummarySlice = createSlice({
  name: "monthlySummary",
  initialState: {
    monthlyBudget: 0,
    totalIncome: 0,
    totalExpense: 0,
    remainingBudget: 0,
    categoryAnalysis: {},
    categoryBudgets: {},
    categories: [],
    warnings: [],
    status: "idle",
    error: null,
    currentMonth: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlySummary.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentMonth = action.payload.month;
        state.monthlyBudget = action.payload.monthlyBudget || 0;
        state.totalIncome = action.payload.totalIncome || 0;
        state.totalExpense = action.payload.totalExpense || 0;
        state.remainingBudget = action.payload.remainingBudget || 0;
        state.categoryAnalysis = action.payload.categoryAnalysis || {};
        state.categoryBudgets = action.payload.categoryBudgets || {};
        state.warnings = action.payload.warnings || [];
      })
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch monthly summary";
      });

    builder
      .addCase(createMonthlyBudget.fulfilled, (state, action) => {
        state.monthlyBudget = action.payload.monthlyBudget || state.monthlyBudget;
        state.currentMonth = action.payload.month;
      })
      .addCase(removeMonthlyBudget.fulfilled, (state) => {
        state.monthlyBudget = 0;
        state.categoryBudgets = {};
      });

    builder
      .addCase(createCategoryBudget.fulfilled, (state, action) => {
        const { category, amount, categories, month } = action.payload;
        if (!state.categoryBudgets[month]) state.categoryBudgets[month] = {};
        state.categoryBudgets[month][category] = amount;
        if (categories) state.categories = categories;
      })
      .addCase(modifyCategoryBudget.fulfilled, (state, action) => {
        const { category, amount, categories, month } = action.payload;
        if (!state.categoryBudgets[month]) state.categoryBudgets[month] = {};
        state.categoryBudgets[month][category] = amount;
        if (categories) state.categories = categories;
      })
      .addCase(removeCategoryBudget.fulfilled, (state, action) => {
        const { category, month } = action.payload;
        if (state.categoryBudgets[month]) delete state.categoryBudgets[month][category];
      });
  },
});

export default monthlySummarySlice.reducer;