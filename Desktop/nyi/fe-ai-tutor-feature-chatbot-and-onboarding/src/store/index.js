import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.js";
import toastReducer from './slices/toasts.js';
import { api } from "./slices/apiServices";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        toast: toastReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})