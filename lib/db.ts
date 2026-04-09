import bcrypt from "bcryptjs";
import { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  buildWhatsappMessage,
  createOrderCode,
  slugify,
  toWhatsappNumber
} from "@/lib/utils";

type SettingRecord = {
  id: string;
  site_name: string;
  logo_text: string;
  whatsapp: string;
  primary_color: string;
  secondary_color: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  address: string;
  email: string;
};

type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  type: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type MenuItemRecord = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
  featured: boolean;
  badge: string | null;
  calories: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type BannerRecord = {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_href: string;
  image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type TestimonialRecord = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type CustomerRecord = {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

type OrderRecord = {
  id: string;
  code: string;
  customer_id: string;
  customer_name: string;
  whatsapp: string;
  email: string | null;
  address: string | null;
  delivery_date: string;
  delivery_time: string;
  note: string | null;
  delivery_method: string;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
};

type OrderItemRecord = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  menu_name: string;
  price: number;
  quantity: number;
  note: string | null;
  subtotal: number;
  image: string | null;
  created_at: string;
};

type AdminRecord = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
};

type MenuInput = {
  categoryId?: string | null;
  name: string;
  description: string;
  price: number;
  image: string;
  active?: boolean;
  featured?: boolean;
  badge?: string | null;
  calories?: number | null;
  sortOrder?: number;
};

type CategoryInput = {
  name: string;
  description?: string | null;
  image?: string | null;
  type?: string | null;
  sortOrder?: number;
  active?: boolean;
};

type BannerInput = {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  image: string;
  active?: boolean;
};

type TestimonialInput = {
  name: string;
  role: string;
  content: string;
  rating?: number;
  avatar?: string | null;
  active?: boolean;
};

type SettingsInput = {
  siteName: string;
  logoText: string;
  whatsapp: string;
  primaryColor: string;
  secondaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  address: string;
  email: string;
};

type CreateOrderInput = {
  customerName: string;
  whatsapp: string;
  email?: string | null;
  address?: string | null;
  deliveryDate: string;
  deliveryTime: string;
  note?: string | null;
  deliveryMethod: "DELIVERY" | "PICKUP";
  items: Array<{
    menuItemId: string;
    quantity: number;
    note?: string | null;
  }>;
};

function nowIso() {
  return new Date().toISOString();
}

function uuid() {
  return crypto.randomUUID();
}

class DataLayerError extends Error {
  status: number;
  userMessage: string;
  code?: string;

  constructor(message: string, userMessage: string, status = 400, code?: string) {
    super(message);
    this.name = "DataLayerError";
    this.status = status;
    this.userMessage = userMessage;
    this.code = code;
  }
}

function isMissingRelation(error: PostgrestError | null) {
  return Boolean(
    error?.message?.includes("relation") ||
      error?.message?.includes("schema cache") ||
      error?.code === "42P01" ||
      error?.code === "PGRST205"
  );
}

function createPostgrestError(
  label: string,
  error: PostgrestError,
  options?: {
    missingRelationMessage?: string;
    invalidInputMessage?: string;
  }
) {
  if (isMissingRelation(error)) {
    return new DataLayerError(
      `${label}: ${error.message}`,
      options?.missingRelationMessage ??
        "Database belum siap. Jalankan schema Supabase untuk tabel yang dibutuhkan.",
      503,
      error.code ?? "SCHEMA_NOT_READY"
    );
  }

  if (error.code === "22P02" || error.code === "23502" || error.code === "23514") {
    return new DataLayerError(
      `${label}: ${error.message}`,
      options?.invalidInputMessage ?? "Data yang dikirim belum valid. Periksa lagi isi form.",
      400,
      error.code
    );
  }

  return new DataLayerError(
    `${label}: ${error.message}`,
    "Gagal menyimpan ke database. Silakan coba lagi.",
    500,
    error.code
  );
}

async function unwrap<T>(
  promise: PromiseLike<{ data: T; error: PostgrestError | null }>,
  label: string,
  options?: {
    missingRelationMessage?: string;
    invalidInputMessage?: string;
  }
) {
  const { data, error } = await promise;
  if (error) {
    throw createPostgrestError(label, error, options);
  }

  return data;
}

