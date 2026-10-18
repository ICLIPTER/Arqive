import { Code2, MessageCircle, BookOpen, Rocket, Users, Trophy } from "lucide-react";
import type { Route } from "./+types/community";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Arqive — Community" },
    {
      name: "description",
      content: "Join the Arqive community of architects, designers and makers.",
    },
  ];
}

const channels = [
  {
    icon: MessageCircle,
    title: "Discord",
    body: "Daily render critiques, prompt tips and support from the core team.",
    action: "Join the server",
    href: "#",
  },
  {
    icon: Code2,
    title: "Open recipes",
    body: "Browse community render recipes — from brutalist to hygge — and fork your own style.",
    action: "Browse recipes",
    href: "https://recipes.puter.com",
  },
  {
    icon: BookOpen,
    title: "Docs & playground",
    body: "Live playground where every Arqive feature can be tried in the browser.",
    action: "Read the docs",
    href: "https://docs.puter.com",
  },
];

const programs = [
  {
    icon: Rocket,
    title: "Builder grants",
    body: "Free Pro credits for tools built on Arqive's pipeline. Ship something, get credits.",
  },
  {
    icon: Users,
    title: "Studio partners",
    body: "A/B test new render features with our design partners before public release.",
  },
  {
    icon: Trophy,
    title: "Monthly render battle",
    body: "Same plan, best visualization community-voted. Winners featured on the homepage.",
  },
];

export default function Community() {
  return (
    <div className="page">
      <Navbar />

      <header className="page-hero">
        <p className="eyebrow">Community</p>
        <h1>
          Built with the people who{" "}
          <span className="accent">draw for a living</span>
        </h1>
        <p className="lead">
          Arqive's prompts, styles and features are shaped in public — by
          architects, students and designers using it every day.
        </p>
        <div className="page-hero-actions">
          <Button size="lg">Join the Discord</Button>
          <Button variant="outline" size="lg" className="demo">
            Browse recipes
          </Button>
        </div>
      </header>

      <section className="section">
        <div className="section-head">
          <h2>Where we hang out</h2>
        </div>
        <div className="feature-grid">
          {channels.map(({ icon: Icon, title, body, action, href }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">
                <Icon size={18} />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <a href={href} className="feature-link" target={href.startsWith("#") ? undefined : "_blank"} rel="noreferrer">
                {action} →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Community programs</h2>
        </div>
        <div className="feature-grid">
          {programs.map(({ icon: Icon, title, body }) => (
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

      <Footer />
    </div>
  );
}
