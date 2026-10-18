import { Layers, Sparkles, Ruler, Share2, Zap, ShieldCheck } from "lucide-react";
import type { Route } from "./+types/product";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Arqive — Product" },
    {
      name: "description",
      content: "Turn 2D floor plans into photorealistic 3D renders in seconds.",
    },
  ];
}

const capabilities = [
  {
    icon: Sparkles,
    title: "Plan-to-3D rendering",
    body: "Upload any floor plan and our vision model extrudes walls, places windows and doors, and maps fixtures — geometry stays true to your drawing.",
  },
  {
    icon: Layers,
    title: "Furniture-aware mapping",
    body: "Beds, sofas, kitchens and bathroom fixtures are inferred only from clear plan icons — never fabricated content.",
  },
  {
    icon: Ruler,
    title: "Text-free output",
    body: "Dimensions and labels are removed automatically, leaving continuous floors and crisp architectural lines.",
  },
  {
    icon: Share2,
    title: "Instant sharing",
    body: "Every render gets a permanent hosted link. Export as PNG or share straight to your client.",
  },
  {
    icon: Zap,
    title: "Seconds, not hours",
    body: "The full plan-to-render pipeline completes in under a minute — no plugins, no CAD exports, no GPU farm.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, your account",
    body: "Projects are stored in your own account storage. We never train on your plans.",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload a floor plan",
    body: "Drop in a JPG, PNG or WebP plan. Hand-drawn or CAD-exported — both work.",
  },
  {
    step: "02",
    title: "AI renders it",
    body: "The visualizer extrudes your geometry and fills rooms with realistic materials and lighting.",
  },
  {
    step: "03",
    title: "Export or share",
    body: "Download the render as PNG, or copy a hosted link for your client in one click.",
  },
];

export default function Product() {
  return (
    <div className="page">
      <Navbar />

      <header className="page-hero">
        <p className="eyebrow">Product</p>
        <h1>
          From flat plan to living space,{" "}
          <span className="accent">in one upload</span>
        </h1>
        <p className="lead">
          Arqive reads your 2D drawings the way an architect does — walls,
          openings, fixtures — and turns them into a photorealistic visualization
          your clients can instantly understand.
        </p>
      </header>

      <section className="section">
        <div className="section-head">
          <h2>What Arqive does</h2>
          <p>Six capabilities that replace an entire rendering pipeline.</p>
        </div>

        <div className="feature-grid">
          {capabilities.map(({ icon: Icon, title, body }) => (
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
        <div className="section-head">
          <h2>How it works</h2>
        </div>
        <ol className="steps">
          {steps.map(({ step, title, body }) => (
            <li key={step} className="step">
              <span className="step-num">{step}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="showcase">
          <figure>
            <img src="/floor-plan.webp" alt="Example floor plan" loading="lazy" />
            <figcaption>Input — a plain 2D floor plan</figcaption>
          </figure>
          <div className="showcase-copy">
            <h2>Sees walls, not pixels</h2>
            <p>
              Arqive's render prompt enforces strict geometry fidelity: walls
              extrude exactly from plan lines, door swings become open doors, and
              thin perimeter lines become glass windows — before any material or
              furniture is applied.
            </p>
            <p>
              The result is a clean, top-down 3D visualization that matches your
              drawing at every line.
            </p>
          </div>
        </div>
      </section>

      <section className="section-cta">
        <h2>Try one plan for free</h2>
        <p>No plugin, no export, no waiting room.</p>
        <Button size="lg" onClick={() => (location.hash = "upload")}>
          Get started
        </Button>
      </section>

      <Footer />
    </div>
  );
}
