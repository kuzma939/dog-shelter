import Image from "next/image.js";
import React from "react";
import css from "./Address.module.css";
import addressImg from "../../../public/address@2x.png";

export default function Address() {
  return (
    <div className="container">
      <div className={css.wrapper}>
        <div className={css.text}>
          <p>Понеділок - Неділя</p>
          <p>8:00 - 21:00</p>
          <br />
          <p>пр. Академіка Глушкова 1</p>
          <p>Київ 03127</p>
          <br />
          <br />

          <a href="tel:+38066326122">066 3266122</a>
          <br />
          <a href="mailto:pet.center@gmail.com">pet.center@gmail.com</a>
        </div>
        <Image
          src={addressImg}
          width={732}
          height={536}
          alt="Adopter location"
        />
      </div>
    </div>
  );
}
