import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  createSupabaseServerClient,
  ensureStorageBucketReady,
  getStorageBucket
} from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
]);
const FOLDER_MAP = {
  menu: "menu",
  banner: "banner",
  category: "category",
  testimonial: "testimonial"
} as const;

export async function POST(request: Request) {
  await requireAdmin();
  const formData = await request.formData();
  const file = formData.get("file");
  const rawType = formData.get("type");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Format file belum didukung. Silakan pilih gambar JPG, PNG, atau WEBP." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Ukuran file terlalu besar. Maksimal 5 MB." },
      { status: 400 }
    );
  }

  const uploadType =
    typeof rawType === "string" && rawType in FOLDER_MAP
      ? (rawType as keyof typeof FOLDER_MAP)
      : "menu";

  const buffer = Buffer.from(await file.arrayBuffer());
  const folder = FOLDER_MAP[uploadType];
  const extension = resolveExtension(file);
  const baseName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
  const uniqueName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}.${extension}`;
  const objectPath = `${folder}/${uniqueName}`;
  const bucketState = await ensureStorageBucketReady();

  if (!bucketState.ready) {
    console.error("Supabase storage bucket unavailable", bucketState);
    return NextResponse.json(
      { error: "Storage belum siap, hubungi admin." },
      { status: 503 }
    );
  }

  const supabase = createSupabaseServerClient();
  const bucket = getStorageBucket();

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    console.error("Supabase upload error", {
      bucket,
      objectPath,
      message: error.message
    });

    if (error.message.toLowerCase().includes("bucket not found")) {
      return NextResponse.json(
        { error: "Storage belum siap, hubungi admin." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Upload gagal, silakan coba lagi." },
      { status: 400 }
    );
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);

  return NextResponse.json({
    url: data.publicUrl
  });
}

function resolveExtension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function sanitizeFileName(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "image";
}
