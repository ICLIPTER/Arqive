import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router";
import { generate3DView } from "../../lib/ai.action";
import {
  getProject,
  publishToGallery,
  updateProjectRender,
} from "../../lib/puter.action";
import { Box, Download, Eye, RefreshCcw, Share2, X } from "lucide-react";

import type { Route } from "./+types/visualizer.$id";
import Button from "../../components/ui/Button";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const project = await getProject(params.id);

  return {
    id: params.id,
    project: project
      ? {
          sourceImage: project.sourceImage,
          renderedImage: project.renderedImage,
          name: project.name,
        }
      : null,
  };
};

const VisualizerId = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = useOutletContext<AuthContext>();

  const { initialImage, initialRender, name, ownerId } =
    (location.state as VisualizerLocationState) || {};

  const { id: projectId, project } = loaderData ?? { id: null, project: null };

  const hasGenerated = useRef(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const [publishStatus, setPublishStatus] = useState<"idle" | "published">("idle");

  const [currentImage, setCurrentImage] = useState<string | null>(
    initialRender || project?.renderedImage || null,
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBack = () => {
    navigate("/");
  };

  const sourceImage = initialImage || project?.sourceImage || null;

  const runGeneration = async () => {
    if (!sourceImage) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const result = await generate3DView({
        sourceImage,
      });

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);

        if (projectId) {
          // Persist the render so it is reused on later visits.
          const updated = await updateProjectRender({
            projectId,
            renderedImage: result.renderedImage,
          });

          if (updated?.renderedImage && !updated.renderedImage.startsWith("data:")) {
            setCurrentImage(updated.renderedImage);
          }
        }
      } else {
        throw new Error("The model returned no image. Please try again.");
      }
    } catch (error) {
      console.error("Generation failed:", error);

      const message =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : "Generation failed. Please try again.");

      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    if (!currentImage) return;

    const link = document.createElement("a");

    link.href = currentImage;
    link.download = `${projectId ?? "arqive"}-render.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleShare = async () => {
    if (!currentImage) return;

    try {
      setIsSharing(true);

      let shareUrl: string | undefined;

      if (!currentImage.startsWith("data:") && projectId) {
        const updated = await updateProjectRender({
          projectId,
          renderedImage: currentImage,
        });

        shareUrl = updated?.renderedImage?.startsWith("http")
          ? updated.renderedImage
          : undefined;
      }

      if (!shareUrl) {
        throw new Error("Could not generate a share link. Try again after rendering completes.");
      }

      await navigator.clipboard.writeText(shareUrl);

      setShareStatus("done");
    } catch (e) {
      console.error("Share failed:", e);

      const reason =
        (e as { msg?: string })?.msg ||
        (e instanceof Error ? e.message : "Share failed");

      setErrorMessage(reason);
    } finally {
      setIsSharing(false);
      setTimeout(() => setShareStatus("idle"), 1500);
    }
  };

  const handlePublish = async () => {
    if (!currentImage) return;

    try {
      setIsProcessing(true);

      const result = await publishToGallery({
        projectId,
        renderImage: currentImage,
        author: userName,
        name: name || project?.name,
      });

      if (!result) throw new Error("Couldn't publish this render to the gallery.");

      setPublishStatus("published");
      navigate("/gallery");
    } catch (e) {
      console.error("Publish failed:", e);

      const reason =
        (e as { message?: string })?.message || "Publish failed";
      setErrorMessage(reason);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (hasGenerated.current) return;

    hasGenerated.current = true;

    // If render already exists, use it
    if (initialRender || project?.renderedImage) {
      setCurrentImage(initialRender || project?.renderedImage || null);
      return;
    }

    // Otherwise generate a new one
    if (sourceImage) {
      runGeneration();
    }
  }, []);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <Link to="/" className="brand" aria-label="Arqive home">
          <Box className="logo" />
          <span className="name">Arqive</span>
        </Link>

        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" />
          Exit Editor
        </Button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>

              <h2>{name || project?.name || "Untitled Project"}</h2>

              <p className="note">Created by you</p>
            </div>

            <div className="panel-actions">
              <Button
                size="sm"
                onClick={handleExport}
                className="export"
                disabled={!currentImage}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button
                size="sm"
                onClick={handlePublish}
                className="publish"
                disabled={!currentImage || isProcessing || project === null || publishStatus === "published"}
              >
                <Eye className="w-4 h-4 mr-2" />
                {publishStatus === "published" ? "In gallery" : "Publish"}
              </Button>

              <Button
                size="sm"
                onClick={handleShare}
                className="share"
                disabled={!currentImage || isSharing || Boolean(ownerId)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {isSharing ? "Sharing..." : shareStatus === "done" ? "Link copied!" : "Share"}
              </Button>
            </div>
          </div>

          <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
            {currentImage && currentImage !== sourceImage && (
              <img src={currentImage} alt="AI Render" className="render-img" />
            )}

            {!currentImage && !errorMessage && sourceImage && (
              <div className="render-placeholder">
                <img
                  src={sourceImage}
                  alt="Original"
                  className="render-fallback"
                />
              </div>
            )}

            {errorMessage && !isProcessing && (
              <div className="render-placeholder">
                <div className="render-error">
                  <p>{errorMessage}</p>

                  <Button size="sm" onClick={runGeneration}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner" />

                  <span className="title">Rendering...</span>

                  <span className="subtitle">
                    Generating your 3D visualization
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisualizerId;
