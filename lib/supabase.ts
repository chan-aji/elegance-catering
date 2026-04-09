import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new Error("SUPABASE_URL belum diatur.");
  }

  return url;
}

function getSupabaseKey() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error("SUPABASE key belum diatur.");
  }

  return key;
}

export function createSupabaseServerClient() {
  return createClient(getSupabaseUrl(), getSupabaseKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "menu-images";
}

export function hasSupabaseServiceRole() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function ensureStorageBucketReady() {
  const bucket = getStorageBucket();
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.storage.getBucket(bucket);

  if (!error && data) {
    return { ready: true as const, bucket };
  }

  const message = error?.message?.toLowerCase() ?? "";
  const missingBucket =
    message.includes("bucket not found") || message.includes("not found");

  if (missingBucket && hasSupabaseServiceRole()) {
    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"]
    });

    if (!createError) {
      return { ready: true as const, bucket };
    }

    return {
      ready: false as const,
      bucket,
      reason: createError.message
    };
  }

  return {
    ready: false as const,
    bucket,
    reason: error?.message ?? "Bucket belum tersedia"
  };
}
