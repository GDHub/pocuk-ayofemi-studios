/* Ayofemi Studios — Admin panel */

function AdminScreen() {
  const { user, services, setServices, bookings, availability, setAvailability, go, setToast } = useApp();
  const [tab, setTab] = React.useState("overview");
  const [editing, setEditing] = React.useState(null);

  if (!user || !user.isAdmin) {
    React.useEffect(() => go("auth"), []);
    return null;
  }

  return (
    <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 60px)" }}>
      {/* Sidebar */}
      <aside style={{ borderRight: "1px solid var(--line)", padding: "32px 20px", background: "var(--paper-2)" }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 20, padding: "0 12px" }}>● Studio admin</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { id: "overview", label: "Overview" },
            { id: "bookings", label: "Bookings" },
            { id: "services", label: "Services" },
            { id: "availability", label: "Availability" },
            { id: "clients", label: "Clients" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: "10px 12px", borderRadius: 4, textAlign: "left",
                background: tab === t.id ? "var(--ink)" : "transparent",
                color: tab === t.id ? "var(--paper)" : "var(--ink)",
                fontSize: 14, fontWeight: 500,
                transition: "background 0.15s",
              }}>{t.label}</button>
          ))}
        </nav>
        <hr className="divider" style={{ margin: "24px 0" }} />
        <div style={{ padding: "0 12px" }}>
          <div className="mono" style={{ color: "var(--muted)", marginBottom: 10 }}>Signed in</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</div>
          <div className="mono" style={{ color: "var(--muted)", marginTop: 4 }}>{user.email}</div>
        </div>
      </aside>

      {/* Content */}
      <main style={{ padding: "48px 56px", maxWidth: 1200 }}>
        {tab === "overview" && <AdminOverview bookings={bookings} services={services} setTab={setTab} />}
        {tab === "bookings" && <AdminBookings bookings={bookings} />}
        {tab === "services" && <AdminServices services={services} setServices={setServices} editing={editing} setEditing={setEditing} setToast={setToast} />}
        {tab === "availability" && <AdminAvailability availability={availability} setAvailability={setAvailability} setToast={setToast} />}
        {tab === "clients" && <AdminClients bookings={bookings} />}
      </main>
    </div>
  );
}

