import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isUserLoading: true, // ✅ new
};

const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isUserLoading = false;
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isUserLoading = false;
    },
    setLoadingFinished: (state) => {
      state.isUserLoading = false;
    },
  },
});

export const { userLoggedIn, userLoggedOut, setLoadingFinished } =
  AuthSlice.actions;
export default AuthSlice.reducer;
