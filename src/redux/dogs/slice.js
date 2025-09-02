import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://dog-shelter-api-66zi.onrender.com/dogs";
// const API_URL = "http://localhost:3001/dogs";

export const fetchDogs = createAsyncThunk("dogs/fetchAll", async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
});

export const addDog = createAsyncThunk("dogs/addDog", async (dog) => {
  const res = await axios.post(API_URL, dog);
  return res.data;
});

export const deleteDog = createAsyncThunk("dogs/deleteDog", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const dogsSlice = createSlice({
  name: "dogs",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchDogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch dogs";
      })

      .addCase(addDog.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(deleteDog.fulfilled, (state, action) => {
        state.items = state.items.filter((dog) => dog._id !== action.payload);
      });
  },
});

export default dogsSlice.reducer;
