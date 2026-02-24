import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactions: [],
    loading: false,
    error: null
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setTransactions: (state, action) => {
      state.loading = false;
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
      state.loading = false;
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(t => t._id === action.payload._id);
      if (index !== -1) state.transactions[index] = action.payload;
      state.loading = false;
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(t => t._id !== action.payload);
      state.loading = false;
    }
  }
});

export const {
  setLoading,
  setError,
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} = transactionSlice.actions;

export default transactionSlice.reducer;
