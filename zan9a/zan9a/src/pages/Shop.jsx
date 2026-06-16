import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../lib/api";
import { useSettings } from "../context/SettingsContext";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const { settings } = useSettings();
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dropOnly = params.get("drop") === "1";
  const cat = params.get("cat") || "all";

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [products]);

  const shown = products.filter((p) => {
    if (dropOnly && !p.is_drop) return false;
    if (cat !== "all" && p.category !== cat) return false;
    return true;
  });

  function setFilter(next) {
    const p = new URLSearchParams(params);
    if (next.cat) next.cat === "all" ? p.delete("cat") : p.set("cat", next.cat);
    if ("drop" in next) next.drop ? p.set("drop", "1") : p.delete("drop");
    setParams(p);
  }

  return (
    <section className="section wrap">
      <div className="section__head">
        <h2>{dropOnly ? "Live drops" : "Shop"}</h2>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {categories.map((c) => (
          <button
            key={c}
            className="btn"
            style={c === cat ? { borderColor: "var(--sodium)", color: "var(--sodium)" } : null}
            onClick={() => setFilter({ cat: c })}
          >
            {c}
          </button>
        ))}
        <button
          className="btn"
          style={dropOnly ? { borderColor: "var(--sodium)", color: "var(--sodium)" } : null}
          onClick={() => setFilter({ drop: !dropOnly })}
        >
          {dropOnly ? "✕ drops" : "drops only"}
        </button>
      </div>

      {loading ? (
        <div className="center-pad"><div className="spinner" />Loading…</div>
      ) : shown.length ? (
        <div className="grid">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} currency={settings?.currency} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>Empty rack</h3>
          <p>No pieces match this filter.</p>
        </div>
      )}
    </section>
  );
}