function AdminOverview({ bookings, services, setTab }) {
  return (
    <div>
      <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>● Today is May 25, 2026</div>
      <h1 className="display" style={{ fontSize: 64, margin: "0 0 40px" }}>Studio overview</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
        <StatCard label="This month" value={bookings.length} sub="bookings" />
        <StatCard label="Revenue" value={formatNaira(bookings.reduce((s, b) => s + (b.total || 0), 0))} sub="confirmed" />
        <StatCard label="Services" value={services.length} sub="active" />
        <StatCard label="Open slots" value="14" sub="next 30 days" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="display" style={{ fontSize: 28, margin: 0 }}>Latest bookings</h2>
            <button onClick={() => setTab("bookings")} className="btn btn-ghost btn-sm">View all →</button>
          </div>
          <div className="card">
            {bookings.slice(0, 4).map((b, i) => (
              <div key={b.id} style={{ padding: 20, borderBottom: i < 3 ? "1px solid var(--line)" : "none", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px", gap: 16, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{b.name}</div>
                  <div className="mono" style={{ color: "var(--muted)", marginTop: 4 }}>{b.id}</div>
                </div>
                <div style={{ fontSize: 14 }}>{services.find(s => s.id === b.service)?.title}</div>
                <div style={{ fontSize: 14 }}>{b.dateLabel} · {b.time}</div>
                <StatusPill status={b.status} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="display" style={{ fontSize: 28, margin: "0 0 16px" }}>Quick actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => setTab("services")} className="btn btn-ghost" style={{ justifyContent: "space-between" }}>Add new service <span>+</span></button>
            <button onClick={() => setTab("availability")} className="btn btn-ghost" style={{ justifyContent: "space-between" }}>Block a date <span>✕</span></button>
            <button className="btn btn-ghost" style={{ justifyContent: "space-between" }}>Export bookings <span>↓</span></button>
            <button className="btn btn-ghost" style={{ justifyContent: "space-between" }}>Resend confirmations <span>✦</span></button>
          </div>
        </section>
      </div>
    </div>
  );
}

function AdminBookings({ bookings }) {
  const [filter, setFilter] = React.useState("all");
  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  return (
    <div>
      <h1 className="display" style={{ fontSize: 48, margin: "0 0 24px" }}>Bookings</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["all", "pending", "confirmed", "completed"].map(f => (
          <Tag key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Tag>
        ))}
      </div>
      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1fr 1fr 120px 100px", padding: "14px 20px", borderBottom: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
          <span>ID</span><span>Client</span><span>Service</span><span>Date</span><span>Time</span><span>Total</span><span>Status</span>
        </div>
        {filtered.map(b => (
          <div key={b.id} style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1fr 1fr 120px 100px", padding: "18px 20px", borderBottom: "1px solid var(--line)", alignItems: "center", fontSize: 13 }}>
            <span className="mono">{b.id}</span>
            <span>{b.name}</span>
            <span>{SERVICES_CATALOG.find(s => s.id === b.service)?.title}</span>
            <span>{b.dateLabel}</span>
            <span>{b.time}</span>
            <span>{formatNaira(b.total || 0)}</span>
            <StatusPill status={b.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminServices({ services, setServices, editing, setEditing, setToast }) {
  const save = (s) => {
    if (s.id && services.find(x => x.id === s.id)) {
      setServices(services.map(x => x.id === s.id ? s : x));
      setToast("Service updated");
    } else {
      const id = s.title.toLowerCase().replace(/\s+/g, "-").slice(0, 24) + "-" + Math.floor(Math.random() * 99);
      setServices([...services, { ...s, id }]);
      setToast("Service added");
    }
    setEditing(null);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="display" style={{ fontSize: 48, margin: 0 }}>Services</h1>
        <button onClick={() => setEditing({ title: "", desc: "", duration: "", price: 0 })} className="btn btn-primary">+ New service</button>
      </div>
      <div className="card">
        {services.map((s, i) => (
          <div key={s.id} style={{ padding: 20, borderBottom: i < services.length - 1 ? "1px solid var(--line)" : "none", display: "grid", gridTemplateColumns: "60px 1fr 2fr 140px 120px 120px", gap: 16, alignItems: "center" }}>
            <span className="display" style={{ fontSize: 24, color: "var(--muted)" }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontWeight: 500 }}>{s.title}</span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{s.desc}</span>
            <span className="mono" style={{ color: "var(--muted)" }}>{s.duration}</span>
            <span className="display" style={{ fontSize: 20 }}>{formatNaira(s.price)}</span>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setEditing(s)} className="btn btn-ghost btn-sm">Edit</button>
              <button onClick={() => { setServices(services.filter(x => x.id !== s.id)); setToast("Service removed"); }}
                style={{ color: "var(--muted)", padding: "9px 6px", fontSize: 14 }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {editing && <ServiceEditor service={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ServiceEditor({ service, onSave, onClose }) {
  const [s, setS] = React.useState(service);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 540, padding: 32, background: "var(--paper)" }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 8 }}>● {service.id ? "Edit" : "New"} service</div>
        <h2 className="display" style={{ fontSize: 32, margin: "0 0 24px" }}>{service.id ? service.title : "New service"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Field label="Title" value={s.title} onChange={v => setS({ ...s, title: v })} placeholder="Portrait sitting" />
          <Field label="Description" textarea value={s.desc} onChange={v => setS({ ...s, desc: v })} placeholder="Brief description" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Duration" value={s.duration} onChange={v => setS({ ...s, duration: v })} placeholder="1.5 hours" />
            <label className="field">
              <span className="field-label">Price (₦)</span>
              <input className="input" type="number" value={s.price} onChange={e => setS({ ...s, price: parseInt(e.target.value || 0) })} />
            </label>
          </div>
        </div>
        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={() => onSave(s)} className="btn btn-primary">Save service</button>
        </div>
      </div>
    </div>
  );
}

function AdminAvailability({ availability, setAvailability, setToast }) {
  const [month, setMonth] = React.useState(5);
  const year = 2026;
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const toggle = (day) => {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setAvailability({ ...availability, [key]: !availability[key] });
    setToast(availability[key] ? "Date opened" : "Date blocked");
  };

  return (
    <div>
      <h1 className="display" style={{ fontSize: 48, margin: "0 0 8px" }}>Availability</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 32px" }}>Click a date to block or open it for bookings.</p>

      <div className="card" style={{ padding: 32, maxWidth: 720 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button onClick={() => setMonth(m => Math.max(4, m - 1))} className="btn btn-ghost btn-sm">←</button>
          <div className="display" style={{ fontSize: 32 }}>{MONTH_NAMES[month]} {year}</div>
          <button onClick={() => setMonth(m => Math.min(11, m + 1))} className="btn btn-ghost btn-sm">→</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 8 }}>
          {DAY_NAMES.map(d => <div key={d} className="mono" style={{ textAlign: "center", color: "var(--muted)", padding: "6px 0" }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i}></div>;
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const blocked = availability[key];
            return (
              <button key={i} onClick={() => toggle(day)}
                style={{
                  aspectRatio: "1/1", borderRadius: 4,
                  border: `1px solid ${blocked ? "var(--ink)" : "var(--line)"}`,
                  background: blocked ? "var(--ink)" : "transparent",
                  color: blocked ? "var(--paper)" : "var(--ink)",
                  fontSize: 14, fontWeight: 500,
                  position: "relative",
                  transition: "all 0.15s",
                }}>
                {day}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 10, height: 10, background: "var(--ink)", borderRadius: 2 }}></span> Blocked</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 10, height: 10, background: "transparent", border: "1px solid var(--line)", borderRadius: 2 }}></span> Open</span>
        </div>
      </div>
    </div>
  );
}

function AdminClients({ bookings }) {
  const clients = [...new Set(bookings.map(b => b.email))].map(email => {
    const b = bookings.filter(x => x.email === email);
    return { email, name: b[0].name, count: b.length, total: b.reduce((s, x) => s + (x.total || 0), 0) };
  });
  return (
    <div>
      <h1 className="display" style={{ fontSize: 48, margin: "0 0 24px" }}>Clients</h1>
      <div className="card">
        {clients.map((c, i) => (
          <div key={c.email} style={{ padding: 20, borderBottom: i < clients.length - 1 ? "1px solid var(--line)" : "none", display: "grid", gridTemplateColumns: "60px 1fr 1fr 120px 120px", gap: 16, alignItems: "center" }}>
            <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 20 }}>{c.name[0]}</span>
            <div>
              <div style={{ fontWeight: 500 }}>{c.name}</div>
              <div className="mono" style={{ color: "var(--muted)", marginTop: 4 }}>{c.email}</div>
            </div>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{c.count} {c.count === 1 ? "booking" : "bookings"}</span>
            <span style={{ fontWeight: 500 }}>{formatNaira(c.total)}</span>
            <button className="btn btn-ghost btn-sm">View →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { AdminScreen });
