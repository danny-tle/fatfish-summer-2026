"use client";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <Reveal as="header" className="contact__head">
        <p className="kicker">Say hello</p>
        <h2>Contact Us</h2>
      </Reveal>
      <Reveal as="form" className="contact__form" onSubmit={(e) => e.preventDefault()}>
        <div className="field2">
          <label>First Name<input type="text" name="first" required /></label>
          <label>Last Name<input type="text" name="last" required /></label>
        </div>
        <label>Email Address<input type="email" name="email" required /></label>
        <label>Subject<input type="text" name="subject" required /></label>
        <label>Message<textarea name="message" rows={5} required></textarea></label>
        <button className="btn btn--solid" type="submit">Submit</button>
      </Reveal>
    </section>
  );
}
