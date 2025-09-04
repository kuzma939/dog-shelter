"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFilters,
  selectFilteredCount,
  setFilters,
  resetFilters,
} from "@/redux/dogs/slice";
import { FiX } from "react-icons/fi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import css from "./Filter.module.css";

export default function Filter({ open, onClose }) {
  const dispatch = useDispatch();
  const filters  = useSelector(selectFilters);
  const count    = useSelector(selectFilteredCount);
  const sheetRef = useRef(null);


  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const onClickOutside = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const setGender = (gender) => dispatch(setFilters({ gender }));

  if (!open) return null;

  return (
    <div className={css.backdrop} role="dialog" aria-modal="true">
      <div className={css.sheet} ref={sheetRef}>
        <button className={css.close} onClick={onClose} aria-label="Закрити">
          <FiX />
        </button>

        <h3 className={css.title}>Фільтр</h3>

        <div className={css.row}>
          <div className={css.label}>Стать</div>
          <div className={css.radios}>
            <label className={css.radio}>
              <input
                type="radio"
                name="gender"
                value="all"
                checked={filters.gender === "all"}
                onChange={() => setGender("all")}
              />
              <span>Будь-яка</span>
            </label>
            <label className={css.radio}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={filters.gender === "male"}
                onChange={() => setGender("male")}
              />
              <span>♂</span>
            </label>
            <label className={css.radio}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={filters.gender === "female"}
                onChange={() => setGender("female")}
              />
              <span>♀</span>
            </label>
          </div>
        </div>

        <div className={css.row}>
          <div className={css.label}>Вік</div>
          <div className={css.sliderBox}>
            <Slider
              range
              min={0}
              max={10}
              value={[filters.ageMin, filters.ageMax]}
              onChange={([min, max]) =>
                dispatch(setFilters({ ageMin: min, ageMax: max }))
              }
              allowCross={false}
              className={css.slider}
            />
            <div className={css.scale}><span>0</span><span>10</span></div>
          </div>
        </div>

        <div className={css.row}>
          <div className={css.label}>Вага в кг</div>
          <div className={css.sliderBox}>
            <Slider
              range
              min={1}
              max={40}
              value={[filters.weightMin, filters.weightMax]}
              onChange={([min, max]) =>
                dispatch(setFilters({ weightMin: min, weightMax: max }))
              }
              allowCross={false}
              className={css.slider}
            />
            <div className={css.scale}><span>1</span><span>40</span></div>
          </div>
        </div>

        <div className={css.actions}>
          <button className={css.apply} onClick={onClose}>
            Знайдено {count} собак
          </button>
          <button className={css.reset} onClick={() => dispatch(resetFilters())}>
            Скинути
          </button>
        </div>
      </div>
    </div>
  );
}
