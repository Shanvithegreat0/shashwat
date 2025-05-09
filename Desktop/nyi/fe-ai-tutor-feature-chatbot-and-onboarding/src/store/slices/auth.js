import { createSlice } from '@reduxjs/toolkit';

// Try to load initial user state from localStorage
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error('Error loading user from localStorage:', e);
    return null;
  }
};

const userSlice = createSlice({
  name: 'users',
  initialState: {
    token: null,
    isAuthenticated: localStorage.getItem('at') ? true : false,
    user: loadUserFromStorage(),
    formLoading: false
  },
  reducers: {
    selectUser: (state, action) => {
      state = action.payload;
    },
    loginSuccess: (state, action) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
      if (action.payload.tokens) {
        const at = action.payload.tokens.access_token;
        const rt = action.payload.tokens.refresh_token;
        localStorage.setItem('at', at);
        localStorage.setItem('rt', rt);
      }
    },
    logoutSuccess: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      // Clear user from localStorage
      localStorage.removeItem('user');
    },
    markUserVerified: (state) => {
      if (state.user) {
        state.user.verified = true;
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
});

export const { selectUser, loginSuccess, logoutSuccess, markUserVerified } = userSlice.actions;
export default userSlice.reducer;