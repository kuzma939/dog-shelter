"use client";

import { useDispatch, useSelector } from "react-redux";
import { selectFilters, selectFilteredCount, setFilters } from "../../redux/dogs/slice";
import { FiSearch } from "react-icons/fi";
import css from "./AnimalsBar.module.css";

export default function AnimalsBar() {
  const dispatch = useDispatch();
  const { q, who } = useSelector(selectFilters);
  const count = useSelector(selectFilteredCount);

  const onQueryChange = (e) => dispatch(setFilters({ q: e.target.value }));
  const onWhoChange   = (e) => dispatch(setFilters({ who: e.target.value }));

  return (
    <section className={`container ${css.wrap}`}>
      <div className={css.count}>{count}</div>

      <p className={css.subtitle}>
        улюбленців чекають на новий дім — стань родиною для одного з них
      </p>

      <div className={css.controls}>
  
        <label className={css.search}>
          <FiSearch className={css.searchIcon} />
          <input
            className={css.input}
            type="text"
            placeholder="Пошук"
            value={q}
            onChange={onQueryChange}
          />
        </label>

        <div className={css.filter}>
          <span className={css.filterLabel}>Кого шукаємо ?</span>
          <select
            className={css.select}
            value={who}
            onChange={onWhoChange}
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
