import React from "react";
import css from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={css.hero}>
      <div className={css.bg} />
      <div className="container">
        <div className={css.inner}>
          <a href="#adopt" className={css.button}>
            <span>Знайти Друга</span>
          </a>

          <div className={css.info}>
            <p className={css.line}>Понеділок — Неділя</p>
            <p className={css.line}>8:00 — 21:00</p>
            <p className={css.line}>пр. Академіка Глушкова 1</p>
            <p className={css.line}>Київ 03127</p>
          </div>
        </div>
      </div>
    </section>
  );
}
