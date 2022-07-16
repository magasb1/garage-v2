import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    user: {}
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Actions
        setAuth: (state, action) => {
            console.log(action.payload)
            state.token = action.payload.token
            state.user = action.payload.user
        },
        removeAuth: (state, action) => {
            state = initialState
        },
    }
})

export const { setAuth, removeAuth } = authSlice.actions;

// Selectors - this is how we pull information fom the Global store slice
export const selectAuth = (state) => state.auth

export default authSlice.reducer