/* Ayofemi Studios — Booking flow (stepper + single-page variants) */

const SERVICES_CATALOG = [
  { id: "portrait", title: "Portrait sitting", duration: "1.5 hours", price: 180, desc: "Studio sitting with up to 30 edited frames", colorTag: "portrait" },
  { id: "couples", title: "Couple's portraits", duration: "2 hours", price: 280, desc: "Two looks, on location or in studio", colorTag: "couples" },
  { id: "editorial", title: "Editorial commission", duration: "Half day", price: 650, desc: "Concept, styling consult, full creative direction", colorTag: "editorial" },
  { id: "commercial", title: "Commercial / lookbook", duration: "Half / full day", price: 900, desc: "Lookbook, product, or campaign photography", colorTag: "commercial" },
  { id: "wedding", title: "Wedding coverage", duration: "Full day", price: 1950, desc: "From the prep room to the last dance", colorTag: "wedding" },
];

const ADDONS = [
  { id: "rush", title: "Rush delivery", desc: "Final selects in 72 hours", price: 90 },
  { id: "makeup", title: "Hair & makeup", desc: "On-set artist for 2 hours", price: 140 },
  { id: "prints", title: "Archival prints", desc: "Three 8×10 museum prints", price: 75 },
];

function nextDays(n) {
  const out = [];
  const today = new Date(2026, 4, 25); // May 25 2026
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TIME_SLOTS = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

function BookingScreen({ style = "stepper" }) {
  if (style === "single") return <BookingSinglePage />;
  return <BookingStepper />;
}

// ── STEPPER VARIANT ──────────────────────────────────────────────────────
function BookingStepper() {
  const { booking, setBooking, go, user, setToast } = useApp();
  const [step, setStep] = React.useState(1);

  const steps = ["Service", "Date & time", "Details", "Review"];

  const canNext = () => {
    if (step === 1) return !!booking.service;
    if (step === 2) return !!booking.date && !!booking.time;
    if (step === 3) return booking.name && booking.email;
    return true;
  };

  const total = (() => {
    const s = SERVICES_CATALOG.find(s => s.id === booking.service);
    const base = s ? s.price : 0;
    const addons = (booking.addons || []).reduce((sum, a) => sum + (ADDONS.find(x => x.id === a)?.price || 0), 0);
    return base + addons;
  })();

  const submit = () => {
    setBooking({ ...booking, total, id: "AYO-" + Math.floor(Math.random() * 9000 + 1000), status: "pending" });
    go("checkout");
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 32px 100px" }}>
      <div style={{ marginBottom: 40 }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>● Book a session · stepper</div>
        <h1 className="display" style={{ fontSize: "clamp(56px, 7vw, 96px)", margin: 0 }}>
          Reserve a <span style={{ fontStyle: "italic", color: "var(--primary)" }}>date</span>.
        </h1>
      </div>

      {/* Step progress */}
      <div style={{ display: "flex", gap: 0, marginBottom: 48, borderBottom: "1px solid var(--line)" }}>
        {steps.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <button key={label} onClick={() => done && setStep(n)}
              style={{
                flex: 1, padding: "16px 8px", textAlign: "left",
                borderBottom: active ? "2px solid var(--ink)" : "2px solid transparent",
                marginBottom: -1, cursor: done ? "pointer" : "default",
                opacity: !active && !done ? 0.45 : 1,
              }}>
              <div className="mono" style={{ color: "var(--muted)", marginBottom: 6 }}>Step {String(n).padStart(2, "0")}</div>
              <div className="display" style={{ fontSize: 22 }}>{label}</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 64 }}>
        <div>
          {step === 1 && <StepService booking={booking} setBooking={setBooking} />}
          {step === 2 && <StepDateTime booking={booking} setBooking={setBooking} />}
          {step === 3 && <StepDetails booking={booking} setBooking={setBooking} user={user} />}
          {step === 4 && <StepReview booking={booking} total={total} />}

          <div style={{ marginTop: 40, display: "flex", gap: 12, justifyContent: "space-between" }}>
            <button onClick={() => setStep(s => Math.max(1, s - 1))} className="btn btn-ghost" disabled={step === 1} style={{ opacity: step === 1 ? 0.3 : 1 }}>← Back</button>
            {step < 4 ? (
              <button onClick={() => canNext() && setStep(s => s + 1)} className="btn btn-primary btn-lg" disabled={!canNext()} style={{ opacity: canNext() ? 1 : 0.4, cursor: canNext() ? "pointer" : "not-allowed" }}>
                Continue →
              </button>
            ) : (
              <button onClick={submit} className="btn btn-primary btn-lg">Confirm & pay →</button>
            )}
          </div>
        </div>

        <BookingSummary booking={booking} total={total} />
      </div>
    </div>
  );
}

// ── SINGLE-PAGE VARIANT ──────────────────────────────────────────────────
function BookingSinglePage() {
  const { booking, setBooking, go, user } = useApp();

  const total = (() => {
    const s = SERVICES_CATALOG.find(s => s.id === booking.service);
    const base = s ? s.price : 0;
    const addons = (booking.addons || []).reduce((sum, a) => sum + (ADDONS.find(x => x.id === a)?.price || 0), 0);
    return base + addons;
  })();

  const canSubmit = booking.service && booking.date && booking.time && booking.name && booking.email;

  const submit = () => {
    if (!canSubmit) return;
    setBooking({ ...booking, total, id: "AYO-" + Math.floor(Math.random() * 9000 + 1000), status: "pending" });
    go("checkout");
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 32px 100px" }}>
      <div style={{ marginBottom: 60 }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>● Book a session</div>
        <h1 className="display" style={{ fontSize: "clamp(56px, 7vw, 96px)", margin: 0 }}>
          One <span style={{ fontStyle: "italic", color: "var(--primary)" }}>page</span>, one sitting.
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          <Block num="01" title="Choose a service">
            <StepService booking={booking} setBooking={setBooking} />
          </Block>
          <Block num="02" title="Pick a date & time">
            <StepDateTime booking={booking} setBooking={setBooking} />
          </Block>
          <Block num="03" title="Your details">
            <StepDetails booking={booking} setBooking={setBooking} user={user} />
          </Block>
          <div>
            <button onClick={submit} className="btn btn-primary btn-lg"
              disabled={!canSubmit}
              style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? "pointer" : "not-allowed" }}>
              Continue to checkout →
            </button>
          </div>
        </div>

        <BookingSummary booking={booking} total={total} sticky />
      </div>
    </div>
  );
}

