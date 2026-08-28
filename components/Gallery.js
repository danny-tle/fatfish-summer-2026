"use client";
import Reveal from "./Reveal";
import { useLocation } from "@/context/LocationContext";
import { GALLERY_IMAGES } from "@/lib/locations";

export default function Gallery() {
  const { activeId } = useLocation();
  const dir = activeId || "west-valley";

  // set B is a duplicate, hidden from assistive tech, so the marquee loop
  // (translateX -50%) always has a second copy to slide into
  const slides = [...GALLERY_IMAGES.map((s) => ({ ...s, hidden: false })), ...GALLERY_IMAGES.map((s) => ({ ...s, hidden: true }))];

  return (
    <section className="marquee" aria-label="Sushi gallery" aria-roledescription="auto-scrolling gallery">
      <Reveal as="p" className="kicker marquee__kicker">Straight from the sushi bar</Reveal>
      <div className="marquee__viewport">
        <div className="marquee__track">
          {slides.map((s, i) => (
            <figure className="slide" key={i} aria-hidden={s.hidden || undefined}>
              <img data-locimg={s.file} src={`/img/${dir}/${s.file}`} alt={s.hidden ? "" : s.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
