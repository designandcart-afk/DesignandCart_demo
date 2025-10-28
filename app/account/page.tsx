"use client";

import { useEffect, useState } from "react";

// Let TS know about window.DC_AUTH
declare global {
  interface Window {
    DC_AUTH?: { email?: string } | null;
  }
}

type DesignerProfile = {
  name: string;
  email: string;
  phone: string;
  studio: string;
  experience: string;
  specialization: string;
  address: string;
  gstId?: string;
  certificationId?: string;
  reraId?: string;
  about: string;
  portfolioUrl?: string;
  profilePic?: string;
};

const PROFILE_KEY = "dc:designerProfile";
const USER_EMAIL_KEY = "dc:userEmail";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<DesignerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Read login + seed demo profile once
  useEffect(() => {
    const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
    setEmail(savedEmail);

    const existing = localStorage.getItem(PROFILE_KEY);
    if (existing) {
      setProfile(JSON.parse(existing) as DesignerProfile);
    } else {
      const demo: DesignerProfile = {
        name: "Demo Designer",
        email: "demo@designandcart.in",
        phone: "+91 98765 43210",
        studio: "De’Artisa Designs LLP",
        experience: "6 years",
        specialization: "Residential & Commercial Interiors",
        address: "HSR Layout, Bengaluru, Karnataka",
        gstId: "29ABCDE1234F2Z5",
        certificationId: "INT-000923",
        reraId: "RERA-KA-12345",
        about:
          "A passionate interior designer focused on modern, sustainable design. Helping clients visualize and implement spaces with real, purchasable products.",
        portfolioUrl: "https://designandcart.in/portfolio/demo",
        profilePic:
          "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&auto=format&fit=crop",
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(demo));
      setProfile(demo);
    }

    setLoading(false);
  }, []);

  // ---- Auth actions ----
  function doLogin(loginEmail: string) {
    localStorage.setItem(USER_EMAIL_KEY, loginEmail);
    if (typeof window !== "undefined") {
      window.DC_AUTH = { email: loginEmail };
      window.dispatchEvent(new Event("auth:change"));
    }
    setEmail(loginEmail);
  }

  function doLogout() {
    localStorage.removeItem(USER_EMAIL_KEY);
    if (typeof window !== "undefined") {
      window.DC_AUTH = null;
      window.dispatchEvent(new Event("auth:change"));
    }
    setEmail(null);
  }

  if (loading) {
    return <main className="p-10 text-zinc-500">Loading…</main>;
  }

  const isLoggedIn = !!email;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-1.5 rounded-full bg-[#d96857]" />
          <h1 className="text-2xl font-semibold text-[#2e2e2e]">Account</h1>
        </div>

        {!isLoggedIn ? (
          <AuthCard onLogin={doLogin} />
        ) : (
          <ProfileCard profile={profile!} email={email!} onLogout={doLogout} />
        )}
      </div>
    </main>
  );
}

// ---------------- Components ----------------

function AuthCard({ onLogin }: { onLogin: (email: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState("demo@designandcart.in");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // For demo: any email logs in; password ignored
    onLogin(loginEmail.trim());
  }

  return (
    <div className="max-w-md mx-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#2e2e2e] mb-1">
        {mode === "login" ? "Login" : "Create your account"}
      </h2>
      <p className="text-sm text-zinc-600 mb-4">
        {mode === "login"
          ? "Designers can log in to manage projects, chat, and orders."
          : "Sign up to start creating projects and adding products to designs."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Email</label>
          <input
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-2xl border border-zinc-300 bg-[#f2f0ed] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d96857]/30"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-zinc-300 bg-[#f2f0ed] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d96857]/30"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#d96857] text-white text-sm font-medium py-2.5 hover:opacity-95"
        >
          {mode === "login" ? "Login" : "Create Account"}
        </button>

        <div className="text-center text-xs text-zinc-600">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-[#d96857] underline underline-offset-2"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-[#d96857] underline underline-offset-2"
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

function ProfileCard({
  profile,
  email,
  onLogout,
}: {
  profile: DesignerProfile;
  email: string;
  onLogout: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#f2f0ed]">
          {/* Use <img> to avoid Next/Image config for now */}
          <img
            src={
              profile.profilePic ||
              "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&auto=format&fit=crop"
            }
            alt={profile.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#2e2e2e]">
            {profile.name}
          </h2>
          <p className="text-sm text-zinc-600">{profile.specialization}</p>
          <p className="text-sm text-zinc-600">{profile.studio}</p>
        </div>
      </div>

      {/* Contact */}
      <Section title="Contact Information">
        <Grid>
          <Info label="Email" value={email} />
          <Info label="Phone" value={profile.phone} />
          <Info label="Address" value={profile.address} />
          <Info label="Experience" value={profile.experience} />
        </Grid>
      </Section>

      {/* Professional */}
      <Section title="Professional Details" solid>
        <Grid>
          <Info label="Studio / Company" value={profile.studio} />
          <Info label="Specialization" value={profile.specialization} />
          <Info label="GST ID" value={profile.gstId || "-"} />
          <Info label="Certification ID" value={profile.certificationId || "-"} />
          <Info label="RERA ID" value={profile.reraId || "-"} />
          <Info label="Portfolio" value={profile.portfolioUrl} link />
        </Grid>
      </Section>

      {/* About */}
      <Section title="About Designer" solid>
        <p className="text-sm text-[#2e2e2e] leading-relaxed whitespace-pre-line">
          {profile.about}
        </p>
      </Section>

      {/* Certificates (static placeholders for demo) */}
      <Section title="Certificates / IDs">
        <ul className="list-disc list-inside text-sm text-[#2e2e2e] space-y-1">
          <li>Interior Design Certification — IDA (2019)</li>
          <li>3D Visualization Pro Certificate — Autodesk (2021)</li>
          <li>Registered with Indian Institute of Interior Designers</li>
        </ul>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={onLogout}
          className="bg-[#d96857] text-white rounded-2xl px-5 py-2 text-sm font-medium hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  solid = false,
}: {
  title: string;
  children: React.ReactNode;
  solid?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200 p-5 ${
        solid ? "bg-white shadow-sm" : "bg-[#f2f0ed]"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2e2e2e]">{title}</h3>
        <button className="text-xs text-[#d96857] hover:underline">Edit</button>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}

function Info({
  label,
  value,
  link = false,
}: {
  label: string;
  value?: string;
  link?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-zinc-500 mb-0.5">{label}</div>
      {value ? (
        link ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-[#d96857] hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <div className="text-sm text-[#2e2e2e]">{value}</div>
        )
      ) : (
        <div className="text-sm text-zinc-400">—</div>
      )}
    </div>
  );
}
