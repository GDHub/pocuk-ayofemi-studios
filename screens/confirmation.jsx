/* Ayofemi Studios — Email confirmation screen */

function ConfirmationScreen() {
  const { booking, go } = useApp();
  const service = SERVICES_CATALOG.find(s => s.id === booking.service);
  const [emailSent, setEmailSent] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setEmailSent(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fade-in" style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 32px 100px" }}>
      <div style={{ marginBottom: 48 }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 16 }}>● Booking #{booking.id} · confirmed</div>
        <h1 className="display" style={{ fontSize: "clamp(72px, 10vw, 144px)", margin: 0 }}>
          See you on <span style={{ fontStyle: "italic", color: "var(--primary)" }}>{booking.dateLabel?.split(",")[0]}</span>.
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64 }}>
        {/* Email mockup */}
        <div>
          <div className="mono" style={{ color: "var(--muted)", marginBottom: 16 }}>● A confirmation just landed in your inbox</div>
          <div className="card" style={{ overflow: "hidden", boxShadow: "0 20px 60px -20px rgba(0,0,0,0.15)" }}>
            {/* Email header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", background: "var(--paper-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="mono" style={{ color: "var(--muted)" }}>
                  {emailSent ? "✓ Sent via SendGrid · sandbox" : "Sending…"}
                </div>
                <div className="mono" style={{ color: "var(--muted)" }}>{new Date().toLocaleString("en-NG", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "60px 1fr", gap: 12, alignItems: "center" }}>
                <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--ink)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 22, fontStyle: "italic" }}>A</span>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Ayofemi Studios</span>
                    <span className="mono" style={{ color: "var(--muted)" }}>hello@ayofemi.studio</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>to {booking.email}</div>
                </div>
              </div>
              <div style={{ marginTop: 16, fontSize: 17, fontWeight: 500 }}>Your sitting is confirmed — {booking.dateLabel}</div>
            </div>

            {/* Email body */}
            <div style={{ padding: 32 }}>
              <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.65 }}>Dear {booking.name?.split(" ")[0] || "friend"},</p>
              <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.65 }}>
                Thank you — your <strong>{service?.title?.toLowerCase()}</strong> is confirmed for <strong>{booking.dateLabel}</strong> at <strong>{booking.time}</strong>. We've added it to the studio calendar.
              </p>

              <div style={{ background: "var(--paper-2)", padding: 20, borderRadius: 6, margin: "20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <EmailDetail label="Booking #" value={booking.id} />
                <EmailDetail label="Service" value={service?.title} />
                <EmailDetail label="Date" value={booking.dateLabel} />
                <EmailDetail label="Time" value={booking.time} />
                <EmailDetail label="Studio" value="12 Awolowo Rd, Ikoyi" />
                <EmailDetail label="Deposit paid" value={formatNaira(Math.round((booking.total || 0) * 0.3))} />
              </div>

              <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.65 }}>
                A short pre-session questionnaire will arrive a week before your sitting. If anything changes on your side, just reply to this thread — we'll figure it out.
              </p>

              <p style={{ margin: "0 0 8px", fontSize: 15, lineHeight: 1.65 }}>Until then,</p>
              <p style={{ margin: 0, fontSize: 20, fontFamily: "var(--font-display)", fontStyle: "italic" }}>Ayọfẹmi & the studio team</p>

              <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-dark btn-sm">Add to calendar</button>
                <button className="btn btn-ghost btn-sm">Reschedule</button>
                <button className="btn btn-ghost btn-sm">View booking</button>
              </div>
            </div>

            <div style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", background: "var(--paper-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", display: "flex", justifyContent: "space-between" }}>
              <span>Ayofemi Studios · Lagos</span>
              <span>Unsubscribe · Preferences</span>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>● What happens next</div>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
              <Step num="01" title="Confirmation email" sub="Sent now — also check spam, just in case." done />
              <Step num="02" title="Pre-session call" sub="We'll reach out 5 days before to talk wardrobe and intent." />
              <Step num="03" title="The sitting" sub={`${booking.dateLabel} at ${booking.time}, at the Ikoyi studio.`} />
              <Step num="04" title="Gallery delivery" sub="Within 10 working days, in your client account." />
            </ol>
          </div>

          <hr className="divider" />

          <div>
            <div className="display" style={{ fontSize: 28, marginBottom: 8 }}>While you wait —</div>
            <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 20, fontSize: 14, lineHeight: 1.55 }}>
              Browse recent frames or set up your client account so the gallery has somewhere to land.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => go("dashboard")} className="btn btn-primary">Go to your account →</button>
              <button onClick={() => go("portfolio")} className="btn btn-ghost">Browse the archive</button>
              <button onClick={() => go("home")} className="btn btn-ghost">Back to home</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EmailDetail({ label, value }) {
  return (
    <div>
      <div className="mono" style={{ color: "var(--muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function Step({ num, title, sub, done }) {
  return (
    <li style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, paddingBottom: 18, borderBottom: "1px solid var(--line)" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: done ? "var(--primary)" : "transparent",
        color: done ? "var(--primary-ink)" : "var(--ink)",
        border: done ? "1px solid var(--primary)" : "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-mono)", fontSize: 11,
      }}>{done ? "✓" : num}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{sub}</div>
      </div>
    </li>
  );
}

Object.assign(window, { ConfirmationScreen });
