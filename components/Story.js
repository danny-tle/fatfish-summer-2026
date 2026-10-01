"use client";
import Reveal from "./Reveal";
import { useLocation } from "@/context/LocationContext";
import { STORY_IMAGES } from "@/lib/locations";

export default function Story() {
  const { activeId, location, fading } = useLocation();
  const dir = activeId || "west-valley";
  const [first, second] = STORY_IMAGES[dir] || STORY_IMAGES["west-valley"];

  return (
    <section className="thirds" id="story">
      <Reveal className="thirds__media" stagger={0}>
        <img data-locimg={first.file} src={`/img/${dir}/${first.file}`} alt={first.alt} loading="lazy" />
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
        <img data-locimg={second.file} src={`/img/${dir}/${second.file}`} alt={second.alt} loading="lazy" />
      </Reveal>
    </section>
  );
}
