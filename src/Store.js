import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import adminSlice from "./features/adminSlice"

export default configureStore({
    reducer : {
        auth : authSlice,
        admin : adminSlice
    }
});