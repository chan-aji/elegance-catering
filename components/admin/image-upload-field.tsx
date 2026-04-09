"use client";

import { DragEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, FileImage, LoaderCircle, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  uploadType?: "menu" | "banner" | "category" | "testimonial";
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ImageUploadField({
  value,
  onChange,
  compact = false,
  uploadType = "menu"
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [statusText, setStatusText] = useState(
    value ? "Gambar siap digunakan" : "Belum ada file dipilih"
  );
  const [failedPreviewSrc, setFailedPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  function validateFile(file: File) {
    if (!ALLOWED_TYPES.has(file.type)) {
      toast.error("Format file belum didukung. Pilih JPG, PNG, atau WEBP.");
      setStatusText("Format file belum didukung");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran file terlalu besar. Maksimal 5 MB.");
      setStatusText("Ukuran file terlalu besar");
      return false;
    }

    return true;
  }

  async function handleUpload(file: File) {
    if (!validateFile(file)) return;

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    const nextPreview = URL.createObjectURL(file);
    setLocalPreview(nextPreview);
    setFileName(file.name);
    setFailedPreviewSrc(null);
    setStatusText("Mengupload gambar...");
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", uploadType);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      setIsUploading(false);

      if (!response.ok) {
        setStatusText(result.error ?? "Upload gagal");
        toast.error(result.error ?? "Upload gagal, silakan coba lagi.");
        if (value) {
          URL.revokeObjectURL(nextPreview);
          setLocalPreview(null);
        }
        return;
      }

      onChange(result.url);
      setStatusText("Upload selesai");
      setFileName(file.name);
      toast.success("Gambar berhasil diupload.");
    } catch {
      setIsUploading(false);
      setStatusText("Upload gagal, silakan coba lagi");
      toast.error("Upload gagal, silakan coba lagi.");
      if (value) {
        URL.revokeObjectURL(nextPreview);
        setLocalPreview(null);
      }
    }
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }

  const rawPreviewSrc = !value && !isUploading ? "" : localPreview || value;
  const previewSrc = failedPreviewSrc === rawPreviewSrc ? "" : rawPreviewSrc;
  const statusIcon = isUploading ? (
    <LoaderCircle className="h-3.5 w-3.5 animate-spin text-brand-700" />
  ) : statusText === "Upload selesai" ? (
    <CheckCircle2 className="h-3.5 w-3.5 text-brand-700" />
  ) : (
    <FileImage className="h-3.5 w-3.5 text-ink/45" />
  );

  const helperText =
    uploadType === "banner"
      ? "Rekomendasi banner landscape dengan kualitas tajam agar tampil optimal di website."
      : "Rekomendasi 800x800 px, gunakan crop 1:1 agar preview frontend tetap rapi.";

  const previewHeightClass =
    uploadType === "banner"
      ? compact
        ? "h-40 sm:h-44"
        : "h-56 sm:h-60"
      : compact
        ? "h-44 sm:h-48"
        : "aspect-square";

  const previewModeClass =
    uploadType === "banner" ? "aspect-auto" : compact ? "aspect-auto" : "aspect-square";

  const cardRadiusClass = compact ? "rounded-[22px]" : "rounded-[24px]";

  const dropLabel =
    uploadType === "banner" ? "Drop banner di sini" : "Drop gambar di sini";

  const buttonLabel = isUploading ? "Uploading..." : "Pilih Gambar";
  const displayFileName =
    !value && !isUploading ? "Belum ada nama file" : fileName || (value ? extractFileName(value) : "Belum ada nama file");
  const displayStatusText =
    !value && !isUploading ? "Belum ada file dipilih" : statusText;

  const previewElement = previewSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={previewSrc}
      src={previewSrc}
      alt="Preview upload"
      className="h-full w-full object-cover"
      onError={() => setFailedPreviewSrc(previewSrc)}
    />
  ) : (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-1 text-sm text-ink/45",
        compact && "text-[0.82rem]"
      )}
    >
      <span>{uploadType === "banner" ? "Preview banner" : "Preview 800x800"}</span>
      <span className="text-[0.72rem] text-ink/35">{dropLabel}</span>
    </div>
  );

  const onOpenPicker = () => inputRef.current?.click();

  const onDragEnter = () => setIsDragActive(true);
  const onDragLeave = () => setIsDragActive(false);
  const onDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <button
        type="button"
        onClick={onOpenPicker}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        className={cn(
          "group block w-full overflow-hidden border border-dashed border-brand-700/20 bg-brand-50 text-left transition-all duration-300",
          previewModeClass,
          previewHeightClass,
          cardRadiusClass,
          isDragActive && "border-brand-500 bg-brand-50 shadow-[0_16px_34px_rgba(25,56,28,0.1)]"
        )}
      >
        <div className="relative h-full w-full overflow-hidden">
          {previewElement}
          {!previewSrc ? null : (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/18 via-black/5 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          )}
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <span className="rounded-full bg-white/88 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-700 shadow-sm backdrop-blur">
              {uploadType}
            </span>
            {isDragActive ? (
              <span className="rounded-full bg-brand-700 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white shadow-sm">
                Drop file
              </span>
            ) : null}
          </div>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            handleUpload(file);
          }
          event.currentTarget.value = "";
        }}
      />
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenPicker}
          disabled={isUploading}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-brand-700/10 bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-70",
            compact && "rounded-2xl px-3.5 py-2 text-[0.82rem]"
          )}
        >
          <UploadCloud className="h-4 w-4 text-brand-700" />
          {buttonLabel}
        </button>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[0.72rem] font-medium text-ink/62 shadow-sm">
          {statusIcon}
          {displayStatusText}
        </div>
      </div>
      <div className="space-y-1">
        <p className={cn("truncate text-xs font-medium text-ink/55", compact && "text-[0.74rem]")}>
          {displayFileName}
        </p>
        <p className={cn("text-xs leading-5 text-ink/45", compact && "text-[0.74rem] leading-4")}>
          {helperText}
        </p>
        <p className={cn("text-[0.72rem] leading-4 text-ink/35", compact && "text-[0.7rem]")}>
          Format: JPG, PNG, WEBP. Maksimal 5 MB.
        </p>
      </div>
    </div>
  );
}

function extractFileName(input: string) {
  try {
    const parsed = new URL(input);
    const segments = parsed.pathname.split("/");
    return segments.at(-1) ?? "Gambar tersimpan";
  } catch {
    return input.split("/").at(-1) ?? "Gambar tersimpan";
  }
}
