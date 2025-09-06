"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import css from "./TeamStrip.module.css";

export default function TeamStrip({ items = [] }) {
  const railRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollBy = (dx) =>
    railRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div className={css.scrollerWrap}>
      <button className={`${css.navBtn} ${css.left}`} onClick={() => scrollBy(-420)} disabled={atStart}>‹</button>

      <ul ref={railRef} className={css.rail}>
        {items.map((m) => (
          <li key={m.id} className={css.card}>
            <div className={css.poster}>
              <Image src={m.photo} alt={m.name} fill sizes="(max-width: 900px) 80vw, 414px" />
              <div className={css.caption}>
                <b className={css.name}>{m.name}</b>
                <span className={css.role}>{m.role}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button className={`${css.navBtn} ${css.right}`} onClick={() => scrollBy(420)} disabled={atEnd}>›</button>
    </div>
  );
}
