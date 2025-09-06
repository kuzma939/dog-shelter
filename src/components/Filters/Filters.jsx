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
  const dispatch  = useDispatch();
  const filters   = useSelector(selectFilters);
  const count     = useSelector(selectFilteredCount);
  const sheetRef  = useRef(null);


  const ageMin     = filters.ageMin ?? 0;
  const ageMax     = filters.ageMax ?? 20;
  const weightMin  = filters.weightMin ?? 0;
  const weightMax  = filters.weightMax ?? 60;

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
      <div className={css.sheet} id="filter-sheet" ref={sheetRef}>
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

        {/* вік */}
        <div className={css.row}>
          <div className={css.label}>Вік</div>
          <div className={css.sliderBox}>
            <Slider
  min={0}
  max={20}
  value={ageMax}
  onChange={(v) => dispatch(setFilters({ ageMax: v }))}  
  className={css.slider}
/>
<div className={css.scale}><span>0</span><span>20</span></div>
           
          </div>
        </div>

        <div className={css.row}>
          <div className={css.label}>Вага в кг</div>
          <div className={css.sliderBox}>
            <Slider
  min={0}
  max={60}
  value={weightMax}
  onChange={(v) => dispatch(setFilters({ weightMax: v }))} 
  className={css.slider}
/>
<div className={css.scale}><span>0</span><span>60</span></div>

          </div>
        </div>

        <div className={css.actions}>
          <button className={css.apply} onClick={onClose}>
            Знайдено {count} собак
          </button>
          <button
            className={css.reset}
            onClick={() => dispatch(resetFilters())}
          >
            Скинути
          </button>
        </div>
      </div>
    </div>
  );
}
