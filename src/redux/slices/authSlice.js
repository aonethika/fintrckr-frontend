import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setUpiApi, updateUpiApi } from "../../api/api";


export const setUpi = createAsyncThunk(
  "auth/setUpi",
  async (upi, { rejectWithValue }) => {
    try {
      const res = await setUpiApi({ upi });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed");
    }
  }
);

export const updateUpi = createAsyncThunk(
  "auth/updateUpi",
  async (upi, { getState, dispatch }) => {
    const result = await updateUpiApi({ upi });

    if (result?.user) {
      const token = getState().auth.token;
      dispatch(loginSuccess({ user: result.user, token }));
    }

    return result;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    justLoggedIn: false,
    upi: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.justLoggedIn = true;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.upi = action.payload.user?.upiId || null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    resetJustLoggedin: (state) => {
      state.justLoggedIn = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.justLoggedIn = false;
      state.upi = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setUpi.fulfilled, (state, action) => {
      state.upi = action.payload.upiId;
      if (state.user) {
        state.user.upiId = action.payload.upiId;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    });
  },
});

export const { loginSuccess, logout, resetJustLoggedin } = authSlice.actions;
export default authSlice.reducer;