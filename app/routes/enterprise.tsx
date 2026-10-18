import { Building2, KeyRound, Gauge, Headset } from "lucide-react";
import type { Route } from "./+types/enterprise";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Arqive — Enterprise" },
    {
      name: "description",
      content: "Arqive for architecture firms: SSO, dedicated capacity and private deployment.",
    },
  ];
}

const pillars = [
  {
    icon: Building2,
    title: "Private by design",
    body: "Plans, renders and project metadata live inside your firm's own cloud tenant. Nothing leaves your perimeter.",
  },
  {
    icon: KeyRound,
    title: "SSO & audit trails",
    body: "SAML/OIDC sign-in, SCIM group sync and a full audit log of every render, share and export.",
  },
  {
    icon: Gauge,
    title: "Dedicated capacity",
    body: "Reserved rendering throughput with SLA-backed latency for 10 a.m. client meetings.",
  },
  {
    icon: Headset,
    title: "Designated support",
    body: "A named support engineer, quarterly training sessions and direct roadmap influence.",
  },
];

export default function Enterprise() {
  return (
    <div className="page">
      <Navbar />

      <header className="page-hero">
        <p className="eyebrow">Enterprise</p>
        <h1>
          Arqive at{" "}
          <span className="accent">firm scale</span>
        </h1>
        <p className="lead">
          Move your whole practice to plan-to-3D in a week — without moving a
          single file outside your own infrastructure.
        </p>
        <div className="page-hero-actions">
          <Button size="lg">Talk to sales</Button>
          <Button variant="outline" size="lg" className="demo">
            Download overview
          </Button>
        </div>
      </header>

      <section className="section">
        <div className="feature-grid">
          {pillars.map(({ icon: Icon, title, body }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">
                <Icon size={18} />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="enterprise-strip">
          <div className="strip-stat">
            <span className="num">99.9%</span>
            <span className="lbl">render availability SLA</span>
          </div>
          <div className="strip-stat">
            <span className="num">&lt;60s</span>
            <span className="lbl">p95 plan-to-render</span>
          </div>
          <div className="strip-stat">
            <span className="num">0</span>
            <span className="lbl">bytes stored outside your tenant</span>
          </div>
          <div className="strip-stat">
            <span className="num">1 week</span>
            <span className="lbl">average firm onboarding</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="steps">
          <div className="step">
            <span className="step-num">01</span>
            <h3>Pilot</h3>
            <p>Two-week program with one of your live projects, run against your acceptance criteria.</p>
          </div>
          <div className="step">
            <span className="step-num">02</span>
            <h3>Deploy</h3>
            <p>SSO, storage policies and capacity provisioning configured with your IT team.</p>
          </div>
          <div className="step">
            <span className="step-num">03</span>
            <h3>Scale</h3>
            <p>Roll out studio by studio with training sessions and a named support engineer.</p>
          </div>
        </div>
      </section>

      <section className="section-cta">
        <h2>Bring Arqive to your firm</h2>
        <p>Get a pilot proposal within two business days.</p>
        <Button size="lg">Contact sales</Button>
      </section>

      <Footer />
    </div>
  );
}
