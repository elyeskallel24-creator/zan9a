import { supabase, isLive } from "../supabaseClient";

/* ============================================================
   Sample data — shown in DEMO MODE (before Supabase is set up).
   Once you connect Supabase, real data from the database is used.
   ============================================================ */
const SAMPLE_PRODUCTS = [
  {
    id: "s1", name: "MIDNIGHT CARGO", price: 119, old_price: 159,
    category: "bottoms", sizes: ["S", "M", "L", "XL"], stock: 8,
    image_url: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80",
    description: "Heavyweight cargo with ten pockets and a tapered drop. Built for the 11pm walk home.",
    is_drop: true, featured: true,
  },
  {
    id: "s2", name: "ASPHALT HOODIE", price: 89, old_price: null,
    category: "tops", sizes: ["S", "M", "L", "XL"], stock: 14,
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    description: "Boxy 480gsm hoodie, raw drawcords, screen-printed back. Oversized on purpose.",
    is_drop: true, featured: true,
  },
  {
    id: "s3", name: "SODIUM TEE", price: 39, old_price: null,
    category: "tops", sizes: ["S", "M", "L", "XL"], stock: 22,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    description: "Streetlight-amber graphic tee. 100% combed cotton, washed soft.",
    is_drop: false, featured: true,
  },
  {
    id: "s4", name: "KERB JACKET", price: 149, old_price: 199,
    category: "outerwear", sizes: ["M", "L", "XL"], stock: 5,
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    description: "Water-resistant shell with reflective taping. The whole block sees you coming.",
    is_drop: true, featured: true,
  },
  {
    id: "s5", name: "BLOCK BEANIE", price: 29, old_price: null,
    category: "accessories", sizes: ["OS"], stock: 30,
    image_url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80",
    description: "Ribbed cuff beanie with a woven zan9a tab.",
    is_drop: false, featured: false,
  },
  {
    id: "s6", name: "GRID DENIM", price: 99, old_price: null,
    category: "bottoms", sizes: ["S", "M", "L", "XL"], stock: 11,
    image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    description: "Wide-leg rigid denim with contrast stitch. Breaks in like a sidewalk.",
    is_drop: false, featured: true,
  },
];

const DEFAULT_SETTINGS = {
  id: 1,
  announcement_text: "NEW DROP LIVE NOW · FREE DELIVERY OVER 200 DT · TUNIS / SOUSSE / SFAX",
  announcement_active: true,
  hero_title: "THE STREET",
  hero_subtitle:
    "zan9a means the street. Limited streetwear drops that go live and die in one hour. Blink and the block moves on without you.",
  drop_title: "ONE-HOUR DROP",
  drop_ends_at: new Date(Date.now() + 47 * 60 * 1000).toISOString(),
  currency: "DT",
  whatsapp_number: "21600000000",
  instagram: "zan9a.tn",
};

/* ---- demo-mode local storage helpers ---- */
const LS_PRODUCTS = "zan9a_demo_products";
const LS_SETTINGS = "zan9a_demo_settings";

function demoProducts() {
  try {
    const raw = localStorage.getItem(LS_PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
  return SAMPLE_PRODUCTS;
}
function saveDemoProducts(list) {
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(list));
}
function demoSettings() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

/* ============================================================
   PRODUCTS
   ============================================================ */
export async function getProducts() {
  if (!isLive) return demoProducts();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getProduct(id) {
  if (!isLive) return demoProducts().find((p) => String(p.id) === String(id)) || null;
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createProduct(product) {
  if (!isLive) {
    const list = demoProducts();
    const item = { ...product, id: "d" + Date.now(), created_at: new Date().toISOString() };
    saveDemoProducts([item, ...list]);
    return item;
  }
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, patch) {
  if (!isLive) {
    const list = demoProducts().map((p) => (String(p.id) === String(id) ? { ...p, ...patch } : p));
    saveDemoProducts(list);
    return list.find((p) => String(p.id) === String(id));
  }
  const { data, error } = await supabase.from("products").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  if (!isLive) {
    saveDemoProducts(demoProducts().filter((p) => String(p.id) !== String(id)));
    return;
  }
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

/* ============================================================
   SETTINGS  (single row, id = 1)
   ============================================================ */
export async function getSettings() {
  if (!isLive) return demoSettings();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
  if (error) {
    // table empty or missing -> fall back to defaults so the site still renders
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...data };
}

export async function updateSettings(patch) {
  if (!isLive) {
    const next = { ...demoSettings(), ...patch };
    localStorage.setItem(LS_SETTINGS, JSON.stringify(next));
    return next;
  }
  const { data, error } = await supabase
    .from("settings")
    .upsert({ id: 1, ...patch })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/* ============================================================
   IMAGE UPLOAD  (Supabase Storage bucket: "product-images")
   ============================================================ */
export async function uploadImage(file) {
  if (!isLive) {
    // demo: turn the file into a local data URL so previews work offline
    return await new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(file);
    });
  }
  const ext = file.name.split(".").pop();
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

/* ============================================================
   AUTH  (owner login)
   ============================================================ */
export async function signIn(email, password) {
  if (!isLive) {
    // demo gate so you can preview the dashboard before Supabase is set up
    if (password === "demo") {
      localStorage.setItem("zan9a_demo_auth", "1");
      return { demo: true };
    }
    throw new Error('Demo mode: use password "demo" to preview the dashboard.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!isLive) {
    localStorage.removeItem("zan9a_demo_auth");
    return;
  }
  await supabase.auth.signOut();
}

export async function getSession() {
  if (!isLive) return localStorage.getItem("zan9a_demo_auth") ? { demo: true } : null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}