async function safeReadMany<T>(
  promise: PromiseLike<{ data: T[] | null; error: PostgrestError | null }>,
  label: string
) {
  const { data, error } = await promise;
  if (error && isMissingRelation(error)) {
    return [] as T[];
  }
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }

  return data ?? [];
}

function normalizeRequiredText(value: string | null | undefined, fieldLabel: string) {
  const normalized = value?.trim() ?? "";
  if (!normalized) {
    throw new DataLayerError(
      `Field ${fieldLabel} wajib diisi.`,
      `${fieldLabel} wajib diisi.`,
      400,
      "VALIDATION_ERROR"
    );
  }

  return normalized;
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalized = value?.trim() ?? "";
  return normalized ? normalized : null;
}

function normalizeBoolean(value: boolean | null | undefined, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeOptionalInteger(
  value: number | string | null | undefined,
  fieldLabel: string
) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new DataLayerError(
      `Field ${fieldLabel} tidak valid.`,
      `${fieldLabel} tidak valid.`,
      400,
      "VALIDATION_ERROR"
    );
  }

  return Math.round(parsed);
}

function normalizeInteger(
  value: number | string | null | undefined,
  fieldLabel: string,
  fallback = 0
) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new DataLayerError(
      `Field ${fieldLabel} tidak valid.`,
      `${fieldLabel} tidak valid.`,
      400,
      "VALIDATION_ERROR"
    );
  }

  return Math.round(parsed);
}

function normalizePrice(value: number | string | null | undefined) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new DataLayerError(
      "Field harga tidak valid.",
      "Harga belum valid. Masukkan angka lebih dari 0.",
      400,
      "VALIDATION_ERROR"
    );
  }

  return Math.round(parsed);
}

function normalizeUuid(value: string | null | undefined, fieldLabel: string) {
  const normalized = normalizeOptionalText(value);
  if (!normalized) {
    return null;
  }

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      normalized
    );

  if (!isUuid) {
    throw new DataLayerError(
      `Field ${fieldLabel} bukan UUID yang valid.`,
      `${fieldLabel} belum valid.`,
      400,
      "VALIDATION_ERROR"
    );
  }

  return normalized;
}

function sanitizeMenuInput(input: MenuInput) {
  const name = normalizeRequiredText(input.name, "Nama menu");
  const description = normalizeRequiredText(input.description, "Deskripsi");
  const image = normalizeRequiredText(input.image, "Gambar menu");

  return {
    categoryId: normalizeUuid(input.categoryId, "Kategori"),
    name,
    description,
    price: normalizePrice(input.price),
    image,
    active: normalizeBoolean(input.active, true),
    featured: normalizeBoolean(input.featured, true),
    badge: normalizeOptionalText(input.badge),
    calories: normalizeOptionalInteger(input.calories, "Kalori"),
    sortOrder: normalizeInteger(input.sortOrder, "Urutan", 0)
  };
}

function mapSetting(row: SettingRecord | null) {
  if (!row) return null;
  return {
    id: row.id,
    siteName: row.site_name,
    logoText: row.logo_text,
    whatsapp: row.whatsapp,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    aboutText: row.about_text,
    address: row.address,
    email: row.email
  };
}

function mapCategory(row: CategoryRecord) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    type: row.type,
    sortOrder: row.sort_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapMenuItem(row: MenuItemRecord, categoryName: string | null) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    image: row.image,
    active: row.active,
    featured: row.featured,
    badge: row.badge,
    calories: row.calories,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapBanner(row: BannerRecord) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    buttonText: row.button_text,
    buttonHref: row.button_href,
    image: row.image,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapTestimonial(row: TestimonialRecord) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    content: row.content,
    rating: row.rating,
    avatar: row.avatar,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCustomer(row: CustomerRecord, ordersCount: number, totalSpent: number) {
  return {
    id: row.id,
    name: row.name,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ordersCount,
    totalSpent
  };
}

function mapOrderItem(row: OrderItemRecord) {
  return {
    id: row.id,
    orderId: row.order_id,
    menuItemId: row.menu_item_id,
    menuName: row.menu_name,
    price: row.price,
    quantity: row.quantity,
    note: row.note,
    subtotal: row.subtotal,
    image: row.image,
    createdAt: row.created_at
  };
}

