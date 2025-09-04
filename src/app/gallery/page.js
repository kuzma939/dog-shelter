
import AnimalsBar from "../../components/AnimalsBar/AnimalsBar";
import Gallery from "../../components/Gallery/Gallery";

export const metadata = {
  title: "Галерея — Dog Shelter",
};

export default function GalleryPage() {
  return (
    <main className="container" style={{ paddingBlock: 32 }}>
       <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 64,  lineHeight: "56px", margin: "12px 0 8px"  }}>
        Галерея
      </h1>
      <AnimalsBar showCount={false} showSubtitle={false} />
      <Gallery pageSize={12} />

    </main>
  );
}
