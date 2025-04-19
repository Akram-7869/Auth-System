import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  userRole: null,
  resetLink:null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    authError: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setResetLink:(state, action)=>{
      state.resetLink =action.payload;
    }
  },
});

export const { 
  setLoading, 
  loginSuccess, 
  authError, 
  logout,
  setUserRole,
  setResetLink
} = authSlice.actions;

export default authSlice.reducer;