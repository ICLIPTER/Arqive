import { Eye, ImageOff, Sparkles } from "lucide-react";
import type { Route } from "./+types/gallery";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { listGallery } from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Arqive — Gallery" },
    {
      name: "description",
      content: "See what the community turned their floor plans into.",
    },
  ];
}

// Demo entries so the gallery is never empty — removed once real entries exist.
const SAMPLE_ITEMS: GalleryItem[] = [];

const Gallery = () => {
  const { userName } = useOutletContext<AuthContext>();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const entries = await listGallery();

      if (!cancelled) {
        setItems(entries.length ? entries : SAMPLE_ITEMS);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userName]);

  return (
    <div className="page">
      <Navbar />

      <header className="page-hero">
        <p className="eyebrow">Gallery</p>
        <h1>
          Created in Arqive,{" "}
          <span className="accent">and published</span>
        </h1>
        <p className="lead">
          Renders published by the community — every one of these started life as a
          flat 2D floor plan. Publish your own from the visualizer.
        </p>
      </header>

      <section className="section">
        {loading ? (
          <div className="gallery-loading">Loading gallery…</div>
        ) : items.length === 0 ? (
          <div className="gallery-empty">
            <ImageOff size={22} />
            <p>
              No published renders yet. Generate one in the visualizer and hit{" "}
              <strong>“Publish”</strong> — it will appear here.
            </p>
          </div>
        ) : (
          <div className="gallery-grid">
            {items.map((item) => (
              <figure key={item.id} className="gallery-card">
                <img
                  src={item.renderImage}
                  alt={item.name}
                  loading="lazy"
                />

                <figcaption>
                  <div className="gallery-meta">
                    <strong>{item.name}</strong>
                    <span>
                      {item.author ? `by ${item.author} · ` : ""}
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {item.projectId && (
                    <span className="gallery-tag" title="From this project">
                      <Sparkles size={12} /> AI render
                    </span>
                  )}
                </figcaption>

                {item.projectId && (
                  <a
                    href={`/visualizer/${item.projectId}`}
                    className="gallery-open"
                    aria-label={`Open ${item.name}`}
                  >
                    <Eye size={14} />
                  </a>
                )}
              </figure>
            ))}
          </div>
        )}

        {!loading && (
          <div className="section-cta gallery-cta">
            <h2>Your render belongs here</h2>
            <p>Upload a plan, then hit Publish in the visualizer.</p>
            <Button size="lg" onClick={() => (location.href = "/#upload")}>
              Get started
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
