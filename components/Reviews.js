"use client";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";

const FALLBACK = {
  text: "Excellent service and very good communication with the customer from the staff. I will definitely return and recommend this place to my friends and acquaintances.",
  name: "Luis Quintero",
  rating: 5,
};

export default function Reviews() {
  const [pick, setPick] = useState(FALLBACK);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    fetch("/data/reviews.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const pool = (data.reviews || []).filter((rv) => rv.rating >= 4);
        if (!pool.length) return; // keep the hardcoded fallback

        const last = sessionStorage.getItem("ff_lastReview");
        const choices = pool.length > 1 ? pool.filter((rv) => rv.text !== last) : pool;
        const chosen = choices[Math.floor(Math.random() * choices.length)];

        function apply() {
          setPick(chosen);
          sessionStorage.setItem("ff_lastReview", chosen.text);
        }

        if (!reduceMotion) {
          setSwapping(true);
          window.setTimeout(() => {
            apply();
            setSwapping(false);
          }, 200);
        } else {
          apply();
        }
      })
      .catch(() => {}); // fetch failed — leave the fallback review in place
  }, []);

  const stars = "★★★★★".slice(0, Math.round(pick.rating));

  return (
    <section className="reviews" aria-label="Guest reviews">
      <Reveal as="p" className="reviews__eyebrow">
        <span className="reviews__stars" aria-hidden="true">★★★★★</span>
        <span>What guests are saying</span>
      </Reveal>
      <Reveal as="figure" className={"reviews__card" + (swapping ? " is-swapping" : "")}>
        <blockquote className="reviews__quote">{pick.text}</blockquote>
        <figcaption className="reviews__cite">
          <span className="reviews__name">{pick.name}</span>
          <span className="reviews__meta">
            <span className="reviews__rating" aria-label={`${Math.round(pick.rating)} out of 5 stars`}>{stars}</span>
            <span className="reviews__dot">·</span>
            <span className="reviews__src">via Google</span>
          </span>
        </figcaption>
      </Reveal>
    </section>
  );
}
