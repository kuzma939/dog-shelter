import React from "react";
import css from "./Header.module.css";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Header() {
  return (
    <header className="container">
      <div className={css.div}>
        <button className={css.button}>Галерея</button>
        <button className={css.button}>Відгуки</button>
        <button className={css.button}>Про нас</button>
        <GiHamburgerMenu className={css.svg} />
      </div>
    </header>
  );
}
