import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dog-shelter-api-66zi.onrender.com/dogs";

export const fetchDogs = createAsyncThunk("dogs/fetchAll", async () => {
  const res = await axios.get(API_URL);
  return res.data?.data ?? res.data;
});

export const addDog = createAsyncThunk("dogs/addDog", async (dog) => {
  const res = await axios.post(API_URL, dog);
  return res.data?.data ?? res.data;
});
export const deleteDog = createAsyncThunk("dogs/deleteDog", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});


const initialState = {
  items: [],
  loading: false,
  error: null,
  
  filters: {
    q: "",
    who: "all", 
  },
};

const dogsSlice = createSlice({
  name: "dogs",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
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
        state.items = state.items.filter(
          (dog) => (dog._id || dog.id) !== id
        );
      });
  },
});

export const { setFilters, resetFilters } = dogsSlice.actions;
export default dogsSlice.reducer;

export const selectDogsState = (s) => s.dogs;
export const selectDogs       = (s) => s.dogs.items;
export const selectFilters    = (s) => s.dogs.filters;
export const selectLoading    = (s) => s.dogs.loading;
export const selectError      = (s) => s.dogs.error;

const normType = (d) =>
  String(d.type ?? d.kind ?? d.species ?? "dog").toLowerCase();

const haystack = (d) =>
  [
    d.name,
    d.breed,
    d.desc || d.description,
    typeof d.age === "object" ? d.age?.value : d.age,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const selectFilteredDogs = createSelector(
  [selectDogs, selectFilters],
  (items, { q, who }) => {
    const needle = (q || "").trim().toLowerCase();
    return items.filter((d) => {
      const byType = who === "all" || normType(d) === who;
      if (!byType) return false;
      if (!needle) return true;
      return haystack(d).includes(needle);
    });
  }
);


export const selectFilteredCount = createSelector(
  [selectFilteredDogs],
  (arr) => arr.length
);