function mapOrder(row: OrderRecord, items: ReturnType<typeof mapOrderItem>[]) {
  return {
    id: row.id,
    code: row.code,
    customerId: row.customer_id,
    customerName: row.customer_name,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    deliveryDate: row.delivery_date,
    deliveryTime: row.delivery_time,
    note: row.note,
    deliveryMethod: row.delivery_method,
    status: row.status,
    total: row.total,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items
  };
}

async function fetchCategories(includeInactive = true) {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;
  if (error && isMissingRelation(error)) return [];
  if (error) throw new Error(`Gagal mengambil kategori: ${error.message}`);
  return (data as CategoryRecord[]).map(mapCategory);
}

async function fetchMenuItems(includeInactive = true) {
  const [categories, rawItems] = await Promise.all([
    fetchCategories(true),
    safeReadMany<MenuItemRecord>(
      createSupabaseServerClient()
        .from("menu")
        .select("*")
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      "Gagal mengambil menu"
    )
  ]);

  const categoryMap = new Map(categories.map((item) => [item.id, item.name]));
  const items = (rawItems as MenuItemRecord[]).map((row) =>
    mapMenuItem(row, row.category_id ? categoryMap.get(row.category_id) ?? null : null)
  );

  return includeInactive ? items : items.filter((item) => item.active);
}

async function fetchOrderItems() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .order("created_at", { ascending: true });
  if (error && isMissingRelation(error)) return [];
  if (error) throw new Error(`Gagal mengambil item pesanan: ${error.message}`);
  return (data as OrderItemRecord[]).map(mapOrderItem);
}

export async function getSiteContent() {
  const [settings, categories, menuItems, testimonials, banners] = await Promise.all([
    getSettings(),
    fetchCategories(false),
    fetchMenuItems(false),
    getTestimonials(),
    getAllBanners()
  ]);

  return {
    settings,
    categories,
    menuItems,
    testimonials,
    banner: banners.find((item) => item.active) ?? null
  };
}

export async function getDashboardSummary() {
  const [orders, customers, menuItems] = await Promise.all([
    getAllOrders(),
    getAllCustomers(),
    getAllMenuItems()
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingCount = orders.filter((order) =>
    ["PENDING", "PROCESSING"].includes(order.status)
  ).length;

  const monthlyMap = new Map<string, { label: string; total: number; orders: number }>();
  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    const label = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date);
    const existing = monthlyMap.get(key) ?? { label, total: 0, orders: 0 };
    existing.total += order.total;
    existing.orders += 1;
    monthlyMap.set(key, existing);
  });

  return {
    stats: {
      totalOrders: orders.length,
      totalRevenue,
      customers: customers.length,
      menuCount: menuItems.length,
      pendingCount
    },
    latestOrders: orders.slice(0, 6),
    chartData: Array.from(monthlyMap.values())
  };
}

export async function getReports() {
  const orders = await getAllOrders();
  const dailyMap = new Map<string, { label: string; total: number; orders: number }>();
  const monthlyMap = new Map<string, { label: string; total: number; orders: number }>();

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const dayKey = date.toISOString().slice(0, 10);
    const monthKey = date.toISOString().slice(0, 7);
    const dayLabel = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short"
    }).format(date);
    const monthLabel = new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric"
    }).format(date);

    const day = dailyMap.get(dayKey) ?? { label: dayLabel, total: 0, orders: 0 };
    day.total += order.total;
    day.orders += 1;
    dailyMap.set(dayKey, day);

    const month = monthlyMap.get(monthKey) ?? { label: monthLabel, total: 0, orders: 0 };
    month.total += order.total;
    month.orders += 1;
    monthlyMap.set(monthKey, month);
  });

  return {
    daily: Array.from(dailyMap.values()).slice(-7),
    monthly: Array.from(monthlyMap.values()).slice(-6)
  };
}

export async function getAllMenuItems() {
  return fetchMenuItems(true);
}

export async function getAllCategories() {
  return fetchCategories(true);
}

export async function getTestimonials() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error && isMissingRelation(error)) return [];
  if (error) throw new Error(`Gagal mengambil testimoni: ${error.message}`);
  return (data as TestimonialRecord[]).map(mapTestimonial);
}

export async function getAllBanners() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("banner")
    .select("*")
    .order("created_at", { ascending: false });
  if (error && isMissingRelation(error)) return [];
  if (error) throw new Error(`Gagal mengambil banner: ${error.message}`);
  return (data as BannerRecord[]).map(mapBanner);
}

