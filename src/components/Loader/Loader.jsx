import { FaPaw } from "react-icons/fa";
import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loaderWrap}>
      <FaPaw className={css.loaderPaw} aria-label="Завантаження" />
      <span className={css.text}>Завантажуємо песиків…</span>
    </div>
  );
}
