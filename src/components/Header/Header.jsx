"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import css from "./Header.module.css";

export default function Header({ overlay = false }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <header className={overlay ? css.overlay : ""}>
      <div className={`container ${css.div}`}>
        {isHome ? (
          <>
            {/* ті самі 3 кнопки праворуч */}
            <Link href="/gallery"  className={css.button} role="button">Галерея</Link>
            <Link href="/#reviews" className={css.button} role="button">Відгуки</Link>
            <Link href="/#about"   className={css.button} role="button">Про нас</Link>

            <button type="button" className={css.iconBtn} aria-label="Меню">
              <GiHamburgerMenu className={css.svg} />
            </button>
          </>
        ) : (
          <>
            {/* на інших сторінках — теж праворуч */}
            <Link href="/" className={css.button}>На Головну</Link>

            <div className={css.menuWrap} ref={wrapRef}>
              <button
                type="button"
                className={css.iconBtn}
                aria-label="Відкрити меню"
                aria-expanded={open}
                aria-controls="header-menu"
                onClick={() => setOpen((v) => !v)}
              >
                <GiHamburgerMenu className={css.svg} />
              </button>

              <div id="header-menu" className={`${css.menu} ${open ? css.open : ""}`} role="menu">
                <Link href="/gallery"  onClick={() => setOpen(false)}>Галерея</Link>
                <Link href="/#reviews" onClick={() => setOpen(false)}>Відгуки</Link>
                <Link href="/#about"   onClick={() => setOpen(false)}>Про нас</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
