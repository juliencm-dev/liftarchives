import { Hono } from "hono";
import { authMiddleware, type SessionUser } from "@/middleware/auth";
import { extractProgramFromImage, type LiftCatalogEntry } from "@liftarchives/agent";
import { db, getAllAvailableLifts } from "@liftarchives/database";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
]);
const MAX_BYTES = 10 * 1024 * 1024;

type Env = {
  Variables: {
    user: SessionUser;
  };
};

const agentRoutes = new Hono<Env>()
  .use("*", authMiddleware)
  .post("/extract", async (c) => {
    const contentType = c.req.header("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return c.json({ message: "Only multipart/form-data accepted" }, 415);
    }

    const form = await c.req.formData();

    // Reject any field that isn't "image" — no text input reaches the model
    for (const key of form.keys()) {
      if (key !== "image") {
        return c.json({ message: `Unexpected field: ${key}` }, 400);
      }
    }

    const file = form.get("image");
    if (!(file instanceof File)) {
      return c.json({ message: "Missing image field" }, 400);
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return c.json({ message: "Unsupported image type" }, 415);
    }
    if (file.size > MAX_BYTES) {
      return c.json({ message: "Image too large (max 10 MB)" }, 413);
    }

    const user = c.get("user");
    const allLifts = await getAllAvailableLifts(db, user.id);

    const lifts: LiftCatalogEntry[] = allLifts.map((l) => ({
      id: l.id,
      name: l.name,
      category: l.category,
      description: l.description,
    }));

    try {
      const draft = await extractProgramFromImage(file, lifts);
      return c.json({ success: true, data: draft });
    } catch (err) {
      console.error("[Agent] Route-level extraction failed", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      return c.json(
        { success: false, message: "Extraction failed. Please try a clearer image." },
        502,
      );
    }
  });

export { agentRoutes };
