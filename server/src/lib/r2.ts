import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env";

let _r2: S3Client | null = null;

export function getR2(): S3Client {
  if (!_r2) {
    _r2 = new S3Client({
      region: "auto",
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return _r2;
}

export function getR2Bucket(): string {
  return env.R2_BUCKET_NAME;
}

export function getR2PublicUrl(): string {
  return env.R2_PUBLIC_URL;
}
