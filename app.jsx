/* Ayofemi Studios — App shell, routing, state, tweaks */
const { useState: useS, useEffect: useE, useMemo: useM } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "oxblood",
  "fonts": "editorial",
  "mode": "light",
  "bookingStyle": "stepper",
  "heroVariant": "editorial"
}/*EDITMODE-END*/;

// Seed bookings for demo
const SEED_BOOKINGS = [
  { id: "AYO-4821", name: "Folake Okonkwo", email: "folake@onile.studio", service: "editorial", date: "2026-06-12", dateLabel: "Jun 12, 2026", time: "10:30", total: 250000, status: "confirmed", addons: ["makeup"] },
  { id: "AYO-4818", name: "Kemi Adesanya", email: "kemi@adesanya.co", service: "wedding", date: "2026-07-04", dateLabel: "Jul 4, 2026", time: "09:00", total: 645000, status: "pending", addons: ["rush"] },
  { id: "AYO-4815", name: "Tunde Bakare", email: "tunde@bakareworks.com", service: "portrait", date: "2026-06-02", dateLabel: "Jun 2, 2026", time: "14:30", total: 75000, status: "confirmed" },
  { id: "AYO-4810", name: "Ada Eze", email: "ada@iridae.studio", service: "commercial", date: "2026-05-30", dateLabel: "May 30, 2026", time: "13:00", total: 378000, status: "completed", addons: ["prints"] },
  { id: "AYO-4805", name: "Folake Okonkwo", email: "folake@onile.studio", service: "portrait", date: "2026-04-18", dateLabel: "Apr 18, 2026", time: "16:00", total: 75000, status: "completed" },
];

function App() {
  // Tweaks
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Routing
  const [route, setRoute] = useS("home");
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0, behavior: "instant" }); };

  // Auth
  const [user, setUser] = useS(null);
  const signIn = (u) => setUser(u);
  const signOut = () => { setUser(null); go("home"); };

  // Booking state
  const [booking, setBooking] = useS({});
  const [bookings, setBookings] = useS(SEED_BOOKINGS);

  // Services (admin-editable)
  const [services, setServices] = useS(SERVICES_CATALOG);

  // Availability (admin-editable)
  const [availability, setAvailability] = useS({});

  // Toast
  const [toast, setToast] = useS(null);
  useE(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  // Apply palette/fonts/mode to <html>
  useE(() => {
    const root = document.documentElement;
    root.setAttribute("data-palette", tweaks.palette);
    root.setAttribute("data-fonts", tweaks.fonts);
    root.setAttribute("data-mode", tweaks.mode);
  }, [tweaks.palette, tweaks.fonts, tweaks.mode]);

  // Helper: jump to booking with a pre-selected service
  const goWithService = (serviceId) => {
    setBooking({ ...booking, service: serviceId });
    go("booking");
  };

  const ctx = {
    route, go, goWithService,
    user, signIn, signOut,
    booking, setBooking,
    bookings, setBookings,
    services, setServices,
    availability, setAvailability,
    toast, setToast,
    tweaks, setTweak,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="app-shell" data-screen-label={"Screen: " + route}>
        {route !== "auth" && <NavBar />}
        <main style={{ flex: 1 }}>
          {route === "home" && <HomeScreen heroVariant={tweaks.heroVariant} />}
          {route === "portfolio" && <PortfolioScreen />}
          {route === "booking" && <BookingScreen style={tweaks.bookingStyle} />}
          {route === "auth" && <AuthScreen />}
          {route === "dashboard" && <DashboardScreen />}
          {route === "admin" && <AdminScreen />}
          {route === "checkout" && <CheckoutScreen />}
          {route === "confirmation" && <ConfirmationScreen />}
        </main>
        {!["auth", "admin", "checkout"].includes(route) && <Footer />}
      </div>

      <Toast toast={toast} />

      <AyofemiTweaks tweaks={tweaks} setTweak={setTweak} go={go} route={route} />
    </AppContext.Provider>
  );
}

// ─── Tweaks panel ────────────────────────────────────────────────────────
function AyofemiTweaks({ tweaks, setTweak, go, route }) {
  return (
    <TweaksPanel>
      <TweakSection label="Aesthetic">
        <TweakSelect
          label="Palette"
          value={tweaks.palette}
          onChange={(v) => setTweak("palette", v)}
          options={[
            { value: "oxblood", label: "Oxblood · burgundy + cream + amber" },
            { value: "midnight", label: "Midnight · ink + champagne + coral" },
            { value: "ochre", label: "Ochre · earth + bone + emerald" },
          ]}
        />
        <TweakSelect
          label="Font pairing"
          value={tweaks.fonts}
          onChange={(v) => setTweak("fonts", v)}
          options={[
            { value: "editorial", label: "Editorial · Instrument Serif + DM Sans" },
            { value: "modernist", label: "Modernist · Space Grotesk" },
            { value: "classical", label: "Classical · Playfair + Work Sans" },
          ]}
        />
        <TweakRadio
          label="Mode"
          value={tweaks.mode}
          onChange={(v) => setTweak("mode", v)}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </TweakSection>

      <TweakSection label="Layout">
        <TweakSelect
          label="Hero variant"
          value={tweaks.heroVariant}
          onChange={(v) => { setTweak("heroVariant", v); go("home"); }}
          options={[
            { value: "editorial", label: "Editorial · oversized type" },
            { value: "split", label: "Split · image + copy" },
            { value: "marquee", label: "Marquee · scrolling frames" },
          ]}
        />
        <TweakRadio
          label="Booking flow"
          value={tweaks.bookingStyle}
          onChange={(v) => { setTweak("bookingStyle", v); if (route === "booking") go("booking"); }}
          options={[
            { value: "stepper", label: "Stepper" },
            { value: "single", label: "Single page" },
          ]}
        />
      </TweakSection>

      <TweakSection label="Jump to a screen">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[
            ["home", "Home"],
            ["portfolio", "Portfolio"],
            ["booking", "Booking"],
            ["auth", "Sign in"],
            ["dashboard", "Dashboard"],
            ["admin", "Admin"],
            ["checkout", "Checkout"],
            ["confirmation", "Confirmation"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => go(id)}
              style={{
                padding: "8px 10px", borderRadius: 4,
                border: "1px solid " + (route === id ? "var(--ink)" : "var(--line)"),
                background: route === id ? "var(--ink)" : "transparent",
                color: route === id ? "var(--paper)" : "var(--ink)",
                fontSize: 12, textAlign: "left", cursor: "pointer",
              }}>{label}</button>
          ))}
        </div>
      </TweakSection>
    </TweaksPanel>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById("app")).render(<App />);
