"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image.js";

export default function DogPage() {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDog = async () => {
      try {
        const res = await fetch(
          `https://dog-shelter-api-66zi.onrender.com/dogs/${id}`
        );
        const data = await res.json();
        setDog(data);
      } catch (err) {
        console.error("Error fetching dog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [id]);

  if (loading) return <p>Loading dog...</p>;
  if (!dog) return <p>Dog not found</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{dog.name}</h1>
      <p>Breed: {dog.breed}</p>
      <p>Age: {dog.age}</p>
      {dog.photoUrl1 && (
        <Image
          src={dog.photoUrl1}
          width={522}
          height={698}
          alt={dog.name}
          className="w-64 mt-4"
        />
      )}
    </div>
  );
}
