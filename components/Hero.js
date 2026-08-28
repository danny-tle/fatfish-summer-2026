"use client";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const ADDRS = ["1980 W 3500 S · West Valley City, UT 84119", "595 W 2600 S · Bountiful, UT 84010"];
const CITIES = ["West Valley City, UT", "Bountiful, UT"];

// independent of the site's active-location picker — this just auto-cycles
// the two addresses on its own timer, same as the vite version.
function useFlipRotate(reduceMotion) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | out | in
  const addrRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setPhase("out");
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % ADDRS.length);
        setPhase("in");
      }, 280);
    }, 4000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (phase !== "in") return;
    // force a reflow on both tiles so the "jump to the far edge" actually
    // registers before the transition back to flat runs
    if (addrRef.current) void addrRef.current.offsetWidth;
    if (cityRef.current) void cityRef.current.offsetWidth;
    setPhase("idle");
  }, [phase]);

  const flipClass = phase === "out" ? "flip-out" : phase === "in" ? "flip-in" : "";
  return { index, flipClass, addrRef, cityRef };
}

function useClock() {
  const [text, setText] = useState("");
  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setText("— " + h + ":" + m + ":" + s);
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return text;
}

export default function Hero() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const { index, flipClass, addrRef, cityRef } = useFlipRotate(reduceMotion);
  const clock = useClock();

  return (
    <section className="hero" id="hero">
      <svg className="hero__backdrop" viewBox="0 0 64 40" aria-hidden="true">
        <use href="#pufferfish" />
      </svg>

      <div className="hero__inner">
        <h1 className="hero__title">
          <Reveal as="span">INVENTIVE SUSHI</Reveal>
          <Reveal as="span">&amp; PHO, CRAFTED</Reveal>
          <Reveal as="span">WITH INTENTION</Reveal>
        </h1>
        <Reveal as="p" className="hero__sub">
          <span className={"hero__addr " + flipClass} ref={addrRef}>{ADDRS[index]}</span>
        </Reveal>
      </div>

      <Reveal className="hero__scroll">
        <span>Scroll</span>
        <i></i>
      </Reveal>

      <Reveal className="hero__time">
        <span className={"hero__timeCity " + flipClass} ref={cityRef}>{CITIES[index]}</span>
        <span className="hero__clock">{clock}</span>
      </Reveal>
    </section>
  );
}
