import Image from "next/image";
import Hero from "../components/Hero/Hero.js";
import HowToHelp from "../components/HowToHelp/HowToHelp.jsx";
import Address from "../components/Address/Address.jsx";
import AnimalsBar from "../components/AnimalsBar/AnimalsBar.js"
export default function Home() {
  return (
 <main className="flex flex-col gap-0">
        <Hero />
        < AnimalsBar />
       
        <HowToHelp />
      </main>
 
    
  );
}