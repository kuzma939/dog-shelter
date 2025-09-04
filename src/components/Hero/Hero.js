"use client";
import React from "react";
import css from "./Hero.module.css";
import Link from "next/link";
export default function Hero() {
  return (
    <section className={css.hero}>
      <div className={css.bg} />
      <div className="container">
        <div className={css.inner}>
          <Link href="/gallery" className={css.button} aria-label="Перейти до галереї">
            <span>Знайти Друга</span>
          </Link>
         

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
