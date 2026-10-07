"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import { LOCATIONS, LOCATION_IDS } from "@/lib/locations";
import { telHref } from "@/lib/tel";

export default function Contact() {
  const [unsent, setUnsent] = useState(false);

  // no backend for this form yet. say so plainly instead of pretending it sent.
  function onSubmit(e) {
    e.preventDefault();
    setUnsent(true);
  }

  return (
    <section className="contact" id="contact">
      <Reveal as="header" className="contact__head">
        <p className="kicker">Say hello</p>
        <h2>Contact Us</h2>
      </Reveal>
      <Reveal as="form" className="contact__form" onSubmit={onSubmit}>
        <div className="field2">
          <label>First Name<input type="text" name="first" autoComplete="given-name" required /></label>
          <label>Last Name<input type="text" name="last" autoComplete="family-name" required /></label>
        </div>
        <label>Email Address<input type="email" name="email" autoComplete="email" spellCheck={false} required /></label>
        <label>Subject<input type="text" name="subject" autoComplete="off" required /></label>
        <label>Message<textarea name="message" rows={5} autoComplete="off" required></textarea></label>
        <button className="btn btn--solid" type="submit">Send Message</button>
        {/* live region stays mounted so the message is announced when it appears */}
        <p className="contact__status" role="status">
          {unsent && (
            <>
              Online messages aren&rsquo;t connected yet, so this wasn&rsquo;t sent. Call us instead:{" "}
              {LOCATION_IDS.map((id, i) => (
                <span key={id}>
                  {i > 0 && " or "}
                  {LOCATIONS[id].label} at <a href={telHref(LOCATIONS[id].phone)}>{LOCATIONS[id].phone}</a>
                </span>
              ))}
              .
            </>
          )}
        </p>
      </Reveal>
    </section>
  );
}
