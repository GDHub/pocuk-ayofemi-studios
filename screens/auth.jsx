/* Ayofemi Studios — Auth (signup / login) */

function AuthScreen() {
  const { signIn, go, setToast } = useApp();
  const [mode, setMode] = React.useState("signin");
  const [form, setForm] = React.useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e?.preventDefault();
    if (mode === "signup" && !form.name) return;
    if (!form.email || !form.password) return;
    setLoading(true);
    setTimeout(() => {
      signIn({
        name: mode === "signup" ? form.name : (form.email.split("@")[0].replace(/\W/g, " ") || "Friend"),
        email: form.email,
        isAdmin: false,
      });
      setToast(mode === "signup" ? "Welcome to the studio." : "Welcome back.");
      go("dashboard");
    }, 700);
  };

  return (
    <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 60px)" }}>
      <div className="placeholder" data-label="studio · ikoyi · 04:00pm" style={{ minHeight: 600 }}></div>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 80px" }}>
        <div style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
          <div className="mono" style={{ color: "var(--muted)", marginBottom: 16 }}>● {mode === "signin" ? "Sign in" : "Create account"}</div>
          <h1 className="display" style={{ fontSize: 72, margin: "0 0 12px" }}>
            {mode === "signin" ? <>Welcome <span style={{ fontStyle: "italic", color: "var(--primary)" }}>back</span>.</> : <>Make a <span style={{ fontStyle: "italic", color: "var(--primary)" }}>seat</span>.</>}
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: 36, lineHeight: 1.55 }}>
            {mode === "signin" ? "Sign in to manage your sittings and revisit galleries." : "An Ayofemi account holds your sittings, your galleries, and your prints."}
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {mode === "signup" && (
              <label className="field">
                <span className="field-label">Full name</span>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ayọkunle Adeyemi" />
              </label>
            )}
            <label className="field">
              <span className="field-label">Email</span>
              <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </label>
            <label className="field">
              <span className="field-label">Password</span>
              <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </label>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner"></span> One moment</> : (mode === "signin" ? "Sign in →" : "Create account →")}
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                style={{ fontSize: 13, color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: 4 }}>
                {mode === "signin" ? "No account? Create one →" : "Already have an account? Sign in →"}
              </button>
              {mode === "signin" && <button type="button" style={{ fontSize: 13, color: "var(--muted)" }}>Forgot password?</button>}
            </div>
          </form>

          <hr className="divider" style={{ margin: "36px 0 28px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button onClick={() => { signIn({ name: "Folake Okonkwo", email: "folake@onile.studio", isAdmin: false }); go("dashboard"); }}
              className="btn btn-ghost btn-sm">Demo as Client →</button>
            <button onClick={() => { signIn({ name: "Ayofemi A.", email: "ayofemi@ayofemi.studio", isAdmin: true }); go("admin"); }}
              className="btn btn-ghost btn-sm">Demo as Admin →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuthScreen });
