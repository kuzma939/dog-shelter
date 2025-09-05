// src/components/AnimalsBar/AnimalsBar.jsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { selectFilters, selectFilteredCount, setFilters } from "@/redux/dogs/slice";
import { FiSearch } from "react-icons/fi";
import Filter from "../Filters/Filters";
import css from "./AnimalsBar.module.css";

export default function AnimalsBar({
  showCount = true,        // <-- додано
  showSubtitle = true,     // <-- додано
}) {
  const dispatch = useDispatch();
  const { q } = useSelector(selectFilters);
  const count   = useSelector(selectFilteredCount);
  const [open, setOpen] = useState(false);

  return (
    <section className={`container ${css.wrap}`}>
      {showCount && <div className={css.count}>{count}</div>}

      {showSubtitle && (
        <p className={css.subtitle}>
          улюбленців чекають на новий дім — стань родиною для одного з них
        </p>
      )}

      <div className={css.controls}>
        <label className={css.search}>
          <FiSearch className={css.searchIcon} />
          <input
            className={css.input}
            type="text"
            placeholder="Пошук за ім’ям, віком або ключовими словами"
            value={q}
            onChange={(e) => dispatch(setFilters({ q: e.target.value }))}
            aria-label="Пошук"
          />
        </label>

        <div className={css.filter}>
          <button
            type="button"
            className={css.filterBtn}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="filter-sheet"
          >
            <span>Кого шукаємо ?</span>
            <svg className={css.chev} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <Filter open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
