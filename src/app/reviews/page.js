import React from "react";
import main from "../../../public/image/reviews/img_main.png";
import img1 from "../../../public/image/reviews/img_1.png";
import img2 from "../../../public/image/reviews/img_2.png";
import img3 from "../../../public/image/reviews/img_3.png";
import img4 from "../../../public/image/reviews/img_4.png";
import Image from "next/image.js";

export default function Reviews() {
  return (
    <div className="container">
      <h2 className="mb-[67px] mt-8 font-bold text-6xl text-center">Відгуки</h2>
      <div className="flex gap-[140px]">
        <Image
          src={main}
          alt="Decorative picture with dog"
          width={413}
          height={478}
        />
        <p className="font-medium text-2xl pr-30">
          «Я давно мріяв про собаку, і коли дізнався про цей притулок, вирішив
          спробувати знайти тут свого друга та познайомився з дівчинкою на ім’я
          Луна — вона одразу підбігла й подивилася такими довірливими очима, що
          я зрозумів: це моя собака. Волонтери дуже допомогли, розповіли про її
          характер та особливості догляду. Уже кілька місяців Луна живе зі мною
          вдома — вона стала найвірнішим другом і наповнила життя теплом та
          радістю. Я безмежно вдячний притулку за їхню працю та за те, що
          подарували мені справжнього члена сім’ї.»
        </p>
      </div>
      <div className="mt-[180px] grid grid-cols-1 md:grid-cols-2 gap-[100px]">
        <div className="w-full flex items-end gap-8">
          <Image
            src={img1}
            width={288}
            height={370}
            alt="Decorative picture with dog"
          />
          <p className="font-medium text-lg">
            «Ми взяли Барні кілька місяців тому, і він чудово вписався в нашу
            сім’ю. Це найрадісніший і найвідданіший пес, якого можна уявити.»
          </p>
        </div>

        <div className="w-full flex items-end gap-8">
          <Image
            width={288}
            height={370}
            src={img2}
            alt="Decorative picture with dog"
          />
          <p className="font-medium text-lg">
            «Притулок допоміг нам знайти справжнього друга — собаку на ім’я
            Белла. Вона ніжна й лагідна, і тепер ми не уявляємо життя без неї.»
          </p>
        </div>

        <div className="w-full flex items-end gap-8">
          <Image
            width={288}
            height={370}
            src={img3}
            alt="Decorative picture with dog"
          />
          <p className="font-medium text-lg">
            «Я прихистила молодого пса Чарлі, і він одразу став моїм напарником
            у пробіжках. Дуже вдячна волонтерам за підтримку та поради.»
          </p>
        </div>

        <div className="w-full flex items-end gap-8">
          <Image
            width={288}
            height={370}
            src={img4}
            alt="Decorative picture with dog"
          />
          <p className="font-medium text-lg">
            «Забрали до себе собачку Мілу, і вона швидко подружилася з дітьми.
            Тепер у нашому домі ще більше радості й сміху.»
          </p>
        </div>
      </div>
      <button className="block font-bold text-3xl my-10 mx-auto bg-[#99621e] text-white rounded-[40px] w-[522px] h-[143px]">
        Залишити коментар
      </button>
    </div>
  );
}
