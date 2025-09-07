'use client'; 
import { useState } from 'react';    
import React from "react";
import css from "./FAQ.module.css";
import { GiCheckMark } from "react-icons/gi";
import { FaPaw } from "react-icons/fa";
import Image from "next/image";
import dog_faq from "../../../public/faq_dog.png";
import SuccessModal from "../../components/SuccessModal/SuccessModal.jsx";
export default function FAQ() {
    const [open, setOpen] = useState(false);
      const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: заміни URL на свій бекенд
      const res = await fetch("/api/adoption", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });

      if (!res.ok) throw new Error("Failed");

      // якщо бек відповів успішно — показуємо модалку
      setOpen(true);
      e.currentTarget.reset();
    } catch (err) {
      // тут можна показати toast/error
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className={css.flex}>
        <h2 className={css.heading}>Часті питання(FAQ)</h2>
        <div className={css.div}>
          <GiCheckMark className={css.check} />
          <h3 className={css.h3}>Умови всиновлення</h3>
          <p className={css.p}>
            Ми хочемо, щоб кожен наш підопічний потрапив у дбайливі та надійні
            руки. Тому перед всиновленням ми знайомимося з майбутніми
            господарями, дізнаємося про умови проживання та готовність до
            відповідальності. Усі собаки віддаються лише повнолітнім людям після
            короткої співбесіди та підписання договору. Також ми просимо бути
            готовими до витрат на харчування, вакцинацію, ветеринарні огляди та
            прогулянки. Наше головне правило просте: собака має стати
            повноправним членом родини, оточеним любов’ю, турботою та повагою.
          </p>
          <h4 className={css.h4}>Основні умови всиновлення собаки</h4>
          <ol className={css.ol}>
            <li className={css.li}>
              Повноліття — собаку можуть всиновити лише особи від 18 років.
            </li>
            <li className={css.li}>
              Співбесіда — коротке знайомство з майбутніми господарями та
              умовами проживання
            </li>
            <li className={css.li}>
              Договір — обов’язкове підписання договору про відповідальне
              ставлення до тварини
            </li>
            <li className={css.li}>
              Готовність до витрат — харчування, вакцинація, ветеринарні
              послуги, прогулянки.
            </li>
            <li className={css.li}>
              Любов i турбота — собака має стати повноправним членом вашої
              сім’ї.
            </li>
          </ol>
          <FaPaw className={css.paw} />
        </div>
        <div className={css.div}>
          <GiCheckMark className={css.check} />
          <h3 className={css.h3}>Знайшли безпритульного собаку?</h3>
          <p className={css.p}>
            Ми знаємо, як важко пройти повз тварину, яка потребує допомоги. Якщо
            ви знайшли собаку на вулиці, будь ласка, спершу зателефонуйте нам та
            узгодьте можливість її прийняття. Наші ресурси обмежені: кількість
            місць, корму та ветеринарної допомоги залежить від підтримки
            небайдужих людей. Якщо зараз немає можливості одразу прихистити
            собаку, ми допоможемо порадою: куди звернутися, як тимчасово
            забезпечити тварину їжею чи безпечним місцем. Також ви можете стати
            опікуном — утримувати собаку у себе вдома, а ми допоможемо з
            харчуванням та лікуванням. Разом ми зможемо дати чотирилапим більше
            шансів на нове, щасливе життя.
          </p>
          <FaPaw className={css.paw} />
        </div>
        <div className={css.div}>
          <GiCheckMark className={css.check} />
          <h3 className={css.h3}>Як стати волонтером</h3>
          <p className={css.p}>
            Ми завжди відкриті для нових друзів, які готові подарувати свій час
            і тепло нашим собакам. Щоб стати волонтером, достатньо заповнити
            форму на сайті або зв’язатися з нами телефоном. Після короткої
            розмови ми домовимося про зручний час вашого візиту до притулку.
            Волонтери допомагають у різний спосіб: вигулюють собак, прибирають у
            вольєрах, граються з цуценятами, допомагають годувати чи
            супроводжувати на ветеринарні огляди. Ваш навіть кількагодинний
            внесок — безцінний для наших хвостиків
          </p>
          <FaPaw className={css.paw} />
        </div>
        <div className={css.div}>
          <GiCheckMark className={css.check} />

          <h3 className={css.h3}>Як допомогти без фінансів</h3>
          <p className={css.p}>
            Не обов’язково робити грошові внески, щоб змінювати життя собак на
            краще. Ви можете подарувати їм свій час — вигуляти, погратися або
            просто обійняти. Дуже цінною є допомога з прибиранням у вольєрах,
            перевезенням речей чи розповсюдженням інформації про наших
            підопічних у соцмережах. Також можна приносити речі: ковдри, миски,
            іграшки чи корм. Навіть невеликий внесок у вигляді уваги, тепла та
            дій допомагає хвостику відчути, що він важливий і потрібний.
          </p>
          <FaPaw className={css.paw} />
        </div>
      </div>
      <div className={css.pawDiv}>
        <FaPaw className={css.bigPaw} />
        <Image
          src={dog_faq}
          width={867}
          height={733}
          alt="decorative dog picture"
          className={css.img}
        />
        <p className={css.pawP}>Допомогти може кожен</p>
           <SuccessModal open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