export async function getSettings() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();
  if (error && isMissingRelation(error)) return null;
  if (error) throw new Error(`Gagal mengambil settings: ${error.message}`);
  return mapSetting(data as SettingRecord | null);
}

export async function getAllCustomers() {
  const [customers, orders] = await Promise.all([
    safeReadMany<CustomerRecord>(
      createSupabaseServerClient()
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false }),
      "Gagal mengambil pelanggan"
    ),
    getAllOrders()
  ]);

  return customers.map((customer) => {
    const customerOrders = orders.filter((order) => order.customerId === customer.id);
    return mapCustomer(
      customer,
      customerOrders.length,
      customerOrders.reduce((sum, order) => sum + order.total, 0)
    );
  });
}

export async function getAllOrders() {
  const [orders, items] = await Promise.all([
    safeReadMany<OrderRecord>(
      createSupabaseServerClient()
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),
      "Gagal mengambil pesanan"
    ),
    fetchOrderItems()
  ]);

  const itemMap = new Map<string, ReturnType<typeof mapOrderItem>[]>();
  items.forEach((item) => {
    const current = itemMap.get(item.orderId) ?? [];
    current.push(item);
    itemMap.set(item.orderId, current);
  });

  return orders.map((row) => mapOrder(row, itemMap.get(row.id) ?? []));
}

export async function getOrderById(orderId: string) {
  const orders = await getAllOrders();
  return orders.find((order) => order.id === orderId) ?? null;
}

export async function authenticateAdmin(email: string, password: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error && !isMissingRelation(error)) {
    throw new Error(`Gagal mengambil admin: ${error.message}`);
  }

  const admin = data as AdminRecord | null;

  if (!admin) {
    if (
      email === (process.env.ADMIN_EMAIL || "admin@catring.local") &&
      password === (process.env.ADMIN_PASSWORD || "admin12345")
    ) {
      return {
        id: "env-admin",
        email,
        name: "Admin Catring"
      };
    }

    return null;
  }

  if (!bcrypt.compareSync(password, admin.password_hash)) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name
  };
}

async function getMenuItemById(id: string) {
  const items = await getAllMenuItems();
  return items.find((item) => item.id === id) ?? null;
}

async function getCategoryById(id: string) {
  const categories = await getAllCategories();
  return categories.find((item) => item.id === id) ?? null;
}

export async function createMenuItem(input: MenuInput) {
  const sanitized = sanitizeMenuInput(input);
  const record = {
    id: uuid(),
    category_id: sanitized.categoryId,
    name: sanitized.name,
    slug: slugify(sanitized.name),
    description: sanitized.description,
    price: sanitized.price,
    image: sanitized.image,
    active: sanitized.active,
    featured: sanitized.featured,
    badge: sanitized.badge,
    calories: sanitized.calories,
    sort_order: sanitized.sortOrder,
    created_at: nowIso(),
    updated_at: nowIso()
  };

  await unwrap(
    createSupabaseServerClient().from("menu").insert(record),
    "Gagal menambah menu",
    {
      missingRelationMessage:
        "Database menu belum siap di Supabase. Jalankan schema setup untuk tabel menu.",
      invalidInputMessage:
        "Data menu belum valid. Periksa nama, harga, kategori, dan gambar sebelum menyimpan."
    }
  );
  return getMenuItemById(record.id);
}

export async function updateMenuItem(id: string, input: MenuInput) {
  const sanitized = sanitizeMenuInput(input);
  await unwrap(
    createSupabaseServerClient()
      .from("menu")
      .update({
        category_id: sanitized.categoryId,
        name: sanitized.name,
        slug: slugify(sanitized.name),
        description: sanitized.description,
        price: sanitized.price,
        image: sanitized.image,
        active: sanitized.active,
        featured: sanitized.featured,
        badge: sanitized.badge,
        calories: sanitized.calories,
        sort_order: sanitized.sortOrder,
        updated_at: nowIso()
      })
      .eq("id", id),
    "Gagal update menu",
    {
      missingRelationMessage:
        "Database menu belum siap di Supabase. Jalankan schema setup untuk tabel menu.",
      invalidInputMessage:
        "Data menu belum valid. Periksa nama, harga, kategori, dan gambar sebelum menyimpan."
    }
  );
  return getMenuItemById(id);
}

