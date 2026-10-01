"use client";
import Reveal from "./Reveal";
import { useLocation } from "@/context/LocationContext";
import { GALLERY_IMAGES } from "@/lib/locations";

export default function Gallery() {
  const { activeId } = useLocation();
  const dir = activeId || "west-valley";

  const images = GALLERY_IMAGES[dir] || GALLERY_IMAGES["west-valley"];

  // second copy of the set so the -50% marquee loop is seamless
  const slides = [...images.map((s) => ({ ...s, hidden: false })), ...images.map((s) => ({ ...s, hidden: true }))];

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
