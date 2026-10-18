import { Check } from "lucide-react";
import type { Route } from "./+types/pricing";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Arqive — Pricing" },
    {
      name: "description",
      content: "Simple, transparent pricing for every stage of your practice.",
    },
  ];
}

const tiers = [
  {
    name: "Starter",
    price: "Free",
    note: "via your Puter account",
    features: [
      "Unlimited plan uploads",
      "Text-free 3D renders",
      "PNG export",
      "Hosted share links",
    ],
    cta: "Start for free",
    href: "#upload",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    note: "per user / month, billed yearly",
    features: [
      "Everything in Starter",
      "Priority render queue",
      "Render history cinematics",
      "Custom render styles",
      "Client-ready share decks",
    ],
    cta: "Start free trial",
    href: "#upload",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "tailored to your firm",
    features: [
      "Everything in Pro",
      "SSO & audit logging",
      "Dedicated capacity",
      "On-prem or private cloud",
      "Designated support engineer",
    ],
    cta: "Talk to sales",
    href: "/enterprise",
    highlight: false,
  },
];

const faqs = [
  {
    q: "How do free renders work?",
    a: "Starter runs on the Puter user-pays model — you sign in with a Puter account and your monthly AI allowance covers rendering. No card required, ever.",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes. Cancel whenever — your project history stays accessible in your account storage.",
  },
  {
    q: "Do you train models on my plans?",
    a: "No. Plans and renders are stored in your own Puter hosting and never used for training.",
  },
  {
    q: "What formats can I upload?",
    a: "JPG, PNG or WebP images of floor plans up to 10 MB, exported from any CAD tool or even photographed hand drawings.",
  },
];

export default function Pricing() {
  return (
    <div className="page">
      <Navbar />

      <header className="page-hero">
        <p className="eyebrow">Pricing</p>
        <h1>
          Fair pricing,{" "}
          <span className="accent">from zero</span>
        </h1>
        <p className="lead">
          Start free with no account limits. Upgrade when your team — or your
          clients — need more.
        </p>
      </header>

      <section className="section">
        <div className="pricing-grid">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`pricing-card ${tier.highlight ? "is-featured" : ""}`}
            >
              {tier.highlight && <span className="ribbon">Most popular</span>}
              <h3>{tier.name}</h3>
              <p className="price">{tier.price}</p>
              <p className="note">{tier.note}</p>
              <ul>
                {tier.features.map((f) => (
                  <li key={f}>
                    <Check size={16} className="check" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlight ? "primary" : "outline"}
                fullWidth
                onClick={() => (location.href = tier.href)}
              >
                {tier.cta}
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="faq">
        <div className="section-head">
          <h2>Questions, answered</h2>
        </div>
        <div className="faq-list">
          {faqs.map(({ q, a }) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
