"use client";
import Reveal from "./Reveal";
import { useLocation } from "@/context/LocationContext";

export default function Story() {
  const { activeId, location, fading } = useLocation();
  const dir = activeId || "west-valley";

  return (
    <section className="thirds" id="story">
      <Reveal className="thirds__media" stagger={0}>
        <img data-locimg="mural.png" src={`/img/${dir}/mural.png`} alt="Fat Fish mural" loading="lazy" />
      </Reveal>
      <Reveal className="thirds__text" stagger={1}>
        <p className="kicker story__kicker">{location ? location.kicker : "Fat Fish — West Valley"}</p>
        <p className="lede story__text">
          {location
            ? location.story
            : "Fat Fish opened its doors in 2013 offering innovative sushi with a Vietnamese twist. With a focus on quality and affordable sushi and pho, Fat Fish has become one of the most popular spots in the Salt Lake Valley for anyone looking to eat fresh and made to order food."}
        </p>
      </Reveal>
      <Reveal className="thirds__media thirds__media--tall" stagger={2}>
        <img data-locimg="sakeAndSushi.png" src={`/img/${dir}/sakeAndSushi.png`} alt="Sake and sushi" loading="lazy" />
      </Reveal>
    </section>
  );
}
