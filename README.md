# Arqive 🏛️

**Turn 2D floor plans into photorealistic 3D renders — in seconds, straight from the browser.**

Arqive is an AI-first design environment that reads architectural floor plans the way an architect does — walls, openings, fixtures — and converts them into clean, top-down, photorealistic 3D visualizations. Upload a plan, and a share-ready render comes back in under a minute. No plugins, no CAD exports, no render farm.

<p align="center">
  <img src="public/floor-plan.webp" alt="Arqive — floor plan to 3D render" width="640" />
</p>

---

## ✨ Features

- **🖼️ Plan-to-3D rendering** — Upload any floor plan (CAD export or even a photo of a hand drawing) and get a photorealistic, orthographic top-down render.
- **📐 Geometry-faithful output** — Walls extrude exactly from plan lines; door swings become open doors; thin perimeter lines become glass. Text, labels and dimensions are automatically removed.
- **🛋️ Furniture-aware mapping** — Beds, sofas, kitchen counters and bathroom fixtures are inferred *only* from icons clearly shown in the plan — never fabricated.
- **⏱️ Fast** — the full plan → render pipeline completes in under a minute.
- **🔗 One-click sharing** — every render gets a permanent hosted link for clients; export as PNG locally.
- **🎮 Interactive visualizer** — built-in editor view with original/render preview, retry, share and export actions.
- **🗂️ Persistent projects** — projects and renders live in *your* account storage via [Puter](https://puter.com) — refresh-safe routes and bookmarking work natively.
- **🖼️ Gallery** — publish renders to a public gallery page.
- **📄 Marketing site** — complete multi-page public site: homepage, product, pricing, community, enterprise.

## 🧰 Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [React Router 8](https://reactrouter.com) (SSR) + React 19 |
| Bundler | [Vite 8](https://vite.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) (nested `@apply` design system) |
| AI | [Puter.js](https://docs.puter.com) — `puter.ai.txt2img` (Gemini image models) |
| Storage | Puter KV (projects, gallery index) + Puter Hosting (public assets) |
| Auth | Puter accounts (`puter.auth`) |
| Icons | [Lucide](https://lucide.dev) |
| Containers | Multi-stage Dockerfile (Node 24) |

## 🚀 Getting started

### Prerequisites

- Node.js 20+ (Node 24 recommended)
- A [Puter](https://puter.com) account (free) — used for sign-in, AI credits, storage and hosting

### Run locally

```bash
git clone <your-repo-url>
cd arqive
npm install
npm run dev
```

Open **http://localhost:5173/**, click **Log in**, and sign in with Puter.

### Production build

```bash
npm run build     # type-generates routes + builds server bundle
npm run start     # serves the production build
```

### Type checking

```bash
npm run typecheck
```

### Docker

```bash
docker build -t arqive .
docker run -p 3000:3000 arqive
```

## ⚙️ Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_PUTER_WORKER_URL` | no | Optional server-side worker endpoint for cross-user features |

## 🏗️ Architecture

```
app/
├── routes/            # File routes (React Router 8)
│   ├── home.tsx       # Marketing homepage + upload
│   ├── visualizer.$id.tsx  # Rendering editor (loader-fetched, refresh-safe)
│   ├── product.tsx    # Product page
│   ├── pricing.tsx    # Pricing page
│   ├── community.tsx  # Community page
│   ├── enterprise.tsx # Enterprise page
│   └── gallery.tsx    # Public render gallery
├── root.tsx           # Auth state provider + error boundary
└── routes.ts          # Route manifest
components/            # Navbar, Footer, Upload, UI primitives
lib/
├── ai.action.ts       # Floor plan → render pipeline (image-to-image)
├── puter.action.ts    # Projects, gallery, auth (KV + hosting)
├── puter.hosting.ts   # Asset hosting helpers
└── constants.ts       # Prompt + UI constants
```

### How the render pipeline works

1. **Upload** — the plan is validated (type/size) and converted to a data URL.
2. **Image generation** — `lib/ai.action.ts` calls Puter's image API with a strict architectural prompt (`ARQIVE_RENDER_PROMPT`): geometry must match the plan, top-down orthographic only, all text removed, furniture only where icons exist.
3. **Persistence** — the render is saved back to the project and optionally hosted for sharing.
4. **Share/export** — hosted links can be copied to clipboard; local PNG export.

## 🗺️ Roadmap / known limitations

- [ ] **Cross-user gallery** — currently gallery entries live per-account (Puter KV is user-scoped). Swap in a server worker as the shared index (the data model is already backend-shaped).
- [ ] Project dashboard with delete/rename
- [ ] Result quality rider (style presets, lighting presets)
- [ ] Unit + E2E test suites and CI

## 🤝 Contributing

PRs are welcome. For substantial changes, open an issue first to discuss what you'd like to change. Please typecheck (`npm run typecheck`) before submitting.

## 📄 License

[MIT](LICENSE)

---

<p align="center">
  Powered by <a href="https://puter.com">Puter</a> · AI API bills are paid by the user, not the app 🫶
</p>
