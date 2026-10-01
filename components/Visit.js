import Reveal from "./Reveal";
import { LOCATIONS } from "@/lib/locations";

// always shows both stores. doesn't follow the location picker.
export default function Visit() {
  const wv = LOCATIONS["west-valley"];
  const bt = LOCATIONS["bountiful"];

  return (
    <section className="visit" id="locations">
      <Reveal className="visit__place">
        <h3>{wv.label}</h3>
        <p className="visit__addr">{wv.address}<br />{wv.cityState}</p>
        <p className="visit__phone">{wv.phone}</p>
        <dl className="hours">
          {wv.hours.map((h) => (
            <div key={h.day}><dt>{h.day}</dt><dd>{h.time}</dd></div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="visit__place">
        <h3>{bt.label}</h3>
        <p className="visit__addr">{bt.address}<br />{bt.cityState}</p>
        <p className="visit__phone">{bt.phone}</p>
        <p className="visit__note">{bt.note}</p>
      </Reveal>
    </section>
  );
}
