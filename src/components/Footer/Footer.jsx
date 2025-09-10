import React from "react";
import css from "./Footer.module.css";
import { FaPaw } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contacts" className={css.footer}>
      <div className="container">
        <div className={css.wrapper}>
          <div>
            <p>Пн-Нд</p>
            <p>8:00-21:00</p>
            <br />
            <a
              href="https://www.google.com/maps/place/Пр.+Академіка+Глушкова,+1,+Київ,+03137"
              target="_blank"
              rel="noopener noreferrer"
            >
              Пр. Академія Глушкова 1, Київ 03137
            </a>
          </div>
          <div>
            <FaPaw className={css.paw} />
          </div>
          <div>
            <p>Телефон</p>

            <p>066 3266122</p>
            <br />

            <a href="mailto:pet.center@gmail.com">pet.center@gmail.com</a>
          </div>
             
   
        </div>
        <span id="contacts" className={css.anchor} aria-hidden="true" />
      </div>
    </footer>
  );
}
