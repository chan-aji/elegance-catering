export type SiteSettings = {
  id: string;
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

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  type: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MenuItem = {
  id: string;
  categoryId: string | null;
  categoryName: string | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
  featured: boolean;
  badge: string | null;
  calories: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  image: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  note: string;
};

export type CustomerOrder = {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  whatsapp: string;
  email: string | null;
  address: string | null;
  deliveryDate: string;
  deliveryTime: string;
  note: string | null;
  deliveryMethod: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    orderId: string;
    menuItemId: string | null;
    menuName: string;
    price: number;
    quantity: number;
    note: string | null;
    subtotal: number;
    image: string | null;
    createdAt: string;
  }>;
};
