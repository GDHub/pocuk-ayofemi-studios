/* Ayofemi Studios — Client dashboard */

function DashboardScreen() {
  const { user, bookings, go, signOut } = useApp();
  if (!user) {
    React.useEffect(() => go("auth"), []);
    return null;
  }

  const myBookings = bookings.filter(b => b.email === user.email);
  const upcoming = myBookings.filter(b => b.status !== "completed");
  const past = myBookings.filter(b => b.status === "completed");

  return (
    <div className="fade-in" style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 32px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>● Your studio</div>
          <h1 className="display" style={{ fontSize: "clamp(56px, 7vw, 96px)", margin: 0 }}>
            Hello, <span style={{ fontStyle: "italic", color: "var(--primary)" }}>{user.name.split(" ")[0]}</span>.
          </h1>
        </div>
        <button onClick={signOut} className="btn btn-ghost">Sign out</button>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 64 }}>
        <StatCard label="Upcoming" value={upcoming.length} sub="sittings" />
        <StatCard label="Galleries" value={past.length} sub="ready to view" />
        <StatCard label="Prints" value="3" sub="in archive" />
        <StatCard label="Credit" value="₦0" sub="on account" />
      </div>

      {/* Upcoming bookings */}
      <section style={{ marginBottom: 64 }}>
        <h2 className="display" style={{ fontSize: 40, margin: "0 0 24px" }}>Upcoming sittings</h2>
        {upcoming.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: "center" }}>
            <p style={{ color: "var(--muted)", margin: "0 0 16px" }}>You don't have any sittings booked.</p>
            <button onClick={() => go("booking")} className="btn btn-primary">Book a session →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {upcoming.map(b => <BookingCard key={b.id} b={b} />)}
          </div>
        )}
      </section>

      {/* Galleries */}
      <section style={{ marginBottom: 64 }}>
        <h2 className="display" style={{ fontSize: 40, margin: "0 0 24px" }}>Your galleries</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <GalleryCard label="folake · home portraits" date="March 2025" count={42} />
          <GalleryCard label="onile · campaign ss25" date="January 2025" count={86} />
          <GalleryCard label="studio portraits · 2024" date="November 2024" count={28} />
        </div>
      </section>

      {/* Activity */}
      <section>
        <h2 className="display" style={{ fontSize: 40, margin: "0 0 24px" }}>Recent activity</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: "1px solid var(--line)" }}>
          <Activity icon="✦" text="Gallery for the March sitting is ready" time="2 days ago" />
          <Activity icon="✦" text="Your archival prints have shipped" time="1 week ago" />
          <Activity icon="✦" text="Payment received · ₦75,000" time="3 weeks ago" />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>{label}</div>
      <div className="display" style={{ fontSize: 56, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function BookingCard({ b }) {
  const s = SERVICES_CATALOG.find(s => s.id === b.service);
  return (
    <div className="card" style={{ padding: 24, display: "grid", gridTemplateColumns: "120px 1fr 200px 140px", gap: 24, alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div className="display" style={{ fontSize: 48, lineHeight: 1 }}>{b.date?.split("-")[2] || "—"}</div>
        <div className="mono" style={{ color: "var(--muted)", marginTop: 4 }}>{b.dateLabel?.split(",")[0] || ""}</div>
      </div>
      <div>
        <div className="display" style={{ fontSize: 24 }}>{s?.title}</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{b.time} · {s?.duration} · {b.id}</div>
      </div>
      <div>
        <StatusPill status={b.status} />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost btn-sm">Manage</button>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const palette = {
    pending: { bg: "var(--paper-2)", text: "var(--muted)", label: "Pending" },
    confirmed: { bg: "color-mix(in oklch, var(--accent) 30%, var(--paper))", text: "var(--ink)", label: "Confirmed" },
    completed: { bg: "var(--ink)", text: "var(--paper)", label: "Completed" },
  }[status] || { bg: "var(--paper-2)", text: "var(--muted)", label: status };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 12px", borderRadius: 999,
      background: palette.bg, color: palette.text,
      fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.text, opacity: 0.7 }}></span>
      {palette.label}
    </span>
  );
}

function GalleryCard({ label, date, count }) {
  return (
    <button style={{ textAlign: "left", padding: 0, background: "none", cursor: "pointer", width: "100%" }}>
      <div className="placeholder" data-label={label} style={{ aspectRatio: "4/5", borderRadius: 4 }}></div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{label}</div>
          <div className="mono" style={{ color: "var(--muted)", marginTop: 4 }}>{date}</div>
        </div>
        <div className="mono" style={{ color: "var(--muted)" }}>{count} frames</div>
      </div>
    </button>
  );
}

function Activity({ icon, text, time }) {
  return (
    <div style={{ padding: "20px 0", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ color: "var(--primary)", fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 15 }}>{text}</span>
      </div>
      <span className="mono" style={{ color: "var(--muted)" }}>{time}</span>
    </div>
  );
}

Object.assign(window, { DashboardScreen, StatusPill });
