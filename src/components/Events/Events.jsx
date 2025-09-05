"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import css from "./Events.module.css";

const DATA_URL = "/data/events.json"; 

export default function Events({ limit = 3 }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(DATA_URL, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (alive) setItems(Array.isArray(d) ? d : []); })
      .catch((e) => { console.error(e); setErr("Не вдалося завантажити події"); });
    return () => { alive = false; };
  }, []);

  const list = items.slice(0, limit);

  return (
    <section className={`container ${css.wrap}`} id="events">
      <h2 className={css.title}>Останні події</h2>

      <div className={css.grid}>
        {list.map((e) => <Card key={e.id} e={e} />)}
      </div>
<span id="events" className={css.anchor} aria-hidden="true" />
      {err && <p className={css.error}>{err}</p>}
    </section>
  );
}
function Card({ e }) {
  const caption =
    e.text ?? [e.title, e.desc].filter(Boolean).join(". ").replace(/\.\s*\./g, ".");
  const isExt = typeof e.href === "string" && e.href.startsWith("http");

  return (
    <a
      className={css.card}
      href={e.href || "#"}
      target={isExt ? "_blank" : undefined}
      rel={isExt ? "noopener noreferrer" : undefined}
    >
      <div className={css.imageWrap}>
        <Image
          src={e.image}
          alt={caption}
          fill
          sizes="(max-width: 900px) 90vw, (max-width: 1200px) 45vw, 410px"
        />
      </div>

      <p className={css.caption}>{caption}</p>
    </a>
  );
}
