const menuFallbacks = [
  "/images/menu-green-bowl.svg",
  "/images/menu-office-set.svg",
  "/images/menu-salmon-box.svg",
  "/images/menu-snack-box.svg"
];

export function getMenuImage(src?: string | null, seed?: number | string) {
  if (src?.trim()) return src;
  return menuFallbacks[resolveSeed(seed) % menuFallbacks.length];
}

export function getCategoryImage(src?: string | null, type?: string | null, seed?: number | string) {
  if (src?.trim()) return src;
  if (type?.toLowerCase().includes("event")) return "/images/category-event.svg";
  return resolveSeed(seed) % 2 === 0 ? "/images/category-harian.svg" : "/images/category-event.svg";
}

export function getBannerImage(src?: string | null) {
  if (src?.trim()) return src;
  return "/images/banner-organic.svg";
}

export function getHeroImage(src?: string | null) {
  if (src?.trim()) return src;
  return "/images/hero-catering.svg";
}

export function getSecondaryHeroImage(seed?: string) {
  const key = seed?.toLowerCase() ?? "";
  if (key.includes("menu")) return "/images/menu-green-bowl.svg";
  if (key.includes("paket")) return "/images/category-event.svg";
  if (key.includes("tentang")) return "/images/banner-organic.svg";
  if (key.includes("kontak")) return "/images/category-harian.svg";
  return "/images/banner-organic.svg";
}

function resolveSeed(seed?: number | string) {
  if (typeof seed === "number") return Math.abs(seed);
  if (typeof seed === "string") {
    return seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  }
  return 0;
}
