import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authMiddleware, type SessionUser } from "@/middleware/auth";
import { getR2, getR2Bucket, getR2PublicUrl } from "@/lib/r2";

const CONTENT_TYPE_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const presignedUrlSchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize: z.number().int().min(1).max(MAX_FILE_SIZE),
});

type Env = {
  Variables: {
    user: SessionUser;
  };
};

const avatarRoutes = new Hono<Env>()
  .use("*", authMiddleware)
  .post("/presigned-url", zValidator("json", presignedUrlSchema), async (c) => {
    const user = c.get("user");
    const { contentType, fileSize } = c.req.valid("json");

    const ext = CONTENT_TYPE_TO_EXT[contentType];
    const key = `avatars/${user.id}/${Date.now()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      ContentType: contentType,
      ContentLength: fileSize,
    });

    const presignedUrl = await getSignedUrl(getR2(), command, { expiresIn: 120 });
    const publicUrl = `${getR2PublicUrl()}/${key}`;

    return c.json({ presignedUrl, publicUrl });
  });

export { avatarRoutes };
