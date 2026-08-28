// renders one section (Sushi Bar, Pho, Beer, ...). same three styles as the
// vite site's buildSection(): "grouped" (drinks — subcategory blocks), "described"
// (name + detail/parts), and the tags default (plain n-across list).
export default function MenuSection({ section }) {
  return (
    <div className="menu">
      <h3 className="menu__title">
        {section.title}{" "}
        {section.note && <span>{section.note}</span>}
      </h3>

      {section.style === "grouped" ? (
        <div className="menu__groups" style={{ "--menu-cols": section.columns || 2 }}>
          {(section.groups || []).map((grp, i) => (
            <div className="menu__group" key={i}>
              {grp.label && <p className="menu__cat">{grp.label}</p>}
              <p className="menu__para">
                {(grp.items || []).map((item, idx) => (
                  <span key={item.name}>
                    {idx > 0 && " · "}
                    <span className={item.available === false ? "is-out" : undefined}>{item.name}</span>
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <MenuList section={section} />
      )}

      {section.link?.href && (
        <a className="menu__link" href={section.link.href} target="_blank" rel="noopener">
          {section.link.label || "View more"}
        </a>
      )}
    </div>
  );
}

function MenuList({ section }) {
  const described = section.style === "described";
  return (
    <ul className={"menu__cols" + (described ? " menu__cols--described" : "")} style={{ "--menu-cols": section.columns || 3 }}>
      {(section.items || []).map((item) => (
        <li key={item.name} className={item.available === false ? "is-soldout" : undefined}>
          {described ? (
            <>
              <strong>{item.name}</strong>{" "}
              {item.parts && item.parts.length ? (
                item.parts.map((p, idx) => (
                  <span key={p.name}>
                    {idx > 0 && " · "}
                    <span className={p.available === false ? "is-out" : undefined}>{p.name}</span>
                  </span>
                ))
              ) : (
                item.detail
              )}
            </>
          ) : (
            <>
              {item.name}
              {item.detail && <> <em>{item.detail}</em></>}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
