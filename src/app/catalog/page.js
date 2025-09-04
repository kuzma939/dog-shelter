"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchDogs } from "../../redux/dogs/slice.js";

export default function DogsList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, loading, error } = useSelector((state) => state.dogs);

  useEffect(() => {
    dispatch(fetchDogs());
  }, [dispatch]);

  if (loading) return <p>Loading dogs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {items.map((dog) => (
        <div
          key={dog._id}
          className="cursor-pointer hover:text-blue-600"
          onClick={() => router.push(`/catalog/${dog._id}`)}
        >
          {dog.name}
        </div>
      ))}
    </div>
  );
}
