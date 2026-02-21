import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.0.2.2:8080/api/auth";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = "USER" | "ADMIN" | "MANAGER";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  token: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ─── Logger Utility ───────────────────────────────────────────────────────────

const log = {
  info: (tag: string, msg: string, data?: any) => {
    console.log(`[INFO] [${tag}] ${msg}`, data !== undefined ? data : "");
  },
  error: (tag: string, msg: string, data?: any) => {
    console.error(`[ERROR] [${tag}] ${msg}`, data !== undefined ? data : "");
  },
  warn: (tag: string, msg: string, data?: any) => {
    console.warn(`[WARN] [${tag}] ${msg}`, data !== undefined ? data : "");
  },
};

// ─── Safe JSON Parser ─────────────────────────────────────────────────────────

const safeParseJSON = async (response: Response): Promise<any> => {
  const rawText = await response.text();
  log.info(
    "HTTP",
    `Response status: ${response.status}`,
    rawText.slice(0, 300),
  );

  try {
    return JSON.parse(rawText);
  } catch (parseError) {
    log.error("JSON_PARSE", "Failed to parse response as JSON", {
      status: response.status,
      rawText: rawText.slice(0, 500),
    });
    throw new Error(
      `Server returned invalid JSON. Status: ${response.status}. Body: ${rawText.slice(0, 100)}`,
    );
  }
};

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { rejectWithValue }) => {
    log.info("REGISTER", "Attempting registration", {
      email: data.email,
      role: data.role,
    });

    try {
      const url = `${BASE_URL}/register`;
      log.info("REGISTER", `POST ${url}`);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      log.info("REGISTER", `Response received`, {
        status: response.status,
        ok: response.ok,
      });

      const result = await safeParseJSON(response);
      log.info("REGISTER", "Parsed response", result);

      if (!response.ok) {
        const errMsg =
          result?.message ||
          result?.error ||
          `Registration failed (${response.status})`;
        log.error("REGISTER", "Server rejected registration", errMsg);
        return rejectWithValue(errMsg);
      }

      if (!result.token) {
        log.warn("REGISTER", "No token in response", result);
      } else {
        await AsyncStorage.setItem("token", result.token);
        log.info("REGISTER", "Token saved to AsyncStorage");
      }

      log.info("REGISTER", "Registration successful", { email: result.email });
      return result as AuthUser;
    } catch (error: any) {
      // Network error or JSON parse error
      const msg =
        error?.message || "Network error. Please check your connection.";
      log.error("REGISTER", "Exception caught", msg);
      return rejectWithValue(msg);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    log.info("LOGIN", "Attempting login", { email: data.email });

    try {
      const url = `${BASE_URL}/login`;
      log.info("LOGIN", `POST ${url}`);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      log.info("LOGIN", `Response received`, {
        status: response.status,
        ok: response.ok,
      });

      const result = await safeParseJSON(response);
      log.info("LOGIN", "Parsed response", result);

      if (!response.ok) {
        const errMsg =
          result?.message ||
          result?.error ||
          `Login failed (${response.status})`;
        log.error("LOGIN", "Server rejected login", errMsg);
        return rejectWithValue(errMsg);
      }

      if (!result.token) {
        log.warn("LOGIN", "No token in response", result);
      } else {
        await AsyncStorage.setItem("token", result.token);
        log.info("LOGIN", "Token saved to AsyncStorage");
      }

      log.info("LOGIN", "Login successful", { email: result.email });
      return result as AuthUser;
    } catch (error: any) {
      const msg =
        error?.message || "Network error. Please check your connection.";
      log.error("LOGIN", "Exception caught", msg);
      return rejectWithValue(msg);
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  log.info("LOGOUT", "Clearing token from AsyncStorage");
  await AsyncStorage.removeItem("token");
  log.info("LOGOUT", "Logout successful");
});

export const loadStoredToken = createAsyncThunk("auth/loadToken", async () => {
  const token = await AsyncStorage.getItem("token");
  log.info(
    "LOAD_TOKEN",
    token ? "Token found in storage" : "No token in storage",
  );
  return token;
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        log.info("REDUX", "registerUser -> pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<AuthUser>) => {
          log.info("REDUX", "registerUser -> fulfilled", action.payload);
          state.loading = false;
          state.user = action.payload;
          state.token = action.payload.token;
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        log.error("REDUX", "registerUser -> rejected", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        log.info("REDUX", "loginUser -> pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthUser>) => {
          log.info("REDUX", "loginUser -> fulfilled", action.payload);
          state.loading = false;
          state.user = action.payload;
          state.token = action.payload.token;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        log.error("REDUX", "loginUser -> rejected", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      log.info("REDUX", "logoutUser -> fulfilled");
      state.user = null;
      state.token = null;
    });

    // Load Token
    builder.addCase(loadStoredToken.fulfilled, (state, action) => {
      log.info("REDUX", "loadStoredToken -> fulfilled", {
        hasToken: !!action.payload,
      });
      state.token = action.payload;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
