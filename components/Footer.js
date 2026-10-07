export default function Footer() {
  return (
    <footer className="foot">
      {/* parent-company credit, same as the original site */}
      <a
        className="foot__sig"
        href="https://www.sapainvestment.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/img/sig-family.webp"
          alt="Sapa Investment Group — proud to be a part of the SIG family"
          width={840}
          height={336}
          loading="lazy"
        />
      </a>
    </footer>
  );
}
