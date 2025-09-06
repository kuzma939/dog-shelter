import Image from "next/image";
import Hero from "../components/Hero/Hero.jsx";
import HowToHelp from "../components/HowToHelp/HowToHelp.jsx";
import Address from "../components/Address/Address.jsx";
import AnimalsBar from "../components/AnimalsBar/AnimalsBar.jsx";
import Gallery from "../components/Gallery/Gallery.jsx";
import Events from "../components/Events/Events.jsx";
export default function Home() {
  return (
    <main className="flex flex-col gap-0">
      <Hero />
      <AnimalsBar />
      <Gallery />
      <Events />
      <HowToHelp />
      <Address />
    </main>
  );
}
