"use client";

import Image from "next/image";
import css from "./BottomPhotos.module.css";

export default function BottomPhotos({
  leftSrc = "/image/gallery.jpg",
  rightSrc = "/image/gallery.jpg",
}) {
  return (
        <section className={css.bleed} aria-label="Фотографії з притулку">
      <div className={css.inner}>
        <figure className={css.figure}>
          <Image src={leftSrc} alt="Собаки на подвір’ї" fill sizes="748px" priority />
        </figure>

        <figure className={css.figure}>
          <Image src={rightSrc} alt="Собаки біжать" fill sizes="748px" priority />
        </figure>
      </div>
    </section>
  );
}
