/* Ayofemi Studios — Portfolio with lightbox */
const PORTFOLIO = [
  { id: 1, cat: "portraits", label: "folake · 2025", aspect: "4/5" },
  { id: 2, cat: "portraits", label: "ada · home series", aspect: "3/4" },
  { id: 3, cat: "portraits", label: "tom · peckham", aspect: "1/1" },
  { id: 4, cat: "editorial", label: "iron & velvet · vogue", aspect: "3/4" },
  { id: 5, cat: "editorial", label: "london fw · backstage", aspect: "4/5" },
  { id: 6, cat: "editorial", label: "onile ss26", aspect: "16/9" },
  { id: 7, cat: "weddings", label: "tunde & ada", aspect: "4/5" },
  { id: 8, cat: "weddings", label: "kemi & ola · oniru", aspect: "3/4" },
  { id: 9, cat: "weddings", label: "the dance floor", aspect: "1/1" },
  { id: 10, cat: "portraits", label: "studio sitting · 03", aspect: "4/5" },
  { id: 11, cat: "editorial", label: "the harmattan issue", aspect: "3/4" },
  { id: 12, cat: "weddings", label: "the slow morning", aspect: "16/9" },
];
const CATS = ["all", "portraits", "editorial", "weddings"];

function PortfolioScreen() {
  const [cat, setCat] = React.useState("all");
  const [lightbox, setLightbox] = React.useState(null);
  const filtered = cat === "all" ? PORTFOLIO : PORTFOLIO.filter(p => p.cat === cat);

  React.useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(l => {
        const idx = filtered.findIndex(p => p.id === l.id);
        return filtered[(idx + 1) % filtered.length];
      });
      if (e.key === "ArrowLeft") setLightbox(l => {
        const idx = filtered.findIndex(p => p.id === l.id);
        return filtered[(idx - 1 + filtered.length) % filtered.length];
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, filtered]);

  return (
    <div className="fade-in" style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 32px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 16 }}>● Portfolio · {filtered.length} frames</div>
        <h1 className="display" style={{ fontSize: "clamp(60px, 8vw, 128px)", margin: 0 }}>
          The <span style={{ fontStyle: "italic", color: "var(--primary)" }}>archive</span>
        </h1>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 48, flexWrap: "wrap" }}>
        {CATS.map(c => (
          <Tag key={c} active={cat === c} onClick={() => setCat(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
            {c !== "all" && <span style={{ color: cat === c ? "color-mix(in oklch, var(--paper) 60%, transparent)" : "var(--muted)", marginLeft: 6 }}>· {PORTFOLIO.filter(p => p.cat === c).length}</span>}
          </Tag>
        ))}
      </div>

      <div style={{
        columnCount: 3, columnGap: 16,
      }} className="portfolio-grid">
        {filtered.map((p, i) => (
          <button key={p.id} onClick={() => setLightbox(p)}
            style={{
              breakInside: "avoid", display: "block", width: "100%", marginBottom: 16,
              padding: 0, border: 0, background: "none", cursor: "zoom-in",
              animation: `fadeIn 0.4s ease ${i * 0.04}s both`,
            }}>
            <div className="placeholder" data-label={p.label}
              style={{ aspectRatio: p.aspect, width: "100%", borderRadius: 4, transition: "transform 0.4s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
            ></div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
              <span>{p.label}</span>
              <span>{String(p.id).padStart(3, "0")}</span>
            </div>
          </button>
        ))}
      </div>

      {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} all={filtered} setItem={setLightbox} />}
    </div>
  );
}

function Lightbox({ item, onClose, all, setItem }) {
  const idx = all.findIndex(p => p.id === item.id);
  const next = () => setItem(all[(idx + 1) % all.length]);
  const prev = () => setItem(all[(idx - 1 + all.length) % all.length]);
  return (
    <div onClick={onClose} className="fade-in" style={{
      position: "fixed", inset: 0, background: "color-mix(in oklch, var(--ink) 92%, transparent)",
      zIndex: 80, display: "flex", flexDirection: "column",
    }}>
      <div style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--paper)" }}>
        <div className="mono" style={{ color: "color-mix(in oklch, var(--paper) 70%, transparent)" }}>
          {String(idx + 1).padStart(2, "0")} / {String(all.length).padStart(2, "0")} · {item.label}
        </div>
        <button onClick={onClose} style={{ color: "var(--paper)", fontSize: 24, lineHeight: 1, padding: 8 }}>×</button>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 80px 60px", position: "relative" }}>
        <button onClick={(e) => { e.stopPropagation(); prev(); }}
          style={{ position: "absolute", left: 24, color: "var(--paper)", fontSize: 28, padding: 16 }}>←</button>
        <div onClick={(e) => e.stopPropagation()} className="placeholder" data-label={item.label}
          style={{ aspectRatio: item.aspect, maxHeight: "80vh", maxWidth: "min(1100px, 90vw)", height: "80vh", borderRadius: 4 }}></div>
        <button onClick={(e) => { e.stopPropagation(); next(); }}
          style={{ position: "absolute", right: 24, color: "var(--paper)", fontSize: 28, padding: 16 }}>→</button>
      </div>
    </div>
  );
}

Object.assign(window, { PortfolioScreen });
