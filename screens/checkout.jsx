/* Ayofemi Studios — Checkout (sandbox payment UI) */

function CheckoutScreen() {
  const { booking, setBookings, bookings, go, setToast, user } = useApp();
  const [gateway, setGateway] = React.useState("stripe");
  const [card, setCard] = React.useState({ number: "4084 0840 8408 4081", expiry: "09/27", cvv: "408", name: user?.name || "" });
  const [phase, setPhase] = React.useState("form"); // form | processing | otp | done
  const [otp, setOtp] = React.useState("");

  const service = SERVICES_CATALOG.find(s => s.id === booking.service);
  const deposit = Math.round((booking.total || 0) * 0.3);

  React.useEffect(() => {
    if (!booking.service) go("booking");
  }, []);

  const pay = () => {
    setPhase("processing");
    setTimeout(() => setPhase("otp"), 1400);
  };

  const verify = () => {
    setPhase("processing");
    setTimeout(() => {
      setBookings([...bookings, { ...booking, status: "confirmed", paidAt: new Date().toISOString() }]);
      setPhase("done");
      setTimeout(() => go("confirmation"), 900);
    }, 1200);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 80px" }}>
      <button onClick={() => go("booking")} className="mono" style={{ color: "var(--muted)", marginBottom: 24 }}>← Back to booking</button>

      <div style={{ marginBottom: 40 }}>
        <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>● Secure checkout · sandbox mode</div>
        <h1 className="display" style={{ fontSize: "clamp(48px, 6vw, 80px)", margin: 0 }}>
          One <span style={{ fontStyle: "italic", color: "var(--primary)" }}>last</span> step.
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 48 }}>
        <div>
          {/* Gateway selector */}
          <div style={{ marginBottom: 32 }}>
            <div className="mono" style={{ color: "var(--muted)", marginBottom: 12 }}>Payment gateway</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { id: "stripe", name: "Stripe", sub: "Cards · Apple Pay · Google Pay" },
                { id: "paystack", name: "Paystack", sub: "Cards · Bank · Transfer" },
              ].map(g => (
                <button key={g.id} onClick={() => setGateway(g.id)}
                  style={{
                    padding: 20, borderRadius: 6,
                    border: `1px solid ${gateway === g.id ? "var(--ink)" : "var(--line)"}`,
                    background: gateway === g.id ? "var(--paper-2)" : "transparent",
                    textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4,
                  }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{g.name}</div>
                  <div className="mono" style={{ color: "var(--muted)" }}>{g.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment form */}
          <div className="card" style={{ padding: 32 }}>
            {phase === "form" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 className="display" style={{ fontSize: 28, margin: 0 }}>Card details</h2>
                  <span className="mono" style={{ color: "var(--muted)" }}>🔒 Sandbox · no real charge</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <Field label="Card number" value={card.number} onChange={v => setCard({ ...card, number: v })} placeholder="4084 0840 8408 4081" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 16 }}>
                    <Field label="Expiry" value={card.expiry} onChange={v => setCard({ ...card, expiry: v })} placeholder="MM/YY" />
                    <Field label="CVV" value={card.cvv} onChange={v => setCard({ ...card, cvv: v })} placeholder="408" />
                    <Field label="Name on card" value={card.name} onChange={v => setCard({ ...card, name: v })} placeholder="—" />
                  </div>
                </div>

                <div style={{ marginTop: 24, padding: 14, background: "var(--paper-2)", borderRadius: 4, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                  Test card <code style={{ fontFamily: "var(--font-mono)" }}>4084 0840 8408 4081</code> · any future expiry · CVV <code style={{ fontFamily: "var(--font-mono)" }}>408</code>. This is a sandbox flow — no funds move.
                </div>

                <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center" }}>
                  <button onClick={pay} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                    Pay {formatNaira(deposit)} now →
                  </button>
                </div>
              </>
            )}

            {phase === "processing" && (
              <div style={{ padding: "60px 0", textAlign: "center" }}>
                <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, color: "var(--primary)" }}></div>
                <div className="display" style={{ fontSize: 28, marginTop: 24 }}>Talking to {gateway === "stripe" ? "Stripe" : "Paystack"}…</div>
                <div className="mono" style={{ color: "var(--muted)", marginTop: 8 }}>● Sandbox transaction in flight</div>
              </div>
            )}

            {phase === "otp" && (
              <div>
                <div className="mono" style={{ color: "var(--muted)", marginBottom: 8 }}>● 3-D Secure</div>
                <h2 className="display" style={{ fontSize: 28, margin: "0 0 12px" }}>Enter the OTP</h2>
                <p style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: 14 }}>
                  Your bank sent a code to the number ending in <strong>**42</strong>. In sandbox, use <code style={{ fontFamily: "var(--font-mono)", background: "var(--paper-2)", padding: "2px 6px", borderRadius: 3 }}>123456</code>.
                </p>
                <input className="input input-box" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code"
                  maxLength={6} style={{ fontFamily: "var(--font-mono)", fontSize: 22, letterSpacing: "0.4em", textAlign: "center" }} />
                <button onClick={verify} className="btn btn-primary btn-lg"
                  disabled={otp.length < 4}
                  style={{ marginTop: 20, width: "100%", opacity: otp.length < 4 ? 0.4 : 1 }}>
                  Verify & confirm →
                </button>
              </div>
            )}

            {phase === "done" && (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--primary)", color: "var(--primary-ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✓</div>
                <div className="display" style={{ fontSize: 36, marginTop: 20 }}>Paid.</div>
                <div className="mono" style={{ color: "var(--muted)", marginTop: 8 }}>Redirecting…</div>
              </div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <aside>
          <div className="card" style={{ padding: 28, position: "sticky", top: 100 }}>
            <div className="mono" style={{ color: "var(--muted)", marginBottom: 16 }}>● Order summary</div>

            <div style={{ marginBottom: 20 }}>
              <div className="display" style={{ fontSize: 24 }}>{service?.title}</div>
              <div className="mono" style={{ color: "var(--muted)", marginTop: 6 }}>{booking.dateLabel} · {booking.time}</div>
            </div>

            <hr className="divider" />

            <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <Line label={service?.title} value={formatNaira(service?.price || 0)} />
              {(booking.addons || []).map(aid => {
                const a = ADDONS.find(x => x.id === aid);
                return <Line key={aid} label={a.title} value={formatNaira(a.price)} />;
              })}
            </div>

            <hr className="divider" />

            <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <Line label="Subtotal" value={formatNaira(booking.total || 0)} />
              <Line label="VAT (20%)" value="Included" muted />
              <Line label="Deposit (30%)" value={formatNaira(deposit)} bold />
              <Line label="Balance due at session" value={formatNaira((booking.total || 0) - deposit)} muted />
            </div>

            <hr className="divider" />

            <div style={{ paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="mono" style={{ color: "var(--muted)" }}>Pay today</span>
              <span className="display" style={{ fontSize: 40 }}>{formatNaira(deposit)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Line({ label, value, bold, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", color: muted ? "var(--muted)" : "var(--ink)", fontWeight: bold ? 600 : 400 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

Object.assign(window, { CheckoutScreen });
