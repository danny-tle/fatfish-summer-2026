"use client";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const ADDRS = ["1980 W 3500 S · West Valley City, UT 84119", "595 W 2600 S · Bountiful, UT 84010"];
const CITIES = ["West Valley City, UT", "Bountiful, UT"];

// cycles the two addresses on a timer. separate from the location picker.
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
    // force a reflow so the flip restarts from the far edge
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
      <div className="hero__backdrop" aria-hidden="true">
        {/* above the fold, so no lazy load. opacity/grayscale knobs are in globals.css */}
        <img src="/img/hero.jpg" alt="" fetchPriority="high" />
      </div>

      {/* headline is off for now. hidden h1 so the page still has one */}
      <h1 className="sr-only">Fat Fish &mdash; Inventive Sushi &amp; Pho</h1>

      {/* scroll cue + rotating address + clock, all one row */}
      <div className="hero__foot">
        <Reveal className="hero__scroll" immediate>
          <span>Scroll</span>
          <i></i>
        </Reveal>

        <Reveal as="p" className="hero__sub" immediate>
          <span className={"hero__addr " + flipClass} ref={addrRef}>{ADDRS[index]}</span>
        </Reveal>

        <Reveal className="hero__time" immediate>
          <span className={"hero__timeCity " + flipClass} ref={cityRef}>{CITIES[index]}</span>
          <span className="hero__clock">{clock}</span>
        </Reveal>
      </div>
    </section>
  );
}
