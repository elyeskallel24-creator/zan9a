import { useEffect, useState } from "react";
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  uploadImage, updateSettings, signOut,
} from "../lib/api";
import { isLive } from "../supabaseClient";
import { useSettings } from "../context/SettingsContext";

const BLANK = {
  name: "", price: "", old_price: "", category: "tops",
  sizes: "S, M, L, XL", stock: 10, description: "",
  image_url: "", is_drop: false, featured: false,
};

function toDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d - off).toISOString().slice(0, 16);
}

export default function AdminDashboard({ onSignOut }) {
  const { settings, refresh } = useSettings();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [sForm, setSForm] = useState(null);

  async function loadProducts() {
    try { setProducts(await getProducts()); } catch (e) { console.error(e); }
  }

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { if (settings) setSForm(settings); }, [settings]);

  function flash(text, ok = true) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(""), 2600);
  }

  /* ---------- product form ---------- */
  function editProduct(p) {
    setEditingId(p.id);
    setForm({
      name: p.name || "", price: p.price ?? "", old_price: p.old_price ?? "",
      category: p.category || "tops",
      sizes: (p.sizes || []).join(", "), stock: p.stock ?? 0,
      description: p.description || "", image_url: p.image_url || "",
      is_drop: !!p.is_drop, featured: !!p.featured,
    });
    setTab("edit");
  }

  function newProduct() {
    setEditingId(null);
    setForm(BLANK);
    setTab("edit");
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image_url: url }));
      flash("Image uploaded.");
    } catch (err) {
      flash(err.message || "Upload failed.", false);
    } finally {
      setBusy(false);
    }
  }

  async function saveProduct(e) {
    e.preventDefault();
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      price: Number(form.price) || 0,
      old_price: form.old_price ? Number(form.old_price) : null,
      category: form.category.trim() || "tops",
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock) || 0,
      description: form.description.trim(),
      image_url: form.image_url || null,
      is_drop: form.is_drop,
      featured: form.featured,
    };
    try {
      if (editingId) await updateProduct(editingId, payload);
      else await createProduct(payload);
      await loadProducts();
      flash(editingId ? "Piece updated." : "Piece dropped.");
      setTab("products");
      setForm(BLANK);
      setEditingId(null);
    } catch (err) {
      flash(err.message || "Save failed.", false);
    } finally {
      setBusy(false);
    }
  }

  async function removeProduct(id) {
    if (!confirm("Delete this piece for good?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
      flash("Deleted.");
    } catch (err) {
      flash(err.message || "Delete failed.", false);
    }
  }

  /* ---------- settings ---------- */
  async function saveSettings(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await updateSettings({
        announcement_text: sForm.announcement_text,
        announcement_active: sForm.announcement_active,
        hero_title: sForm.hero_title,
        hero_subtitle: sForm.hero_subtitle,
        drop_title: sForm.drop_title,
        drop_ends_at: sForm.drop_ends_at,
        currency: sForm.currency,
        whatsapp_number: sForm.whatsapp_number,
        instagram: sForm.instagram,
      });
      await refresh();
      flash("Store updated.");
    } catch (err) {
      flash(err.message || "Save failed.", false);
    } finally {
      setBusy(false);
    }
  }

  function startOneHourDrop() {
    const ends = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    setSForm((s) => ({ ...s, drop_ends_at: ends }));
    flash("Timer set to 1 hour — press Save store to publish.");
  }

  async function handleSignOut() {
    await signOut();
    onSignOut?.();
  }

  if (!sForm) return <div className="center-pad"><div className="spinner" />Loading dashboard…</div>;

  return (
    <div className="wrap admin-shell">
      <aside className="admin-side">
        <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Products</button>
        <button className={tab === "edit" ? "active" : ""} onClick={newProduct}>+ Add piece</button>
        <button className={tab === "store" ? "active" : ""} onClick={() => setTab("store")}>Store & banner</button>
        <button className={tab === "drop" ? "active" : ""} onClick={() => setTab("drop")}>Drop timer</button>
        <button onClick={handleSignOut} style={{ color: "var(--danger)", marginTop: 18 }}>Sign out</button>
      </aside>

      <div className="admin-panel">
        {!isLive && <span className="demo-badge">Demo mode — changes save in this browser only. Connect Supabase to go live.</span>}
        {msg && <p className={"note " + (msg.ok ? "ok" : "err")} style={{ marginBottom: 14 }}>{msg.text}</p>}

        {/* PRODUCTS LIST */}
        {tab === "products" && (
          <>
            <div className="section__head"><h2 style={{ fontSize: "1.8rem" }}>Products</h2>
              <button className="btn btn--solid" onClick={newProduct}>+ Add piece</button>
            </div>
            {products.length ? (
              <div style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr><th></th><th>Name</th><th>Price</th><th>Stock</th><th>Drop</th><th></th></tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.image_url ? <img className="admin-thumb" src={p.image_url} alt="" /> : <div className="admin-thumb" />}</td>
                        <td>{p.name}<div className="note">{p.category}</div></td>
                        <td className="mono">{p.price} {sForm.currency}</td>
                        <td className="mono">{p.stock}</td>
                        <td>{p.is_drop ? "●" : "—"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <button className="link-btn" onClick={() => editProduct(p)}>Edit</button>
                          <button className="link-btn danger" onClick={() => removeProduct(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty"><h3>No products</h3><p>Add your first piece.</p></div>
            )}
          </>
        )}

        {/* PRODUCT FORM */}
        {tab === "edit" && (
          <>
            <div className="section__head"><h2 style={{ fontSize: "1.8rem" }}>{editingId ? "Edit piece" : "Add piece"}</h2></div>
            <form className="form-grid" onSubmit={saveProduct} style={{ maxWidth: 640 }}>
              <div>
                <label className="field-label">Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div><label className="field-label">Price ({sForm.currency})</label>
                  <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                <div><label className="field-label">Old price (optional)</label>
                  <input className="input" type="number" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div><label className="field-label">Category</label>
                  <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="tops / bottoms / outerwear…" /></div>
                <div><label className="field-label">Stock</label>
                  <input className="input" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
              </div>
              <div>
                <label className="field-label">Sizes (comma separated)</label>
                <input className="input" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" />
              </div>
              <div>
                <label className="field-label">Description</label>
                <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Photo</label>
                <input className="input" type="file" accept="image/*" onChange={handleUpload} />
                {form.image_url && <img src={form.image_url} alt="preview" style={{ width: 110, height: 138, objectFit: "cover", borderRadius: 8, marginTop: 10, border: "1px solid var(--line)" }} />}
              </div>
              <div style={{ display: "flex", gap: 22 }}>
                <label className="note" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" checked={form.is_drop} onChange={(e) => setForm({ ...form, is_drop: e.target.checked })} /> Live drop
                </label>
                <label className="note" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Feature on home
                </label>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn--solid" disabled={busy}>{busy ? "Saving…" : editingId ? "Save changes" : "Drop it"}</button>
                <button type="button" className="btn" onClick={() => setTab("products")}>Cancel</button>
              </div>
            </form>
          </>
        )}

        {/* STORE / BANNER */}
        {tab === "store" && (
          <>
            <div className="section__head"><h2 style={{ fontSize: "1.8rem" }}>Store & banner</h2></div>
            <form className="form-grid" onSubmit={saveSettings} style={{ maxWidth: 640 }}>
              <div>
                <label className="field-label">Announcement banner text</label>
                <input className="input" value={sForm.announcement_text || ""} onChange={(e) => setSForm({ ...sForm, announcement_text: e.target.value })} />
              </div>
              <label className="note" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={!!sForm.announcement_active} onChange={(e) => setSForm({ ...sForm, announcement_active: e.target.checked })} /> Show the banner
              </label>
              <div>
                <label className="field-label">Hero title</label>
                <input className="input" value={sForm.hero_title || ""} onChange={(e) => setSForm({ ...sForm, hero_title: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Hero subtitle</label>
                <textarea className="textarea" value={sForm.hero_subtitle || ""} onChange={(e) => setSForm({ ...sForm, hero_subtitle: e.target.value })} />
              </div>
              <div className="form-row">
                <div><label className="field-label">Currency</label>
                  <input className="input" value={sForm.currency || ""} onChange={(e) => setSForm({ ...sForm, currency: e.target.value })} /></div>
                <div><label className="field-label">Instagram handle</label>
                  <input className="input" value={sForm.instagram || ""} onChange={(e) => setSForm({ ...sForm, instagram: e.target.value })} /></div>
              </div>
              <div>
                <label className="field-label">WhatsApp number (for orders, with country code, no +)</label>
                <input className="input" value={sForm.whatsapp_number || ""} onChange={(e) => setSForm({ ...sForm, whatsapp_number: e.target.value })} placeholder="21600000000" />
              </div>
              <button className="btn btn--solid" disabled={busy}>{busy ? "Saving…" : "Save store"}</button>
            </form>
          </>
        )}

        {/* DROP TIMER */}
        {tab === "drop" && (
          <>
            <div className="section__head"><h2 style={{ fontSize: "1.8rem" }}>Drop timer</h2></div>
            <form className="form-grid" onSubmit={saveSettings} style={{ maxWidth: 540 }}>
              <div>
                <label className="field-label">Drop title</label>
                <input className="input" value={sForm.drop_title || ""} onChange={(e) => setSForm({ ...sForm, drop_title: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Drop ends at</label>
                <input className="input" type="datetime-local"
                  value={toDatetimeLocal(sForm.drop_ends_at)}
                  onChange={(e) => setSForm({ ...sForm, drop_ends_at: new Date(e.target.value).toISOString() })} />
              </div>
              <button type="button" className="btn" onClick={startOneHourDrop}>⚡ Start a 1-hour drop now</button>
              <button className="btn btn--solid" disabled={busy}>{busy ? "Saving…" : "Save store"}</button>
              <p className="note">Mark the products you want in this drop with the “Live drop” checkbox in their edit page.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
