import { Link } from "react-router-dom";

export default function ProductCard({ product, currency = "DT" }) {
  const out = Number(product.stock) <= 0;
  return (
    <Link to={`/product/${product.id}`} className="card">
      <div className="card__media">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="noimg">z9</div>
        )}
        {out ? (
          <span className="tag tag--out">Sold out</span>
        ) : product.is_drop ? (
          <span className="tag">Drop</span>
        ) : null}
      </div>
      <div className="card__body">
        <h4>{product.name}</h4>
        <div className="card__row">
          <span className="price">
            {product.price} {currency}
            {product.old_price ? (
              <small style={{ textDecoration: "line-through", marginLeft: 6 }}>
                {product.old_price}
              </small>
            ) : null}
          </span>
          <span className="note">{product.category}</span>
        </div>
      </div>
    </Link>
  );
}
