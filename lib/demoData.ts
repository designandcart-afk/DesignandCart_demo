// Demo-mode data. Safe to extend without a backend.

export type DemoProduct = {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  // --- NEW optional fields for product listing/detail ---
  category?: string; // For filtering (e.g., Living Room, Lighting, etc.)
  description?: string; // For details page text
};

export type DemoRender = {
  id: string;
  imageUrl: string;
  status?: "pending" | "approved" | "changes";
  // NEW: link to project + area for filtering on details page
  projectId?: string;
  area?: string;
};

export type DemoUpload = {
  id: string;
  name: string;
  size: number;
  mime: string;
  url: string; // in demo: blob: URL; in prod: Drive/Supabase URL
};

export type DemoProject = {
  id: string;
  name: string;
  scope: string;
  address?: string;
  notes?: string;
  area?: string;
  status?: string;
  uploads?: DemoUpload[];
  createdAt: number; // auto-captured
};

// NEW: relation table for products linked to a project & area
export type DemoProjectProduct = {
  id: string;
  projectId: string;
  productId: string;
  area: string;
};

// -------------------- Seed Data --------------------

export const demoProducts: DemoProduct[] = [
  {
    id: "prod_1",
    title: "Linen Sofa 3-Seater",
    imageUrl:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
    price: 39999,
    category: "Living Room",
    description:
      "Comfortable 3-seater linen fabric sofa with wooden legs and timeless design, perfect for modern living rooms.",
  },
  {
    id: "prod_2",
    title: "Pendant Light Brass",
    imageUrl:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200&auto=format&fit=crop",
    price: 6999,
    category: "Lighting",
    description:
      "Elegant brass pendant light with matte finish, ideal for dining or lounge spaces.",
  },
  {
    id: "prod_3",
    title: "Walnut Coffee Table",
    imageUrl:
      "https://images.unsplash.com/photo-1615870216515-4f6a87c87fec?q=80&w=1200&auto=format&fit=crop",
    price: 12999,
    category: "Furniture",
    description:
      "Premium walnut veneer coffee table with minimal steel legs — sturdy, aesthetic, and functional.",
  },
];

export const demoProjects: DemoProject[] = [
  {
    id: "demo_1",
    name: "2BHK - Koramangala",
    scope: "2BHK",
    address: "12, 5th Cross, Koramangala, Bengaluru",
    area: "Living Room",
    status: "wip",
    uploads: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
  },
  {
    id: "demo_2",
    name: "Villa - Whitefield",
    scope: "Commercial",
    address: "Plot 27, Palm Meadows, Whitefield, Bengaluru",
    area: "Dining",
    status: "renders_shared",
    uploads: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
  },
];

export const demoRenders: DemoRender[] = [
  {
    id: "ren_1",
    imageUrl:
      "https://images.unsplash.com/photo-1514517220035-0001f84778f5?q=80&w=1600&auto=format&fit=crop",
    status: "changes",
    projectId: "demo_1",
    area: "Living Room",
  },
  {
    id: "ren_2",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
    status: "approved",
    projectId: "demo_2",
    area: "Dining",
  },
];

// NEW: products linked to project+area
export const demoProjectProducts: DemoProjectProduct[] = [
  { id: "pp_1", projectId: "demo_1", productId: "prod_1", area: "Living Room" },
  { id: "pp_2", projectId: "demo_1", productId: "prod_3", area: "Living Room" },
  { id: "pp_3", projectId: "demo_2", productId: "prod_2", area: "Dining" },
];
// -------------------- Demo Cart & Orders (for presentation) --------------------

export type DemoCartLine = {
  id: string;
  productId: string;
  qty: number;
  projectId?: string;
  area?: string;
};

export const demoCart: DemoCartLine[] = [
  {
    id: "line_1",
    productId: "prod_1", // Linen Sofa
    qty: 1,
    projectId: "demo_1", // 2BHK - Koramangala
    area: "Living Room",
  },
  {
    id: "line_2",
    productId: "prod_2", // Pendant Light
    qty: 2,
    projectId: "demo_2", // Villa - Whitefield
    area: "Dining",
  },
  {
    id: "line_3",
    productId: "prod_3", // Coffee Table
    qty: 1,
    projectId: "demo_1", // 2BHK - Koramangala
    area: "Living Room",
  },
];

// Demo order type (simple)
export type DemoOrder = {
  id: string;
  items: DemoCartLine[];
  total: number;
  status: string;
  ts: number;
};

export const demoOrders: DemoOrder[] = [
  {
    id: "ord_1",
    items: [
      {
        id: "line_1",
        productId: "prod_1",
        qty: 1,
        projectId: "demo_1",
        area: "Living Room",
      },
      {
        id: "line_3",
        productId: "prod_3",
        qty: 1,
        projectId: "demo_1",
        area: "Living Room",
      },
    ],
    total: 52998,
    status: "Delivered",
    ts: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
  },
  {
    id: "ord_2",
    items: [
      {
        id: "line_2",
        productId: "prod_2",
        qty: 2,
        projectId: "demo_2",
        area: "Dining",
      },
    ],
    total: 13998,
    status: "Placed",
    ts: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
  },
];


// /* EXTRA DEMO PRODUCTS */
export const extraDemoProducts: DemoProduct[] = [
  { id: "prod_101", title: "Walnut Lounge Chair", imageUrl: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&auto=format&fit=crop", price: 18990, category: "Furniture", description: "Ergonomic lounge chair in walnut finish with brass legs.", },
  { id: "prod_102", title: "Brass Pendant Light", imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop", price: 4990, category: "Lighting", description: "Warm brass dome pendant, perfect for dining tables.", },
  { id: "prod_103", title: "Oak Study Desk", imageUrl: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&auto=format&fit=crop", price: 12990, category: "Furniture", description: "Minimal oak desk with cable grommet and soft radius corners.", },
  { id: "prod_104", title: "Neutral Area Rug", imageUrl: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&auto=format&fit=crop", price: 5990, category: "Décor", description: "Hand-tufted wool rug in beige/ivory palette.", },
];
export const demoProductsAll: DemoProduct[] = [...demoProducts, ...extraDemoProducts];