export async function deleteMenuItem(id: string) {
  await unwrap(
    createSupabaseServerClient().from("menu").delete().eq("id", id),
    "Gagal hapus menu"
  );
}

export async function createCategory(input: CategoryInput) {
  const record = {
    id: uuid(),
    name: input.name,
    slug: slugify(input.name),
    description: input.description ?? null,
    image: input.image ?? null,
    type: input.type ?? null,
    sort_order: input.sortOrder ?? 0,
    active: input.active ?? true,
    created_at: nowIso(),
    updated_at: nowIso()
  };

  await unwrap(createSupabaseServerClient().from("categories").insert(record), "Gagal menambah kategori");
  return getCategoryById(record.id);
}

export async function updateCategory(id: string, input: CategoryInput) {
  await unwrap(
    createSupabaseServerClient()
      .from("categories")
      .update({
        name: input.name,
        slug: slugify(input.name),
        description: input.description ?? null,
        image: input.image ?? null,
        type: input.type ?? null,
        sort_order: input.sortOrder ?? 0,
        active: input.active ?? true,
        updated_at: nowIso()
      })
      .eq("id", id),
    "Gagal update kategori"
  );
  return getCategoryById(id);
}

export async function deleteCategory(id: string) {
  const supabase = createSupabaseServerClient();
  await unwrap(
    supabase.from("menu").update({ category_id: null }).eq("category_id", id),
    "Gagal melepas kategori dari menu"
  );
  await unwrap(supabase.from("categories").delete().eq("id", id), "Gagal hapus kategori");
}

export async function createBanner(input: BannerInput) {
  const record = {
    id: uuid(),
    title: input.title,
    subtitle: input.subtitle,
    button_text: input.buttonText,
    button_href: input.buttonHref,
    image: input.image,
    active: input.active ?? true,
    created_at: nowIso(),
    updated_at: nowIso()
  };
  await unwrap(
    createSupabaseServerClient().from("banner").insert(record),
    "Gagal menambah banner"
  );
  return (await getAllBanners()).find((item) => item.id === record.id) ?? null;
}

export async function updateBanner(id: string, input: BannerInput) {
  await unwrap(
    createSupabaseServerClient()
      .from("banner")
      .update({
        title: input.title,
        subtitle: input.subtitle,
        button_text: input.buttonText,
        button_href: input.buttonHref,
        image: input.image,
        active: input.active ?? true,
        updated_at: nowIso()
      })
      .eq("id", id),
    "Gagal update banner"
  );
  return (await getAllBanners()).find((item) => item.id === id) ?? null;
}

export async function deleteBanner(id: string) {
  await unwrap(
    createSupabaseServerClient().from("banner").delete().eq("id", id),
    "Gagal hapus banner"
  );
}

export async function createTestimonial(input: TestimonialInput) {
  const record = {
    id: uuid(),
    name: input.name,
    role: input.role,
    content: input.content,
    rating: input.rating ?? 5,
    avatar: input.avatar ?? null,
    active: input.active ?? true,
    created_at: nowIso(),
    updated_at: nowIso()
  };
  await unwrap(
    createSupabaseServerClient().from("testimonials").insert(record),
    "Gagal menambah testimoni"
  );
  return (await getTestimonials()).find((item) => item.id === record.id) ?? null;
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  await unwrap(
    createSupabaseServerClient()
      .from("testimonials")
      .update({
        name: input.name,
        role: input.role,
        content: input.content,
        rating: input.rating ?? 5,
        avatar: input.avatar ?? null,
        active: input.active ?? true,
        updated_at: nowIso()
      })
      .eq("id", id),
    "Gagal update testimoni"
  );
  return (await getTestimonials()).find((item) => item.id === id) ?? null;
}

export async function deleteTestimonial(id: string) {
  await unwrap(
    createSupabaseServerClient().from("testimonials").delete().eq("id", id),
    "Gagal hapus testimoni"
  );
}

export async function updateSettings(input: SettingsInput) {
  await unwrap(
    createSupabaseServerClient().from("settings").upsert({
      id: "main",
      site_name: input.siteName,
      logo_text: input.logoText,
      whatsapp: toWhatsappNumber(input.whatsapp),
      primary_color: input.primaryColor,
      secondary_color: input.secondaryColor,
      hero_title: input.heroTitle,
      hero_subtitle: input.heroSubtitle,
      about_text: input.aboutText,
      address: input.address,
      email: input.email,
      updated_at: nowIso()
    }),
    "Gagal update settings"
  );
  return getSettings();
}

