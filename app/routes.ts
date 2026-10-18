import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("product", "./routes/product.tsx"),
  route("gallery", "./routes/gallery.tsx"),
  route("pricing", "./routes/pricing.tsx"),
  route("community", "./routes/community.tsx"),
  route("enterprise", "./routes/enterprise.tsx"),
  route("visualizer/:id", "./routes/visualizer.$id.tsx"),
] satisfies RouteConfig;
