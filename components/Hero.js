"use client";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { useReduceMotion } from "@/hooks/useReduceMotion";

const ADDRS = ["1980 W 3500 S · West Valley City, UT 84119", "595 W 2600 S · Bountiful, UT 84010"];
const CITIES = ["West Valley City, UT", "Bountiful, UT"];

// cycles the two addresses on a timer. separate from the location picker.
function useFlipRotate(stopped) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | out | in
  const addrRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(() => {
    if (stopped) return;
    const id = window.setInterval(() => {
      setPhase("out");
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % ADDRS.length);
        setPhase("in");
      }, 280);
    }, 4000);
    return () => window.clearInterval(id);
  }, [stopped]);

  // next frame, so the browser has painted the flipped-over state before we
  // force a reflow and let it transition back to flat
  useEffect(() => {
    if (phase !== "in") return;
    const raf = requestAnimationFrame(() => {
      if (addrRef.current) void addrRef.current.offsetWidth;
      if (cityRef.current) void cityRef.current.offsetWidth;
      setPhase("idle");
    });
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const flipClass = phase === "out" ? "flip-out" : phase === "in" ? "flip-in" : "";
  return { index, flipClass, addrRef, cityRef };
}

// both stores are on mountain time, so show that rather than the visitor's own clock
const CLOCK = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZone: "America/Denver",
});

function useClock() {
  const [text, setText] = useState("");
  useEffect(() => {
    function tick() {
      setText("— " + CLOCK.format(new Date()));
    }
    // no first tick here: the picker covers the hero for longer than a second,
    // so nobody sees the blank, and it keeps setState out of the effect body.
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return text;
}

export default function Hero() {
  const reduceMotion = useReduceMotion();
  const [paused, setPaused] = useState(false);
  const { index, flipClass, addrRef, cityRef } = useFlipRotate(reduceMotion || paused);
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
        <Reveal className="hero__scroll" immediate aria-hidden="true">
          <span>Scroll</span>
          <i></i>
        </Reveal>

        <Reveal as="p" className="hero__sub" immediate>
          <span className={"hero__addr " + flipClass} ref={addrRef}>{ADDRS[index]}</span>
        </Reveal>

        <Reveal className="hero__time" immediate>
          <span className={"hero__timeCity " + flipClass} ref={cityRef}>{CITIES[index]}</span>
          <span className="hero__clock">{clock}</span>
          {!reduceMotion && (
            <button
              type="button"
              className="hero__pause"
              aria-label={paused ? "Resume address rotation" : "Pause address rotation"}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? "Play" : "Pause"}
            </button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
