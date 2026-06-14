/* Ayofemi Studios — Home screen with hero variants */
const { useState: useStateH } = React;

function HomeScreen({ heroVariant = "editorial" }) {
  const { go } = useApp();
  return (
    <div className="fade-in">
      {heroVariant === "editorial" && <HeroEditorial onCta={() => go("booking")} />}
      {heroVariant === "split" && <HeroSplit onCta={() => go("booking")} />}
      {heroVariant === "marquee" && <HeroMarquee onCta={() => go("booking")} />}

      <ServicesStrip />
      <FeaturedWork />
      <Testimonial />
      <BookCallout />
    </div>
  );
}

// ── Variant 1: Editorial (oversized type, single image right)
function HeroEditorial({ onCta }) {
  const { go } = useApp();
  return (
    <section style={{ maxWidth: 1400, margin: "0 auto", padding: "80px 32px 120px" }}>
      <div className="mono" style={{ color: "var(--muted)", marginBottom: 40 }}>● London · est. 2019 · West African & Western portraiture</div>
      <div className="mono" style={{ color: "var(--muted)", marginBottom: 40 }}>● London · est. 2019 · West African & Western portraiture</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "end" }}>
        <h1 className="display" style={{ fontSize: "clamp(72px, 11vw, 168px)", margin: 0, letterSpacing: "-0.03em" }}>
          Light, <span style={{ fontStyle: "italic", color: "var(--primary)" }}>held</span><br />
          like a quiet<br />promise.
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div className="placeholder" data-label="hero portrait · 4:5" style={{ aspectRatio: "4/5", borderRadius: 6 }}></div>
          <p style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 380, margin: 0 }}>
            We make pictures that hold up — portraits, editorial commissions, and brand stories for West African and Western families alike, shot on film and digital from our atelier in Peckham, south London.
            We make pictures that hold up — portraits, editorial commissions, and brand stories for West African and Western families alike, shot on film and digital from our atelier in Peckham, south London.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onCta} className="btn btn-primary btn-lg">Book a session</button>
            <button onClick={go.bind(null, "portfolio")} className="btn btn-ghost btn-lg">See the work</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Variant 2: Split (full-bleed image left, copy right)
