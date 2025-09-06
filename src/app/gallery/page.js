import AnimalsBar from "../../components/AnimalsBar/AnimalsBar.jsx";
import Gallery from "../../components/Gallery/Gallery";
import BottomPhotos from "../../components/GalerryBottomPhotos/BottomPhotos.jsx";
import css from "./page.module.css";

export const metadata = { title: "Галерея — Dog Shelter" };

export default function GalleryPage() {
  return (
    <main className={css.page}>
      <div className="container">
        <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 64, lineHeight: "56px", margin: "12px 0 8px" }}>
          Галерея
        </h1>
      </div>

      
      <AnimalsBar showCount={false} showSubtitle={false} />
      <Gallery pageSize={12} />

      <BottomPhotos
        leftSrc="/image/galerry1.jpg"
        rightSrc="/image/galerry2.png"
      />
    </main>
  );
}
