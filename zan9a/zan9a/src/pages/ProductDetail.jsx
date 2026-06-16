import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProduct } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { settings } = useSettings();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((p) => {
        setProduct(p);
        if (p?.sizes?.length === 1) setSize(p.sizes[0]);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="center-pad"><div className="spinner" />Loading…</div>;
  if (!product)
    return (
      <div className="empty wrap">
        <h3>Gone</h3>
        <p>This piece walked off. <Link to="/shop" style={{ color: "var(--sodium)" }}>Back to shop</Link></p>
      </div>
    );

  const out = Number(product.stock) <= 0;
  const sizes = product.sizes?.length ? product.sizes : ["OS"];

  function handleAdd() {
    if (!size) return;
    add(product, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="wrap pd">
      <div className="pd__media">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="card__media"><div className="noimg">z9</div></div>
        )}
      </div>

      <div>
        <span className="eyebrow">/ {product.category} {product.is_drop ? "· live drop" : ""}</span>
        <h1>{product.name}</h1>
        <div className="price">
          {product.price} {settings?.currency || "DT"}
          {product.old_price ? (
            <small className="muted" style={{ textDecoration: "line-through", marginLeft: 10, fontSize: "1rem" }}>
              {product.old_price}
            </small>
          ) : null}
        </div>

        <p className="pd__desc">{product.description}</p>

        <span className="field-label">Size</span>
        <div className="sizes">
          {sizes.map((sz) => (
            <button
              key={sz}
              className={"size" + (size === sz ? " active" : "")}
              onClick={() => setSize(sz)}
            >
              {sz}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
          <button className="btn btn--solid" disabled={out || !size} onClick={handleAdd}>
            {out ? "Sold out" : added ? "Added ✓" : !size ? "Pick a size" : "Add to bag"}
          </button>
          <button className="btn" onClick={() => { handleAdd(); navigate("/cart"); }} disabled={out || !size}>
            Buy now
          </button>
        </div>

        <p className="note" style={{ marginTop: 18 }}>
          {out ? "Restock not guaranteed — drops don't come back." : `${product.stock} left on the block.`}
        </p>
      </div>
    </div>
  );
}