function Block({ num, title, children }) {
  return (
    <section>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
        <span className="display" style={{ fontSize: 36, color: "var(--muted)" }}>{num}</span>
        <h2 className="display" style={{ fontSize: 36, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ── Step 1: Service ──────────────────────────────────────────────────────
function StepService({ booking, setBooking }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {SERVICES_CATALOG.map(s => {
        const selected = booking.service === s.id;
        return (
          <button key={s.id} onClick={() => setBooking({ ...booking, service: s.id })}
            style={{
              padding: 20, borderRadius: 6,
              border: `1px solid ${selected ? "var(--ink)" : "var(--line)"}`,
              background: selected ? "var(--paper-2)" : "transparent",
              display: "grid", gridTemplateColumns: "24px 1fr 140px 120px", gap: 16, alignItems: "center",
              textAlign: "left", cursor: "pointer", transition: "all 0.2s ease",
            }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              border: `1px solid ${selected ? "var(--ink)" : "var(--line)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--ink)" }}></div>}
            </div>
            <div>
              <div className="display" style={{ fontSize: 24 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.desc}</div>
            </div>
            <div className="mono" style={{ color: "var(--muted)" }}>{s.duration}</div>
            <div className="display" style={{ fontSize: 24, textAlign: "right" }}>{formatNaira(s.price)}</div>
          </button>
        );
      })}

      <div style={{ marginTop: 20 }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>Add-ons (optional)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {ADDONS.map(a => {
            const sel = (booking.addons || []).includes(a.id);
            return (
              <button key={a.id} onClick={() => {
                const cur = booking.addons || [];
                setBooking({ ...booking, addons: sel ? cur.filter(x => x !== a.id) : [...cur, a.id] });
              }}
                style={{
                  padding: 14, borderRadius: 6,
                  border: `1px solid ${sel ? "var(--ink)" : "var(--line)"}`,
                  background: sel ? "var(--paper-2)" : "transparent",
                  textAlign: "left", display: "flex", flexDirection: "column", gap: 4,
                }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{a.title}</span>
                  <span style={{ fontSize: 13 }}>+{formatNaira(a.price)}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{a.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Date & Time ──────────────────────────────────────────────────
function StepDateTime({ booking, setBooking }) {
  const [month, setMonth] = React.useState(5); // June (0-indexed)
  const year = 2026;

  // Build month grid
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const today = new Date(2026, 4, 25);
  const isPast = (day) => day && new Date(year, month, day) < today;
  // Stub: every 7th day is unavailable
  const isUnavail = (day) => day && (day % 7 === 0);

  const selectDate = (day) => {
    if (isPast(day) || isUnavail(day)) return;
    setBooking({ ...booking, date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`, dateLabel: `${MONTH_NAMES[month]} ${day}, ${year}` });
  };

  const selectedDay = booking.date ? parseInt(booking.date.split("-")[2]) : null;
  const selectedMonth = booking.date ? parseInt(booking.date.split("-")[1]) - 1 : null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32 }}>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={() => setMonth(m => m - 1)} disabled={month <= 4}
            style={{ fontSize: 18, opacity: month <= 4 ? 0.3 : 1, padding: "6px 12px" }}>←</button>
          <div className="display" style={{ fontSize: 28 }}>{MONTH_NAMES[month]} {year}</div>
          <button onClick={() => setMonth(m => m + 1)} disabled={month >= 11}
            style={{ fontSize: 18, opacity: month >= 11 ? 0.3 : 1, padding: "6px 12px" }}>→</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {DAY_NAMES.map(d => (
            <div key={d} className="mono" style={{ textAlign: "center", color: "var(--muted)", padding: "6px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i}></div>;
            const past = isPast(day);
            const unavail = isUnavail(day);
            const selected = selectedDay === day && selectedMonth === month;
            return (
              <button key={i} onClick={() => selectDate(day)} disabled={past || unavail}
                style={{
                  aspectRatio: "1/1", borderRadius: 6,
                  background: selected ? "var(--ink)" : "transparent",
                  color: selected ? "var(--paper)" : (past || unavail) ? "var(--muted)" : "var(--ink)",
                  opacity: past ? 0.25 : unavail ? 0.4 : 1,
                  fontSize: 14, fontWeight: 500,
                  cursor: (past || unavail) ? "not-allowed" : "pointer",
                  position: "relative",
                  transition: "background 0.18s",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => !selected && !past && !unavail && (e.currentTarget.style.background = "var(--paper-2)")}
                onMouseLeave={(e) => !selected && (e.currentTarget.style.background = "transparent")}
              >
                {day}
                {unavail && !past && <span style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--muted)" }}></span>}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, background: "var(--ink)", borderRadius: 2 }}></span> Selected</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 4, height: 4, background: "var(--muted)", borderRadius: "50%" }}></span> Booked</span>
        </div>
      </div>

      <div>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>Available times</div>
        {!booking.date ? (
          <div style={{ padding: "20px 0", fontSize: 13, color: "var(--muted)" }}>Select a date first</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TIME_SLOTS.map(t => {
              const sel = booking.time === t;
              const unavail = t === "13:00";
              return (
                <button key={t} onClick={() => !unavail && setBooking({ ...booking, time: t })} disabled={unavail}
                  style={{
                    padding: "14px 16px", borderRadius: 6,
                    border: `1px solid ${sel ? "var(--ink)" : "var(--line)"}`,
                    background: sel ? "var(--ink)" : "transparent",
                    color: sel ? "var(--paper)" : unavail ? "var(--muted)" : "var(--ink)",
                    textAlign: "left", display: "flex", justifyContent: "space-between",
                    opacity: unavail ? 0.4 : 1, cursor: unavail ? "not-allowed" : "pointer",
                    transition: "all 0.18s",
                  }}>
                  <span style={{ fontWeight: 500 }}>{t}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {unavail ? "Booked" : sel ? "Selected" : "Available"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Step 3: Details ──────────────────────────────────────────────────────
function StepDetails({ booking, setBooking, user }) {
  React.useEffect(() => {
    if (user && !booking.name) {
      setBooking({ ...booking, name: user.name, email: user.email });
    }
  }, [user]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <Field label="Full name" value={booking.name || ""} onChange={v => setBooking({ ...booking, name: v })} placeholder="Ayọkunle Adeyemi" />
      <Field label="Email" type="email" value={booking.email || ""} onChange={v => setBooking({ ...booking, email: v })} placeholder="you@example.com" />
      <Field label="Phone" value={booking.phone || ""} onChange={v => setBooking({ ...booking, phone: v })} placeholder="+44 7XXX XXX XXX" />
      <Field label="How did you hear about us?" value={booking.referral || ""} onChange={v => setBooking({ ...booking, referral: v })} placeholder="Instagram, a friend, our journal..." />
      <div style={{ gridColumn: "1 / -1" }}>
        <Field label="Notes for the studio" textarea value={booking.notes || ""} onChange={v => setBooking({ ...booking, notes: v })}
          placeholder="Tell us about the sitting — who's in front of the camera, the feeling you're after, anything else." />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", textarea }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {textarea ? (
        <textarea className="input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} />
      ) : (
        <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </label>
  );
}

// ── Step 4: Review ───────────────────────────────────────────────────────
function StepReview({ booking, total }) {
  const s = SERVICES_CATALOG.find(s => s.id === booking.service);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <ReviewRow label="Service" value={s ? `${s.title} · ${s.duration}` : "—"} />
      <ReviewRow label="Date & time" value={booking.date ? `${booking.dateLabel} · ${booking.time}` : "—"} />
      <ReviewRow label="Contact" value={`${booking.name} · ${booking.email}${booking.phone ? " · " + booking.phone : ""}`} />
      {booking.notes && <ReviewRow label="Notes" value={booking.notes} />}
      {booking.addons?.length > 0 && (
        <ReviewRow label="Add-ons" value={booking.addons.map(a => ADDONS.find(x => x.id === a).title).join(" · ")} />
      )}
      <div style={{ marginTop: 8, paddingTop: 24, borderTop: "1px solid var(--ink)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="mono" style={{ color: "var(--muted)" }}>Total due today</span>
        <span className="display" style={{ fontSize: 56 }}>{formatNaira(total)}</span>
      </div>
    </div>
  );
}
function ReviewRow({ label, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
      <span className="mono" style={{ color: "var(--muted)" }}>{label}</span>
      <span style={{ fontSize: 16 }}>{value}</span>
    </div>
  );
}

// ── Booking summary (sticky sidebar) ─────────────────────────────────────
function BookingSummary({ booking, total, sticky }) {
  const s = SERVICES_CATALOG.find(s => s.id === booking.service);
  return (
    <aside style={{ position: sticky ? "sticky" : "relative", top: sticky ? 100 : 0, alignSelf: "start" }}>
      <div className="card" style={{ padding: 28 }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 16 }}>● Your sitting</div>

        <div className="placeholder" data-label="reference moodboard"
          style={{ aspectRatio: "4/3", borderRadius: 4, marginBottom: 20 }}></div>

        <SummaryRow label="Service" value={s?.title || <em style={{ color: "var(--muted)", fontStyle: "italic" }}>Not selected</em>} />
        <SummaryRow label="Duration" value={s?.duration || "—"} />
        <SummaryRow label="Date" value={booking.dateLabel || <em style={{ color: "var(--muted)", fontStyle: "italic" }}>—</em>} />
        <SummaryRow label="Time" value={booking.time || <em style={{ color: "var(--muted)", fontStyle: "italic" }}>—</em>} />
        {booking.addons?.length > 0 && (
          <SummaryRow label="Add-ons" value={`${booking.addons.length} selected`} />
        )}

        <hr className="divider" style={{ margin: "20px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="mono" style={{ color: "var(--muted)" }}>Total</span>
          <span className="display" style={{ fontSize: 36 }}>{total ? formatNaira(total) : "£0"}</span>
        </div>

        <div style={{ marginTop: 24, padding: 14, background: "var(--paper-2)", borderRadius: 4, fontSize: 12, color: "var(--muted)", lineHeight: 1.55 }}>
          A 30% deposit secures your date. Final payment due 48hr before the sitting.
        </div>
      </div>
    </aside>
  );
}
function SummaryRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
      <span className="mono" style={{ color: "var(--muted)" }}>{label}</span>
      <span style={{ textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

Object.assign(window, { BookingScreen, SERVICES_CATALOG, ADDONS });
