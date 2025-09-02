"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { fetchDogs } from "@/src/redux/dogs/slice.js";

export default function DogsList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.dogs);

  useEffect(() => {
    dispatch(fetchDogs());
  }, [dispatch]);

  if (loading) return <p>Loading dogs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {items.map((dog) => (
        <div key={dog._id}>{dog.name}</div>
      ))}
    </div>
  );
}
