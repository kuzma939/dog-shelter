"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaPaw } from "react-icons/fa";
import {
  fetchDogs,
  selectFilteredDogs,
  selectLoading,
  selectError,
} from "@/redux/dogs/slice";
import Image from "next/image";
import css from "./Gallery.module.css";
import Loader from "../Loader/Loader.jsx";

const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST ||
  "https://dog-shelter-api-66zi.onrender.com";

const toAbsUrl = (src) => {
  if (!src) return "/image/mailo.jpg";
  try {
    return new URL(src, API_HOST).href;
  } catch {
    return src;
  }
};

export default function Gallery({ pageSize = 6 }) {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const filtered = useSelector(selectFilteredDogs);

  const [page, setPage] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    dispatch(fetchDogs());
  }, [dispatch]);

  const items = useMemo(
    () =>
      filtered.map((d) => {
        const img =
          d.image?.url || d.imageUrl || d.photoUrl1 || d.image || d.img;
        const age =
          typeof d.age === "object"
            ? d.age
            : {
                value: Number(d.age ?? d.ageValue ?? 0),
                unit: d.ageUnit ?? "роки",
              };

        return {
          id: d._id ?? d.id,
          name: d.name,
          gender: d.gender,
          age,
          desc: d.desc ?? d.description ?? "",
          image: toAbsUrl(img),
          href: `/catalog/${d.slug ?? d._id ?? d.id}`,
        };
      }),
    [filtered]
  );

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  useEffect(() => {
    setPage(0);
  }, [items.length]);

  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section ref={rootRef} className={`container ${css.wraps}`} id="adopt">
      <div className={css.pawsWrap} aria-hidden="true">
        <FaPaw className={`${css.paw} ${css.paw1}`} />
        <FaPaw className={`${css.paw} ${css.paw2}`} />
        <FaPaw className={`${css.paw} ${css.paw3}`} />
        <FaPaw className={`${css.paw} ${css.paw4}`} />
      </div>

      {loading && <Loader />}
      {error && <p>Помилка: {error}</p>}

      <div className={css.grid}>
        {pageItems.map((dog) => (
          <Card key={dog.id} dog={dog} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={css.pager}>
          <button
            className={css.arrow}
            onClick={prev}
            disabled={page === 0}
            aria-label="Попередня"
          >
            <svg width="20" height="40" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <span className={css.counter}>
            <b>{page + 1}</b>
            <span className={css.sep}>/</span>
            {totalPages}
          </span>

          <button
            className={css.arrow}
            onClick={next}
            disabled={page >= totalPages - 1}
            aria-label="Наступна"
          >
            <svg width="20" height="40" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
function Card({ dog }) {
  const genderChar = dog.gender === "female" ? "♀" : "♂";
  const ageText = `${dog.age.value} ${dog.age.unit}`;

  return (
    <Link className={css.card} href={dog.href}>
      <div className={css.imageWrap}>
        <Image
          src={dog.image}
          alt={dog.name}
          fill
          sizes="(max-width: 900px) 50vw, 33vw"
          unoptimized
        />
      </div>

      <div className={css.info}>
        <div className={css.title}>
          <span className={css.gender} aria-hidden="true">
            {genderChar}
          </span>
          <span className={css.name}>{dog.name}</span>
          <span className={css.age}>{ageText}</span>
        </div>
        <p className={css.desc}>{dog.desc}</p>
        <span className={css.more}>Детальніше…</span>
      </div>
    </Link>
  );
}
{
  /*"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaPaw } from "react-icons/fa";
import {
  fetchDogs,
  selectFilteredDogs,
  selectLoading,
  selectError,
} from "@/redux/dogs/slice";
import Image from "next/image";
import css from "./Gallery.module.css";
import AIMatchPanel from "../AIMatchPanel.jsx";
import MatchBadge from "../MatchBadge/MatchBadge.jsx";

const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST ||
  "https://dog-shelter-api-66zi.onrender.com";

const toAbsUrl = (src) => {
  if (!src) return "/image/mailo.jpg";
  try {
    return new URL(src, API_HOST).href;
  } catch {
    return src;
  }
};

export default function Gallery({ pageSize = 6 }) {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const filtered = useSelector(selectFilteredDogs);

  const [scores, setScores] = useState({}); // id -> { percent, reasons }
  const getId = (d) => d._id ?? d.id ?? d.slug ?? d.name;

  const [page, setPage] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    dispatch(fetchDogs());
  }, [dispatch]);

  // 1) Базові елементи зі стору
  const itemsBase = useMemo(
    () =>
      filtered.map((d) => {
        const img =
          d.image?.url || d.imageUrl || d.photoUrl1 || d.image || d.img;
        const age =
          typeof d.age === "object"
            ? d.age
            : {
                value: Number(d.age ?? d.ageValue ?? 0),
                unit: d.ageUnit ?? "роки",
              };

        return {
          id: d._id ?? d.id,
          name: d.name,
          gender: d.gender,
          age,
          desc: d.desc ?? d.description ?? "",
          image: toAbsUrl(img),
          href: `/catalog/${d.slug ?? d._id ?? d.id}`,
        };
      }),
    [filtered]
  );

  // 2) Якщо є AI-оцінки — сортуємо за ними
  const items = useMemo(() => {
    if (!scores || Object.keys(scores).length === 0) return itemsBase;
    return [...itemsBase].sort(
      (a, b) =>
        (scores[getId(b)]?.percent ?? 0) -
        (scores[getId(a)]?.percent ?? 0)
    );
  }, [itemsBase, scores]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  // скидати на першу сторінку при зміні довжини або увімк/вимк AI
  useEffect(() => {
    setPage(0);
  }, [items.length, Object.keys(scores).length]);

  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section ref={rootRef} className={`container ${css.wraps}`} id="adopt">
      <div className={css.pawsWrap} aria-hidden="true">
        <FaPaw className={`${css.paw} ${css.paw1}`} />
        <FaPaw className={`${css.paw} ${css.paw2}`} />
        <FaPaw className={`${css.paw} ${css.paw3}`} />
        <FaPaw className={`${css.paw} ${css.paw4}`} />
      </div>

      <AIMatchPanel onScores={setScores} />

      {loading && <p>Завантажуємо песиків…</p>}
      {error && <p>Помилка: {error}</p>}

      <div className={css.grid}>
        {pageItems.map((dog) => (
          <Card key={dog.id} dog={dog} match={scores[dog.id]} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={css.pager}>
          <button
            className={css.arrow}
            onClick={prev}
            disabled={page === 0}
            aria-label="Попередня"
          >
            <svg
              width="20"
              height="40"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <span className={css.counter}>
            <b>{page + 1}</b>
            <span className={css.sep}>/</span>
            {totalPages}
          </span>

          <button
            className={css.arrow}
            onClick={next}
            disabled={page >= totalPages - 1}
            aria-label="Наступна"
          >
            <svg
              width="20"
              height="40"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

function Card({ dog, match }) {
  const genderChar = dog.gender === "female" ? "♀" : "♂";
  const ageText = `${dog.age.value} ${dog.age.unit}`;

  return (
    <Link className={css.card} href={dog.href}>
      <div className={css.imageWrap}>
        <Image
          src={dog.image}
          alt={dog.name}
          fill
          sizes="(max-width: 900px) 50vw, 33vw"
          unoptimized
        />
      
        <MatchBadge percent={match?.percent} reasons={match?.reasons} />
      </div>

      <div className={css.info}>
        <div className={css.title}>
          <span className={css.gender} aria-hidden="true">
            {genderChar}
          </span>
          <span className={css.name}>{dog.name}</span>
          <span className={css.age}>{ageText}</span>
        </div>
        <p className={css.desc}>{dog.desc}</p>
        <span className={css.more}>Детальніше…</span>
      </div>
    </Link>
  );
} */
}
