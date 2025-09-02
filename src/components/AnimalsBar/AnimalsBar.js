"use client";

import { useMemo, useState } from "react";
import css from "./AnimalsBar.module.css";
import { FiSearch } from "react-icons/fi";


export default function AnimalsBar({ items = [] }) {
  const [q, setQ] = useState("");
  const [who, setWho] = useState("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((it) => {
      const byType = who === "all" || it.type === who;
      if (!byType) return false;
      if (!needle) return true;

      const hay = [it.name, it.breed, it.age]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(needle);
    });
  }, [items, q, who]);

  return (
    <section className={`container ${css.wrap}`}>
      <div className={css.count}>{filtered.length}</div>

      <p className={css.subtitle}>
        улюбленців чекають на новий дім — стань родиною для одного з них
      </p>

      <div className={css.controls}>
        {/* Пошук */}
        <label className={css.search}>
          <FiSearch className={css.searchIcon} />
          <input
            className={css.input}
            type="text"
            placeholder="Пошук"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>

        {/* Фільтр “Кого шукаємо ?” */}
        <div className={css.filter}>
          <span className={css.filterLabel}>Кого шукаємо ?</span>
          <select
            className={css.select}
            value={who}
            onChange={(e) => setWho(e.target.value)}
            aria-label="Кого шукаємо"
          >
            <option value="all">Усі</option>
            <option value="dog">Собаки</option>
            <option value="cat">Коти</option>
          </select>
        </div>
      </div>
    </section>
  );
}
