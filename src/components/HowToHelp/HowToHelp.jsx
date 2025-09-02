import css from "./HowToHelp.module.css";
import { FaPaw } from "react-icons/fa";

export default function HowToHelp() {
  return (
    <div className={css.wrapper}>
      <div className="container">
        <h2 className={css.h2}>Як допомогти?</h2>
        <p className={css.p1}>
          Один із найефективніших способів допомоги – підтримати матеріально.
          Ваші пожертвування в повному обсязі витрачаються на утримання собак
          Центру допомоги бездомним тваринам, у тому числі на забезпечення
          повного циклу лікування тварин, а також догляду за тяжкохворими
          собаками
        </p>
        <FaPaw className={css.paw} />
        <p className={css.p2}>
          Ви не можете допомогти кожній тварині, але Ви можете ощасливити хоча б
          одну собаку! Подаруйте їм свою підтримку!
        </p>
        <button className={css.button}>Допомогти тваринкам</button>
      </div>
    </div>
  );
}