function HeroSplit({ onCta }) {
  const { go } = useApp();
  return (
    <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 60px)", borderBottom: "1px solid var(--line)" }}>
      <div className="placeholder" data-label="hero · full bleed" style={{ minHeight: 600 }}></div>
      <div style={{ padding: "80px 64px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
        <div className="mono" style={{ color: "var(--muted)" }}>● Ayofemi Studios · London</div>
        <div className="mono" style={{ color: "var(--muted)" }}>● Ayofemi Studios · London</div>
        <h1 className="display" style={{ fontSize: "clamp(56px, 7vw, 104px)", margin: 0 }}>
          A studio for the<br /><span style={{ fontStyle: "italic", color: "var(--primary)" }}>still </span>and the<br />unsayable.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 460 }}>
          Portraits, editorial, weddings, and brand work for West African and Western communities — shot with intention by Ayofemi Adeyemi and a small, considered team.
          Portraits, editorial, weddings, and brand work for West African and Western communities — shot with intention by Ayofemi Adeyemi and a small, considered team.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCta} className="btn btn-primary btn-lg">Book a session →</button>
          <button onClick={() => go("portfolio")} className="btn btn-ghost btn-lg">View portfolio</button>
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 16, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          <Stat label="Years" value="07" />
          <Stat label="Sessions" value="412" />
          <Stat label="Editorials" value="38" />
        </div>
      </div>
    </section>
  );
}
function Stat({ label, value }) {
  return (
    <div>
      <div className="display" style={{ fontSize: 44 }}>{value}</div>
      <div className="mono" style={{ color: "var(--muted)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── Variant 3: Marquee (large centered headline + scrolling images)
function HeroMarquee({ onCta }) {
  const { go } = useApp();
  return (
    <section style={{ padding: "80px 0 60px", textAlign: "center" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 32 }}>● Photography · London · West Africa · Worldwide</div>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 32 }}>● Photography · London · West Africa · Worldwide</div>
        <h1 className="display" style={{ fontSize: "clamp(80px, 13vw, 200px)", margin: 0, letterSpacing: "-0.04em", lineHeight: 0.88 }}>
          We photograph <span style={{ fontStyle: "italic", color: "var(--primary)" }}>quietly,</span><br />
          on purpose.
        </h1>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 40 }}>
          <button onClick={onCta} className="btn btn-primary btn-lg">Book a session</button>
          <button onClick={() => go("portfolio")} className="btn btn-ghost btn-lg">See the work</button>
        </div>
      </div>
      <div style={{ marginTop: 64, overflow: "hidden", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "32px 0" }}>
        <div style={{ display: "flex", gap: 24, animation: "marquee 40s linear infinite", width: "max-content" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="placeholder" data-label={`frame ${String(i+1).padStart(2, "0")}`}
              style={{ width: 320, height: 380, flexShrink: 0, borderRadius: 4 }}></div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

// ── Services strip ───────────────────────────────────────────────────────
function ServicesStrip() {
  const { goWithService } = useApp();
  const services = [
    { id: "wedding-half", num: "01", title: "Weddings", desc: "Half day, full day, and luxury packages — prep room to last dance.", from: 800 },
    { id: "portrait", num: "02", title: "Portraits", desc: "Studio sittings, graduations, and headshots on film or digital.", from: 150 },
    { id: "family", num: "03", title: "Family & maternity", desc: "Relaxed family, maternity, and milestone sessions for all ages.", from: 180 },
    { id: "event", num: "04", title: "Events", desc: "Birthdays, socials, and gatherings captured as they unfold.", from: 350 },
    { id: "corporate-event", num: "05", title: "Corporate", desc: "Conferences, headshots, and brand events for considered teams.", from: 500 },
    { id: "product", num: "06", title: "Product", desc: "E-commerce, catalogue, and campaign photography, per image.", from: 15 },
  ];
  return (
    <section style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 32px" }}>
      <SectionHead kicker="Services" title="What we make" />
      <div style={{ borderTop: "1px solid var(--line)" }}>
        {services.map(s => (
          <button key={s.id} onClick={() => goWithService(s.id)}
            style={{
              width: "100%", display: "grid", gridTemplateColumns: "60px 1fr 2fr 200px 80px",
              gap: 24, alignItems: "center", padding: "28px 0", borderBottom: "1px solid var(--line)",
              cursor: "pointer", textAlign: "left", transition: "padding 0.25s ease, background 0.25s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "16px"; e.currentTarget.style.background = "var(--paper-2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; e.currentTarget.style.background = "transparent"; }}
          >
            <span className="display" style={{ fontSize: 28, color: "var(--muted)" }}>{s.num}</span>
            <span className="display" style={{ fontSize: 36 }}>{s.title}</span>
            <span style={{ color: "var(--muted)", fontSize: 14, maxWidth: 380 }}>{s.desc}</span>
            <span className="mono" style={{ color: "var(--muted)" }}>From {formatNaira(s.from)}</span>
            <span style={{ fontSize: 20 }}>→</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Featured work ────────────────────────────────────────────────────────
function FeaturedWork() {
  const { go } = useApp();
  return (
    <section style={{ maxWidth: 1400, margin: "0 auto", padding: "80px 32px" }}>
      <SectionHead
        kicker="Selected work"
        title="Recent frames"
        right={<button onClick={() => go("portfolio")} className="btn btn-ghost">All work →</button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "320px 320px", gap: 16 }}>
        <div className="placeholder" data-label="folake · portrait · 2025" style={{ gridRow: "1 / 3" }}></div>
        <div className="placeholder" data-label="london fashion week"></div>
        <div className="placeholder" data-label="london fashion week"></div>
        <div className="placeholder" data-label="brand · onile"></div>
        <div className="placeholder" data-label="tunde & ada · wedding"></div>
        <div className="placeholder" data-label="series · iron & velvet"></div>
      </div>
    </section>
  );
}

// ── Testimonial ──────────────────────────────────────────────────────────
function Testimonial() {
  return (
    <section style={{ background: "var(--ink)", color: "var(--paper)", padding: "120px 32px", marginTop: 40 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div className="mono" style={{ color: "color-mix(in oklch, var(--paper) 60%, transparent)", marginBottom: 32 }}>● A word from the studio</div>
        <p className="display" style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15, margin: 0, fontStyle: "italic" }}>
          "Ayofemi sees something in a room before anyone else does. The pictures she gave us still surprise me three years on."
        </p>
        <div style={{ marginTop: 40, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in oklch, var(--paper) 70%, transparent)" }}>
          Folake Okonkwo · creative director, Onile
        </div>
      </div>
    </section>
  );
}

// ── Book callout ─────────────────────────────────────────────────────────
function BookCallout() {
  const { go } = useApp();
  return (
    <section style={{ maxWidth: 1400, margin: "0 auto", padding: "120px 32px 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <h2 className="display" style={{ fontSize: "clamp(56px, 7vw, 104px)", margin: 0 }}>
          Sittings open<br />for <span style={{ fontStyle: "italic", color: "var(--primary)" }}>July</span>.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0 }}>
            We take a small number of bookings each month so that every sitting gets the time it deserves. Reserve a date below and we'll be in touch within a day.
          </p>
          <div>
            <button onClick={() => go("booking")} className="btn btn-primary btn-lg">Book your session →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomeScreen });
