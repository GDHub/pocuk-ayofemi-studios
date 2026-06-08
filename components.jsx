/* Ayofemi Studios — Shared components */
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// ─── App context (router + auth + bookings) ───────────────────────────────
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ─── Logo ─────────────────────────────────────────────────────────────────
function Logo({ size = 22 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: size, fontFamily: "var(--font-display)", lineHeight: 1, letterSpacing: "-0.02em" }}>
      <span style={{ fontStyle: "italic" }}>Ayọ</span>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)" }}></span>
      <span>femi</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: size * 0.36, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginLeft: 4, marginTop: 4 }}>Studios</span>
    </div>
  );
}

// ─── Top Nav ──────────────────────────────────────────────────────────────
function NavBar() {
  const { route, go, user, signOut } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "home", label: "Home" },
    { id: "portfolio", label: "Portfolio" },
    { id: "booking", label: "Book" },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      background: "color-mix(in oklch, var(--paper) 88%, transparent)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <button onClick={() => go("home")} aria-label="Home" style={{ display: "flex", alignItems: "center" }}>
          <Logo size={22} />
        </button>

        <nav className="nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: route === l.id ? "var(--ink)" : "var(--muted)",
                position: "relative",
                paddingBottom: 4,
                borderBottom: route === l.id ? "1px solid var(--ink)" : "1px solid transparent",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"}
              onMouseLeave={(e) => e.currentTarget.style.color = route === l.id ? "var(--ink)" : "var(--muted)"}
            >{l.label}</button>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user ? (
            <>
              <button onClick={() => go("dashboard")} className="btn btn-ghost btn-sm">
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--primary)", color: "var(--primary-ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>{user.name[0].toUpperCase()}</span>
                {user.name.split(" ")[0]}
              </button>
              {user.isAdmin && <button onClick={() => go("admin")} className="btn btn-ghost btn-sm">Admin</button>}
            </>
          ) : (
            <>
              <button onClick={() => go("auth")} className="btn btn-ghost btn-sm">Sign in</button>
              <button onClick={() => go("booking")} className="btn btn-primary btn-sm">Book a session →</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 80 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 32px 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <Logo size={28} />
          <p style={{ marginTop: 18, maxWidth: 320, color: "var(--muted)", fontSize: 14 }}>
            A London photography studio crafting portraits, editorial, and brand imagery for West African and Western families alike — a steady hand and a soft eye.
          </p>
        </div>
        <FooterCol title="Studio" links={["About", "Journal", "Press", "Careers"]} />
        <FooterCol title="Services" links={["Portraits", "Editorial", "Weddings", "Commercial"]} />
        <FooterCol title="Contact" links={["hello@ayofemi.studio", "+44 20 7946 0102", "Unit 4, Rye Lane, Peckham, London SE15"]} />
      </div>
      <div style={{ borderTop: "1px solid var(--line)", padding: "18px 32px", maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
        <span>© 2026 Ayofemi Studios</span>
        <span>London · Lagos · Accra</span>
      </div>
    </footer>
  );
}
function FooterCol({ title, links }) {
  return (
    <div>
      <div className="mono" style={{ color: "var(--muted)", marginBottom: 14 }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map(l => <li key={l} style={{ fontSize: 14 }}>{l}</li>)}
      </ul>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────
function SectionHead({ kicker, title, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, gap: 24, flexWrap: "wrap" }}>
      <div>
        {kicker && <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>● {kicker}</div>}
        <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 64px)", margin: 0 }}>{title}</h2>
      </div>
      {right}
    </div>
  );
}

// ─── Tag / Pill ───────────────────────────────────────────────────────────
function Tag({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px",
      borderRadius: 999,
      border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
      background: active ? "var(--ink)" : "transparent",
      color: active ? "var(--paper)" : "var(--ink)",
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.18s ease",
    }}>{children}</button>
  );
}

// ─── Currency formatter ───────────────────────────────────────────────────
// Studio prices are GBP; helper name kept for compatibility across screens.
const formatNaira = (n) => "£" + n.toLocaleString("en-GB");

// ─── Toast ────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fade-in" style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: "var(--ink)", color: "var(--paper)", padding: "12px 20px",
      borderRadius: 999, fontSize: 13, fontWeight: 500, zIndex: 100,
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }}></span>
      {toast}
    </div>
  );
}

Object.assign(window, {
  AppContext, useApp,
  Logo, NavBar, Footer, FooterCol,
  SectionHead, Tag, Toast, formatNaira,
});
