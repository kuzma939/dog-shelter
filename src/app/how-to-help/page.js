import React from "react";
import { LiaHandshakeSolid } from "react-icons/lia";
import { GiReceiveMoney } from "react-icons/gi";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaPaw } from "react-icons/fa";

export default function HowToHelp() {
  return (
    <div className="relative">
      <FaPaw className="text-[#99621e] opacity-10 mix-blend-multiply w-[500px] h-[420px] rotate-45 absolute top-[-90px] left-0 -z-10" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <FaPaw className="text-[#99621e] opacity-10 mix-blend-multiply w-[714px] h-[665px] rotate-[215deg] absolute right-0 top-20" />
        <FaPaw className="text-[#99621e] opacity-10 mix-blend-multiply w-[930px] h-[860px] rotate-0 absolute left-[-220px] top-80" />
        <FaPaw className="text-[#99621e] opacity-10 mix-blend-multiply w-[730px] h-[860px] rotate-[-45deg] absolute right-20 top-[720px]" />
        <FaPaw className="text-[#99621e] opacity-10 mix-blend-multiply w-[1000px] h-[820px] rotate-45 absolute bottom-[120px] left-[-40px]" />
        <FaPaw className="text-[#99621e] opacity-10 mix-blend-multiply w-[930px] h-[860px] rotate-[-45deg] absolute bottom-[-400px] right-0" />
      </div>
      <h2 className="font-bold text-[64px] text-center relative z-10 mb-30">
        Як допомогти
      </h2>
      <div className="flex flex-col gap-[52px] mb-[230px] ">
        <div className="pl-[190px] pr-[215px] relative bg-white  pt-30 pb-40">
          <LiaHandshakeSolid className="size-[117px] text-[#99621e] absolute top-[100px] left-16" />
          <h3 className="font-bold text-[32px] mb-7">Волонтерство</h3>
          <p className="text-2xl">
            Волонтерство — це можливість подарувати безпритульним собакам увагу,
            тепло та турботу. Ви можете допомогти вигулювати наших хвостиків,
            прибрати у вольєрах, погратися з ними чи пригостити смачним кормом.
            Навіть кілька годин вашого часу стають для них справжнім святом.
            Кожен дотик, прогулянка чи усмішка роблять собак щасливішими та
            ближчими до нової родини. Долучайтеся — разом ми можемо подарувати
            їм більше любові та шанс на краще життя.
          </p>
        </div>
        <div className="pl-[190px] pr-[215px] relative bg-white  pt-30 pb-40">
          <GiReceiveMoney className="size-[117px] text-[#99621e] absolute top-[60px] left-16" />
          <h3 className="font-bold text-[32px] mb-7">Фінансова підтримка</h3>
          <p className="text-2xl">
            Фінансова допомога — це ще один спосіб врятувати життя безпритульних
            собак. Ваші внески йдуть на корм, ліки, вакцинацію, стерилізацію та
            облаштування вольєрів. Навіть невелика сума допомагає нашим
            хвостикам отримати все необхідне для здоров’я та безпеки. Завдяки
            вашій підтримці ми можемо піклуватися про більшу кількість тварин і
            швидше знаходити їм нові домівки. Разом ми здатні зробити великий
            добрий крок — подарувати собакам шанс на щасливе майбутнє.
          </p>
        </div>
        <div className="pl-[190px] pr-[215px] relative bg-white pt-30 pb-40 ">
          <FaHandHoldingHeart className="size-[117px] text-[#99621e] absolute top-[60px] left-16" />
          <h3 className="font-bold text-[32px] mb-7">Теплі подарунки</h3>
          <p className="text-2xl">
            Крім часу та фінансів, допомогти можна й простими речами. Наші
            собаки завжди потребують ковдр, підстилок, мисок, іграшок та інших
            корисних дрібниць. Такі подарунки роблять їхній побут теплішим,
            комфортнішим і трохи ближчим до домашнього життя. Передаючи речі, ви
            даруєте хвостику турботу і шматочок тепла, яке він так чекає від
            людини.
          </p>
        </div>
      </div>
      <section className=" mx-auto pb-30">
        <form className="bg-[rgba(153,98,30,0.6)] pr-[188px] pl-[296px] pt-40 pb-20 flex flex-col gap-6 mb-40 relative">
          <h2 className="text-center text-2xl font-bold mb-6">
            Форма зворотнього зв’язку
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label>Прізвище та ім’я</label>
              <input
                type="text"
                className="rounded-full px-4 py-2 focus:outline-none bg-white w-[305px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Як саме ви хочете допомогти</label>
              <select className="rounded-full px-4 py-2 focus:outline-none w-[305px] bg-white">
                <option>Фінансова допомога</option>
                <option>Волонтерство</option>
                <option>Інше</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label>Електронна пошта</label>
              <input
                type="email"
                className="rounded-full px-4 py-2 focus:outline-none bg-white w-[305px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Зручний спосіб контакту (пошта/телефон)</label>
              <select className="rounded-full px-4 py-2 focus:outline-none w-[305px] bg-white">
                <option>Електронна пошта</option>
                <option>Телефон</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label>Контактний номер</label>
              <input
                type="tel"
                placeholder="+380"
                className="rounded-full px-4 py-2 focus:outline-none bg-white w-[305px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Коментар</label>
              <textarea className="rounded-2xl px-4 py-2 focus:outline-none min-h-[120px] bg-white w-[522px]"></textarea>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm absolute bottom-[-40px] left-30">
            <input type="checkbox" id="agree" />
            <label htmlFor="agree">Я погоджуюсь на обробку інформації</label>
          </div>
        </form>
        <button
          type="submit"
          className="rounded-[50px] w-[516px] h-[93px] bg-[#99621e] text-white  mx-auto block"
        >
          Залишити заявку
        </button>
      </section>
    </div>
  );
}
