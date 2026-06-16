import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../lib/api";
import { useSettings } from "../context/SettingsContext";
import ProductCard from "../components/ProductCard";
import DropCountdown from "../components/DropCountdown";

export default function Home() {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const s = settings || {};
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const list = featured.length ? featured : products.slice(0, 8);
  const drops = products.filter((p) => p.is_drop).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <div>
            <span className="eyebrow">/ zan9a · streetwear off the block</span>
            <h1>
              <span className="fill">{(s.hero_title || "THE STREET").split(" ")[0]}</span>{" "}
              <span className="stroke">{(s.hero_title || "THE STREET").split(" ").slice(1).join(" ") || "WEARS YOU"}</span>
            </h1>
            <p className="hero__sub">{s.hero_subtitle}</p>
            <div className="hero__cta">
              <Link to="/shop" className="btn btn--solid">Shop the drop</Link>
              <Link to="/shop?drop=1" className="btn">See what's live</Link>
            </div>
          </div>

          {s.drop_ends_at && (
            <DropCountdown endsAt={s.drop_ends_at} title={s.drop_title || "ONE-HOUR DROP"} />
          )}
        </div>
      </section>

      {drops.length > 0 && (
        <section className="section wrap">
          <div className="section__head">
            <h2>Live now</h2>
            <Link to="/shop?drop=1">All drops →</Link>
          </div>
          <div className="grid">
            {drops.map((p) => (
              <ProductCard key={p.id} product={p} currency={s.currency} />
            ))}
          </div>
        </section>
      )}

      <section className="section wrap">
        <div className="section__head">
          <h2>On the rack</h2>
          <Link to="/shop">Shop all →</Link>
        </div>

        {loading ? (
          <div className="center-pad"><div className="spinner" />Loading the block…</div>
        ) : list.length ? (
          <div className="grid">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} currency={s.currency} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>Nothing on the rack yet</h3>
            <p>The owner hasn't added pieces. Log in as owner to drop your first item.</p>
          </div>
        )}
      </section>
    </>
  );
}
