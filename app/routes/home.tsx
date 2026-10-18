import {
  ArrowRight,
  Check,
  Clock,
  Layers,
  Quote,
  Sparkles,
  Ruler,
  Share2,
} from "lucide-react";
import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { createProject } from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Arqive — Turn floor plans into 3D renders, instantly" },
    {
      name: "description",
      content:
        "Arqive turns 2D floor plans into photorealistic, top-down 3D architectural renders in seconds. Upload a plan, get a render.",
    },
  ];
}

const features = [
  {
    icon: Sparkles,
    title: "AI plan-to-3D",
    body: "Photorealistic top-down renders generated from any floor plan image — CAD-exported or hand-drawn.",
  },
  {
    icon: Layers,
    title: "Furniture-aware",
    body: "Plans are mapped room by room: beds, sofas, kitchens and baths inferred from your own icons.",
  },
  {
    icon: Ruler,
    title: "Dimensionally honest",
    body: "Walls extrude from your exact plan lines. All text and labels are automatically cleaned away.",
  },
  {
    icon: Clock,
    title: "Under a minute",
    body: "No plugins or GPU farms. Upload a plan and a share-ready render comes back in seconds.",
  },
  {
    icon: Share2,
    title: "One-click sharing",
    body: "Every render gets a permanent hosted link — send it to clients straight from the visualizer.",
  },
  {
    icon: Check,
    title: "Private by default",
    body: "Projects live in your own account storage. Never sold, never trained on.",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload your plan",
    body: "Drag in a JPG, PNG or WebP floor plan up to 10 MB.",
  },
  {
    step: "02",
    title: "AI renders it",
    body: "Arqive extrudes walls and drops realistic materials into every room.",
  },
  {
    step: "03",
    title: "Export or share",
    body: "Download the PNG or copy a hosted client link, instantly.",
  },
];

const testimonials = [
  {
    quote:
      "I sent a client a full package of renders — for a concept that existed only as a sketch PDF an hour earlier. Closed the retainer the same week.",
    name: "M. Reyes",
    role: "Principal, small residential studio",
  },
  {
    quote:
      "Most 'AI render' tools invent rooms that aren't in my plan. Arqive keeps the layout exactly and just makes it beautiful. That's the whole ballgame.",
    name: "J. Halvorsen",
    role: "Freelance architect",
  },
  {
    quote:
      "We use it in studio critiques now. Students upload a plan and we discuss the actual spatial result, not a mental image.",
    name: "Prof. A. Okoye",
    role: "Architecture faculty",
  },
];

const faqs = [
  {
    q: "What can I upload?",
    a: "JPG, PNG or WebP floor plans up to 10 MB — exported from your CAD tool or a phone photo of a hand drawing.",
  },
  {
    q: "Do I need a special account?",
    a: "No. Sign in with Puter and your free monthly AI allowance covers rendering — you pay nothing to start.",
  },
  {
    q: "Where are my projects stored?",
    a: "In your own Puter account storage, hosted by you. Arqive never stores your plans on our side.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUploadComplete = async (base64Image: string) => {
    const newId = crypto.randomUUID();
    const name = `Residence ${projects.length + 1}`;

    const newItem = {
      id: newId,
      name,
      sourceImage: base64Image,
      renderedImage: undefined,
      timestamp: Date.now(),
    };

    const saved = await createProject({ item: newItem, visibility: "private" });

    if (!saved) {
      console.error("Failed to create project");
      setUploadError(
        "We couldn't save this project. Please check that you're signed in and try again.",
      );
      return false;
    }

    setProjects((prev) => [newItem, ...prev]);

    navigate(`/visualizer/${newId}`, {
      state: {
        initialImage: saved.sourceImage,
        initialRender: saved.renderedImage || null,
        name,
      },
    });

    return true;
  };

  return (
    <div className="page home">
      <Navbar />

      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Introducing Arqive 2.0</p>
        </div>

        <h1>Build beautiful spaces at the speed of thought with Arqive</h1>
        <p className="subtitle">
          Arqive is an AI-first design environment that helps you visualize,
          render, and ship architectural projects faster than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Build <ArrowRight className="icon" />
          </a>

          <Link to="/product" className="btn btn--outline btn--lg demo">
            See how it works
          </Link>
        </div>
      </section>

      {uploadError && (
        <p className="upload-error" role="alert">
          {uploadError}
        </p>
      )}

      <section id="upload" className="section">
        <div className="section-head">
          <h2>Drop in a plan</h2>
          <p>JPG, PNG or WebP — hand drawings work too.</p>
        </div>
        <Upload onComplete={handleUploadComplete} />
      </section>

      <section className="section">
        <div className="steps">
          {steps.map(({ step, title, body }) => (
            <div key={step} className="step">
              <span className="step-num">{step}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Everything you need to visualize</h2>
          <p>One pipeline. No CAD plugins, no render farms, no waiting rooms.</p>
        </div>

        <div className="feature-grid">
          {features.map(({ icon: Icon, title, body }) => (
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
        <div className="showcase">
          <figure>
            <img src="/floor-plan.webp" alt="Floor plan example" loading="lazy" />
            <figcaption>Start with a plain 2D plan</figcaption>
          </figure>
          <div className="showcase-copy">
            <h2>Sees walls, not pixels</h2>
            <p>
              Arqive reads your drawing the way an architect does. Door swings
              become open doors. Thin perimeter lines become glass windows. Text
              and dimensions quietly disappear.
            </p>
            <p>
              What you get back is a clean, photorealistic top-down render that
              matches your plan — line for line.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Loved by studios of one</h2>
          <p>What people say after their first render.</p>
        </div>
        <div className="feature-grid">
          {testimonials.map(({ quote, name, role }) => (
            <figure key={name} className="feature-card testimonial">
              <Quote size={18} className="feature-icon" />
              <blockquote>"{quote}"</blockquote>
              <figcaption>
                <strong>{name}</strong>
                <span>{role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="showcase">
          <div className="showcase-copy">
            <h2>Simple pricing that starts free</h2>
            <p>
              Unlimited plans and renders on the free tier through your Puter
              account. Upgrade to Pro for priority renders, style control and
              client decks.
            </p>
          </div>
          <div className="showcase-actions">
            <Link to="/pricing" className="btn btn--primary btn--lg">
              View pricing
            </Link>
          </div>
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

      <section className="section-cta">
        <h2>Your next plan is 60 seconds from a render</h2>
        <p>Free to try. No card, no plugins, no export dialogs.</p>
        <a href="#upload" className="btn btn--primary btn--lg cta">
          Start now <ArrowRight size={16} />
        </a>
      </section>

      <Footer />
    </div>
  );
}
