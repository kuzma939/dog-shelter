import Image from "next/image";
import css from "./page.module.css";
import TeamStrip from "../../components/About/TeamStrip.jsx";
import { FaPaw } from "react-icons/fa";

const PARTNERS = [
  { id: "p1", src: "/image/about/about1.png", alt: "Royal Canin" },
  { id: "p2", src: "/image/about/about2.png", alt: "Optimeal" },
  { id: "p3", src: "/image/about/about3.png", alt: "Club 4 Paws" },
  { id: "p4", src: "/image/about/about4.png", alt: "Ветклініка" },
  { id: "p5", src: "/image/about/about5.png", alt: "Ветклініка" },
];

const TEAM = [
  {
    id: "anna",
    name: "Кузьма Ганна",
    role: "Lead full-stack developer",
    photo: "/image/about/anja.jpg",
  },
  {
    id: "diana",
    name: "Горбик Діана",
    role: "Lead UX/UI designer",
    photo: "/image/about/diana.jpg",
  },
  {
    id: "olex",
    name: "Озирський Олексій",
    role: "Full-stack developer",
    photo: "/image/about/oleksij.jpg",
  },
  {
    id: "olja",
    name: "Трембіцька Ольга",
    role: "UX/UI designer",
    photo: "/image/about/olja.jpg",
  },
];

export default function AboutPage() {
  return (
    <main className={`container ${css.wrap}`} id="about">
      <div className={css.paws} aria-hidden="true">
        <FaPaw className={`${css.paw} ${css.pawTop}`} />
        <FaPaw className={`${css.paw} ${css.pawBottom}`} />
      </div>
      <h1 className={css.h1}>Про нас</h1>

      <section id="partners" className={`${css.partners} ${css.bleed}`}>
        <h2 className="sr-only">Наші партнери</h2>
        <div className={css.marquee}>
          <div className={css.marqueeContent}>
            {PARTNERS.map((p) => (
              <div key={p.id} className={css.partnerItem}>
                <Image src={p.src} alt={p.alt} width={240} height={60} />
              </div>
            ))}
          </div>

          <div className={css.marqueeContent} aria-hidden="true">
            {PARTNERS.map((p) => (
              <div key={p.id + "-clone"} className={css.partnerItem}>
                <Image src={p.src} alt={p.alt} width={240} height={60} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className={css.section}>
        <h2 className={css.h2}>Наша місія</h2>
        <p className={css.text}>
          Ми рятуємо безпритульних собак, даруємо їм турботу й шанс на нове
          життя в сім’ях. Наша мета — менше тварин на вулицях і більше любові та
          відповідальності в людях.
        </p>
      </section>

      <section id="values" className={css.section}>
        <h2 className={css.h2}>Наші цінності</h2>
        <ul className={css.values}>
          <li>Любов і турбота — кожен собака заслуговує на дім.</li>
          <li>
            Відповідальність — дбаємо про тварин і закликаємо людей робити так
            само.
          </li>
          <li>Прозорість — відкрито показуємо, куди йдуть ресурси.</li>
          <li>
            Спільнота — разом із волонтерами й небайдужими творимо сім’ю добра.
          </li>
          <li>
            Надія — віримо, що навіть травмовані собаки знову знайдуть довіру й
            щастя.
          </li>
        </ul>
      </section>

      <section id="gratitude" className={css.section}>
        <h2 className={css.h2}>Ми вдячні всім, хто не байдужий</h2>
        <p className={css.text}>
          Кожна добра справа наближає наших підопічних до щасливого життя в
          люблячій сім’ї. Ми щиро вдячні всім, хто допомагає — тим, хто бере
          собак до себе, хто підтримує нас фінансово чи ділиться інформацією про
          наших хвостиків. Ваша небайдужість рятує життя. Завдяки вам наші
          собаки отримують другий шанс на любов і турботу.
        </p>
      </section>

      <section id="team" className={css.team}>
        <h2 className={css.h2}>Наша команда</h2>
        <TeamStrip items={TEAM} />
      </section>
    </main>
  );
}
