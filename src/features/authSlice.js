import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

// Secret key for encryption (change this to a strong key)
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// Define admin email 
const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS.split(",");; // Change this to your actual admin email


// Function to encrypt data
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Function to decrypt data
const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        return null;
    }
};


// Load from localStorage (Decrypt if available)
const storedUser = localStorage.getItem("user");
const storedAuth = localStorage.getItem("isAuth");
const storedExpiry = localStorage.getItem("expiryTime");

const user = storedUser ? decryptData(storedUser) : null;
const isAuth = storedAuth ? decryptData(storedAuth) : false;
const expiryTime = storedExpiry ? decryptData(storedExpiry) : null;


// Clear data if expired
if (expiryTime && Date.now() > expiryTime) {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("expiryTime");
}


// Async thunk for logging in
export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if user is the admin
        if (ADMIN_EMAILS.includes(user.email)) {

            return { uid: user.uid, email: user.email };
        } else {
            await signOut(auth);
            return rejectWithValue("Access denied: Only admin can log in.");
        }
    } catch (error) {
        return rejectWithValue("Invalid credentials. Please try again.");
    }
});

// Async thunk for logging out
export const logoutUser = createAsyncThunk("auth/logoutAdmin", async () => {
    await signOut(auth);

    // Remove from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("expiryTime");
});


const authSlice = createSlice({
    name: "auth",
    initialState: {
        user:  user || null,
        isAuth,
        status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {}, // No additional reducers needed

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.isAuth = true;
                state.error = null;

                const expiryTime = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

                // Store in localStorage with encrypt
                localStorage.setItem("user", encryptData(action.payload));
                localStorage.setItem("isAuth", encryptData(true));
                localStorage.setItem("expiryTime", encryptData(expiryTime));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuth = false;
                state.status = "idle";
                state.error = null;

                toast.success("Logged out successfully!"); // Show toast on logout
            });
    },
});

export default authSlice.reducer;
