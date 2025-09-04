import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dog-shelter-api-66zi.onrender.com/dogs";


   export const fetchDogs = createAsyncThunk(
  "dogs/fetchAll",
  async ({ page = 1, limit = 1000 } = {}, thunkAPI) => {
    try {
      const res = await axios.get(API_URL, {
        signal: thunkAPI.signal,
        params: { page, limit }, 
      });
      
      return res.data?.data ?? res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data?.message || e.message);
    }
  }
);

export const addDog = createAsyncThunk(
  "dogs/addDog",
  async (dog, thunkAPI) => {
    try {
      const res = await axios.post(API_URL, dog, { signal: thunkAPI.signal });
      return res.data?.data ?? res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data?.message || e.message);
    }
  }
);

export const deleteDog = createAsyncThunk(
  "dogs/deleteDog",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { signal: thunkAPI.signal });
      return id;
    } catch (e) {
      return thunkAPI.rejectWithValue(e?.response?.data?.message || e.message);
    }
  }
);

/* =========================
   Helpers (нормалізація)
   ========================= */
const normType = (d) =>
  String(d.type ?? d.kind ?? d.species ?? "dog").toLowerCase();

const normGender = (d) => {
  const raw = String(d.gender ?? d.sex ?? "").toLowerCase();
  if (/^(f|ж|female|самка)/.test(raw)) return "female";
  if (/^(m|ч|male|самець)/.test(raw)) return "male";
  return "unknown";
};

const ageNum = (d) => {
  const a = d.age ?? d.ageValue;
  if (typeof a === "number") return a;

  if (a && typeof a === "object") {
    const v = Number(a.value ?? a.val ?? a.v ?? NaN);
    const unit = String(a.unit ?? "").toLowerCase();
    if (Number.isFinite(v)) {
      if (/(міс|month)/.test(unit)) return +(v / 12).toFixed(2);
      return v; 
    }
  }

  if (typeof a === "string") {
    const num = parseFloat(a.replace(",", "."));
    if (Number.isFinite(num)) {
      if (/(міс|місяц|month)/i.test(a)) return +(num / 12).toFixed(2);
      return num;
    }
  }

  return NaN;
};

const weightNum = (d) => {
  const w = d.weight ?? d.weightKg ?? d.mass ?? d.weight_kg;
  if (typeof w === "number") return w;
  if (typeof w === "string") {
    const num = parseFloat(w.replace(",", "."));
    return Number.isFinite(num) ? num : NaN;
  }
  return NaN;
};

const haystack = (d) =>
  [
    d.name,
    d.breed,
    d.desc || d.description,
    String(ageNum(d)),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const inRange = (val, min, max) => {
  if (!Number.isFinite(val)) return true;
  if (min != null && val < min) return false;
  if (max != null && val > max) return false;
  return true;
};

/* =========================
   Filters
   ========================= */

const DEFAULT_FILTERS = {
  q: "",
  who: "all",    
  gender: "all",  
  ageMin: null,
  ageMax: null,
  weightMin: null,
  weightMax: null,
};

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: { ...DEFAULT_FILTERS },
};

/* =========================
   Slice
   ========================= */
const dogsSlice = createSlice({
  name: "dogs",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { ...DEFAULT_FILTERS }; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchDogs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Failed to fetch dogs";
      })
      .addCase(addDog.fulfilled, (state, action) => {
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(deleteDog.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((d) => (d._id || d.id) !== id);
      });
  },
});

export const { setFilters, resetFilters } = dogsSlice.actions;
export default dogsSlice.reducer;

/* =========================
   Selectors
   ========================= */
export const selectDogsState = (s) => s.dogs;
export const selectDogs = (s) => s.dogs.items;
export const selectFilters = (s) => s.dogs.filters;
export const selectLoading = (s) => s.dogs.loading;
export const selectError = (s) => s.dogs.error;

export const selectFilteredDogs = createSelector(
  [selectDogs, selectFilters],
  (items, f) => {
    const {
      q = "",
      who = "all",
      gender = "all",
      ageMin = null,
      ageMax = null,
      weightMin = null,
      weightMax = null,
    } = f || {};

    const needle = q.trim().toLowerCase();

    return items.filter((d) => {
      if (!(who === "all" || normType(d) === who)) return false;

      const g = normGender(d);
      if (!(gender === "all" || g === gender)) return false;

      if (!inRange(ageNum(d), ageMin, ageMax)) return false;
      if (!inRange(weightNum(d), weightMin, weightMax)) return false;

      return !needle || haystack(d).includes(needle);
    });
  }
);

export const selectFilteredCount = createSelector(
  [selectFilteredDogs],
  (arr) => arr.length
);
