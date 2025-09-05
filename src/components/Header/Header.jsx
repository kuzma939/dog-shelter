"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";         
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

  const anchor = (id) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header className={overlay ? css.overlay : ""}>
      <div className={`container ${css.div}`}>
        {isHome ? (
          <>
            <Link href="/gallery" className={css.button} role="button">Галерея</Link>
            <Link href={anchor("reviews")} className={css.button} role="button">Відгуки</Link>
            <Link href={anchor("about")}   className={css.button} role="button">Про нас</Link>
          </>
        ) : (
          <Link href="/" className={css.button}>На Головну</Link>
        )}
        <div className={css.menuWrap} ref={wrapRef}>
          <button
            type="button"
            className={css.iconBtn}
            aria-label={open ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={open}
            aria-controls="header-menu"
            onClick={() => setOpen(v => !v)}
          >
            {open ? <RxCross2 className={css.svg}/> : <GiHamburgerMenu className={css.svg}/>}
          </button>
<nav
  id="header-menu"
  className={`${css.menu} ${open ? css.open : ""}`}
  role="menu"
>
  <Link href="/gallery"     role="menuitem" onClick={() => setOpen(false)}>Галерея</Link>
  <Link href="/faq"         role="menuitem" onClick={() => setOpen(false)}>Часті Питання</Link>
 <Link href="/#events" onClick={() => setOpen(false)}>Останні події</Link>

  <Link href="/how-to-help" role="menuitem" onClick={() => setOpen(false)}>Волонтерство</Link>
  <Link href={anchor("contacts")}   role="menuitem" onClick={() => setOpen(false)}>Контакти</Link>
  <Link href={anchor("about")}      role="menuitem" onClick={() => setOpen(false)}>Про нас</Link>
</nav>

        </div>
      </div>
    </header>
  );
}
