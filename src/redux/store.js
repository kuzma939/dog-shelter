import { configureStore } from "@reduxjs/toolkit";
import dogsReducer from "./dogs/slice.js";

export const store = configureStore({
  reducer: {
    dogs: dogsReducer,
  },
});
