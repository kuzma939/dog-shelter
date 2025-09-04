
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   API
   ========================= */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dog-shelter-api-66zi.onrender.com/dogs";

/* =========================
   Thunks
   ========================= */
export const fetchDogs = createAsyncThunk(
  "dogs/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL, { signal: thunkAPI.signal });
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
  if (raw.startsWith("f") || raw.startsWith("ж")) return "female";
  if (raw.startsWith("m") || raw.startsWith("ч")) return "male";
  return "unknown";
};

const ageNum = (d) => {
  if (typeof d.age === "number") return d.age;
  if (typeof d.age === "object" && d.age) {
    const v = Number(d.age.value ?? d.age.val ?? 0);
    const unit = String(d.age.unit ?? "").toLowerCase();
    if (unit.includes("міс") || unit.includes("month")) return +(v / 12).toFixed(2);
    return v; // роки
  }
  return Number(d.ageValue ?? 0);
};

const weightNum = (d) => {
  const w = d.weight ?? d.weightKg ?? d.mass;
  return w == null ? NaN : Number(w);
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

const DEFAULT_FILTERS = {
  q: "",          // текстовий пошук (ім’я, порода, опис, вік)
  who: "all",     // dog | cat | all
  gender: "all",  // male | female | all
  ageMin: 0,
  ageMax: 10,     // під макет
  weightMin: 1,
  weightMax: 40,  // під слайдер
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
      // важливо повертати копію, а не посилання
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
export const selectDogs      = (s) => s.dogs.items;
export const selectFilters   = (s) => s.dogs.filters;
export const selectLoading   = (s) => s.dogs.loading;
export const selectError     = (s) => s.dogs.error;

export const selectFilteredDogs = createSelector(
  [selectDogs, selectFilters],
  (items, f) => {
    // дефолти — щоб усе працювало навіть якщо фільтри десь зламають
    const {
      q = "",
      who = "all",
      gender = "all",
      ageMin = 0,
      ageMax = 10,
      weightMin = 1,
      weightMax = 40,
    } = f || {};

    const needle = q.trim().toLowerCase();

    return items.filter((d) => {
      if (!(who === "all" || normType(d) === who)) return false;

      const g = normGender(d);
      if (!(gender === "all" || g === gender)) return false;

      const a = ageNum(d);
      if (Number.isFinite(a) && (a < ageMin || a > ageMax)) return false;

      const w = weightNum(d);
      if (Number.isFinite(w) && (w < weightMin || w > weightMax)) return false;

      return !needle || haystack(d).includes(needle);
    });
  }
);

export const selectFilteredCount = createSelector(
  [selectFilteredDogs],
  (arr) => arr.length
);