export async function updateOrderStatus(id: string, status: string) {
  await unwrap(
    createSupabaseServerClient().from("orders").update({ status, updated_at: nowIso() }).eq("id", id),
    "Gagal update status order"
  );
  return getOrderById(id);
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = createSupabaseServerClient();
  const normalizedWhatsapp = toWhatsappNumber(input.whatsapp);
  const menuIds = input.items.map((item) => item.menuItemId);

  const { data: rawCustomer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("whatsapp", normalizedWhatsapp)
    .maybeSingle();
  if (customerError && !isMissingRelation(customerError)) {
    throw new Error(`Gagal mengambil customer: ${customerError.message}`);
  }

  const existingCustomer = rawCustomer as CustomerRecord | null;
  const customerId = existingCustomer?.id ?? uuid();
  const customerPayload = {
    id: customerId,
    name: input.customerName,
    whatsapp: normalizedWhatsapp,
    email: input.email ?? null,
    address: input.address ?? null,
    updated_at: nowIso(),
    ...(existingCustomer ? {} : { created_at: nowIso() })
  };

  if (existingCustomer) {
    await unwrap(
      supabase.from("customers").update(customerPayload).eq("id", customerId),
      "Gagal update customer"
    );
  } else {
    await unwrap(supabase.from("customers").insert(customerPayload), "Gagal membuat customer");
  }

  const menuRows = await unwrap(
    supabase.from("menu").select("*").in("id", menuIds),
    "Gagal mengambil menu order"
  );
  const menuMap = new Map((menuRows as MenuItemRecord[]).map((item) => [item.id, item]));

  const validItems = input.items
    .map((item) => {
      const menu = menuMap.get(item.menuItemId);
      if (!menu) return null;
      const quantity = Math.max(1, item.quantity);
      return {
        id: uuid(),
        order_id: "",
        menu_item_id: menu.id,
        menu_name: menu.name,
        price: menu.price,
        quantity,
        note: item.note ?? null,
        subtotal: menu.price * quantity,
        image: menu.image,
        created_at: nowIso()
      };
    })
    .filter(Boolean) as Array<{
      id: string;
      order_id: string;
      menu_item_id: string;
      menu_name: string;
      price: number;
      quantity: number;
      note: string | null;
      subtotal: number;
      image: string;
      created_at: string;
    }>;

  if (validItems.length === 0) {
    throw new Error("Keranjang kosong atau item tidak valid.");
  }

  const total = validItems.reduce((sum, item) => sum + item.subtotal, 0);
  const orderId = uuid();
  const code = createOrderCode();

  await unwrap(
    supabase.from("orders").insert({
      id: orderId,
      code,
      customer_id: customerId,
      customer_name: input.customerName,
      whatsapp: normalizedWhatsapp,
      email: input.email ?? null,
      address: input.address ?? null,
      delivery_date: input.deliveryDate,
      delivery_time: input.deliveryTime,
      note: input.note ?? null,
      delivery_method: input.deliveryMethod,
      status: "PENDING",
      total,
      created_at: nowIso(),
      updated_at: nowIso()
    }),
    "Gagal membuat order"
  );

  await unwrap(
    supabase.from("order_items").insert(
      validItems.map((item) => ({ ...item, order_id: orderId }))
    ),
    "Gagal membuat item order"
  );

  const settings = await getSettings();
  const whatsappMessage = buildWhatsappMessage({
    code,
    customerName: input.customerName,
    whatsapp: normalizedWhatsapp,
    email: input.email ?? null,
    address: input.address ?? null,
    deliveryDate: input.deliveryDate,
    deliveryTime: input.deliveryTime,
    deliveryMethod: input.deliveryMethod === "DELIVERY" ? "Antar" : "Pickup",
    note: input.note ?? null,
    total,
    items: validItems.map((item) => ({
      name: item.menu_name,
      qty: item.quantity,
      note: item.note,
      subtotal: item.subtotal
    }))
  });

  return {
    order: await getOrderById(orderId),
    whatsappUrl: `https://wa.me/${settings?.whatsapp ?? normalizedWhatsapp}?text=${whatsappMessage}`
  };
}
