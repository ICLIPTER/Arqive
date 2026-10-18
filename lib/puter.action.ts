import puter from "@heyputer/puter.js";
import {
  getOrCreateHostingConfig,
  uploadImageToHosting,
} from "./puter.hosting";
import { isHostedUrl } from "./utils";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
  try {
    return await puter.auth.getUser();
  } catch {
    return null;
  }
};

const PROJECT_KEY = (id: string) => `arqive:project:${id}`;
const PROJECT_INDEX_KEY = "arqive:projects:index";

const hasRender = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0;

const updateIndex = async (projectId: string, remove = false) => {
  try {
    const index = ((await puter.kv.get(PROJECT_INDEX_KEY)) as string[]) || [];

    const next = remove
      ? index.filter((id) => id !== projectId)
      : index.includes(projectId)
        ? index
        : [projectId, ...index];

    await puter.kv.set(PROJECT_INDEX_KEY, next);
  } catch (e) {
    console.warn("Failed to update project index:", e);
  }
};

const hostAsset = async ({
  projectId,
  url,
  label,
}: {
  projectId: string;
  url?: string;
  label: "source" | "rendered";
}) => {
  if (!url) return undefined;

  const hosting = await getOrCreateHostingConfig();

  const hosted = projectId
    ? await uploadImageToHosting({ hosting, url, projectId, label })
    : null;

  return hosted?.url ?? undefined;
};

export const createProject = async ({
  item,
  visibility = "private",
}: CreateProjectParams): Promise<DesignItem | null> => {
  if (!item?.id || !item.sourceImage) return null;

  const sourceImage = await hostAsset({
    projectId: item.id,
    url: item.sourceImage,
    label: "source",
  });

  if (!sourceImage) {
    console.warn("Failed to host source image, project not saved.");
    return null;
  }

  const renderedImage =
    (item.renderedImage &&
      (await hostAsset({
        projectId: item.id,
        url: item.renderedImage,
        label: "rendered",
      }))) ||
    undefined;

  const project: DesignItem = {
    ...item,
    visibility,
    sourceImage,
    renderedImage,
    timestamp: item.timestamp ?? Date.now(),
  };

  try {
    await puter.kv.set(PROJECT_KEY(item.id), JSON.stringify(project));
    await updateIndex(item.id);

    return project;
  } catch (e) {
    console.warn("Failed to save project:", e);
    return null;
  }
};

export const updateProjectRender = async ({
  projectId,
  renderedImage,
}: {
  projectId: string;
  renderedImage: string;
}): Promise<DesignItem | null> => {
  try {
    const raw = (await puter.kv.get(PROJECT_KEY(projectId))) as DesignItem | null;
    if (!raw) return null;

    const hosted = hasRender(renderedImage)
      ? await hostAsset({ projectId, url: renderedImage, label: "rendered" })
      : undefined;

    const updated: DesignItem = {
      ...raw,
      renderedImage: hosted ?? raw.renderedImage,
    };

    await puter.kv.set(PROJECT_KEY(projectId), JSON.stringify(updated));

    return updated;
  } catch (e) {
    console.warn("Failed to update project render:", e);
    return null;
  }
};

export const getProject = async (
  projectId: string,
): Promise<DesignItem | null> => {
  try {
    const raw = (await puter.kv.get(PROJECT_KEY(projectId))) as DesignItem | null;
    return raw ? raw : null;
  } catch {
    return null;
  }
};

export const listProjects = async (): Promise<DesignItem[]> => {
  try {
    const index = ((await puter.kv.get(PROJECT_INDEX_KEY)) as string[]) || [];

    const results = await Promise.allSettled(
      index.map((id) => getProject(id)),
    );

    return results
      .filter((r): r is PromiseFulfilledResult<DesignItem> =>
        r.status === "fulfilled" && !!r.value,
      )
      .map((r) => r.value);
  } catch {
    return [];
  }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    await puter.kv.del(PROJECT_KEY(projectId));
    await updateIndex(projectId, true);

    return true;
  } catch {
    return false;
  }
};

/* ---------- Public gallery ---------- */

const GALLERY_KEY = (id: string) => `arqive:gallery:${id}`;
const GALLERY_INDEX_KEY = "arqive:gallery:index";

export const publishToGallery = async ({
  projectId,
  renderImage,
  author,
  name,
}: {
  projectId: string;
  renderImage: string | null | undefined;
  author?: string | null;
  name?: string | null;
}): Promise<GalleryItem | null> => {
  if (!projectId || !renderImage) return null;

  try {
    // Make sure the render is hosted so gallery images are shareable URLs.
    const hosted =
      renderImage.startsWith("data:")
        ? await hostAsset({
            projectId,
            url: renderImage,
            label: "rendered",
          })
        : renderImage;

    if (!hosted) return null;

    const entry: GalleryItem = {
      id: crypto.randomUUID(),
      projectId,
      name: name || "Untitled Project",
      renderImage: hosted,
      author: author || null,
      timestamp: Date.now(),
    };

    await puter.kv.set(GALLERY_KEY(entry.id), JSON.stringify(entry));
    await updateGalleryIndex(entry.id);

    return entry;
  } catch (e) {
    console.warn("Failed to publish to gallery:", e);
    return null;
  }
};

const updateGalleryIndex = async (entryId: string, remove = false) => {
  try {
    const index =
      ((await puter.kv.get(GALLERY_INDEX_KEY)) as string[]) || [];

    const next = remove
      ? index.filter((id) => id !== entryId)
      : index.includes(entryId)
        ? index
        : [entryId, ...index];

    await puter.kv.set(GALLERY_INDEX_KEY, next);
  } catch (e) {
    console.warn("Failed to update gallery index:", e);
  }
};

export const listGallery = async (): Promise<GalleryItem[]> => {
  try {
    const index = ((await puter.kv.get(GALLERY_INDEX_KEY)) as string[]) || [];

    const results = await Promise.allSettled(
      index.map(
        async (entryId) =>
          (await puter.kv.get(GALLERY_KEY(entryId))) as GalleryItem,
      ),
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<GalleryItem> =>
          r.status === "fulfilled" && !!r.value,
      )
      .map((r) => r.value)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
};
