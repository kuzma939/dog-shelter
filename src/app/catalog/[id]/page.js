"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import Link from "next/link";
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

  if (loading) return <p className="text-center">Loading dog...</p>;
  if (!dog) return <p className="text-center">Dog not found</p>;
return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center py-16 px-20 max-w-[1440px] mx-auto">
      <h1 className="text-5xl font-bold text-[var(--foreground)] mb-12">{dog.name}</h1>

      <div className="flex flex-col lg:flex-row justify-center gap-10">
        {dog.photoUrl1 && (
          <Image
            src={dog.photoUrl3}
            width={522}
            height={698}
            alt={dog.name}
            className="rounded-2xl shadow-xl object-cover w-[522px] h-[698px]"
          />
        )}

        <div className="flex gap-18 w-full">
          <div className="flex flex-col gap-6">
            {dog.photoUrl2 && (
              <Image
                src={dog.photoUrl2}
                width={250}
                height={329}
                alt={`${dog.name} photo 2`}
                className="rounded-2xl object-cover !w-[250px] h-[329px]"
              />
            )}
            {dog.photoUrl3 && (
              <Image
                src={dog.photoUrl1}
                width={250}
                height={329}
                alt={`${dog.name} photo 3`}
                className="rounded-2xl object-cover !w-[250px] h-[329px]"
              />
            )}
          </div>

          <div className="w-[416px] my-auto">
            {dog.gender == "male" ? (
              <IoMdMale className="mx-auto mb-12 text-[var(--foreground)] w-8 h-12" />
            ) : (
              <IoMdFemale className="mx-auto mb-12 text-[var(--foreground)] w-8 h-12" />
            )}
            <Progress label="Емоційна стабільність" value={dog.emotionalStability} />
            <Progress label="Слухняність" value={dog.obedience} />
            <Progress label="Стан здоров'я" value={dog.healthCondition} />
            <Progress label="Соціалізованість" value={dog.socialization} />
          </div>
        </div>
      </div>

      <p className="text-xl font-medium text-[var(--foreground)] leading-relaxed mt-12 w-full">
        {dog.description}
      </p>

      <Link
        href="/how-to-help"
        aria-label="Залишити Заявку"
        className="rounded-full w-[320px] py-5 bg-[var(--accent)] text-white text-center font-semibold text-xl mt-10 shadow-lg hover:bg-[var(--accent)] transition"
      >
        <span>Залишити Заявку</span>
      </Link>
    </div>
  );
}

function Progress({ label, value }) {
  return (
    <div>
      <p className="text-2xl font-bold text-[var(--foreground)] mb-1">{label}</p>
      <div className="w-full bg-[var(--rail)] rounded-full h-5 mb-10">
        <div
          className="bg-[var(--accent)] h-5 rounded-full transition-all duration-500"
          style={{ width: `${value * 10 || 0}%` }}
        />
      </div>
    </div>
  );
}