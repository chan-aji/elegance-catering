"use client";

import { MessageCircleMore } from "lucide-react";

export function WhatsappFloat({ whatsapp }: { whatsapp?: string | null }) {
  if (!whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp admin"
      className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#25d366_0%,#20ba59_100%)] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(20,114,50,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(20,114,50,0.3)] active:scale-[0.98]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/14">
        <MessageCircleMore className="h-4 w-4" />
      </span>
      WhatsApp
    </a>
  );
}
