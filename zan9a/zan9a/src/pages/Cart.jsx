import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const { settings } = useSettings();
  const cur = settings?.currency || "DT";
  const wa = settings?.whatsapp_number;

  function checkout() {
    const lines = items
      .map((i) => `• ${i.name} (${i.size}) x${i.qty} — ${i.price * i.qty} ${cur}`)
      .join("%0a");
    const msg =
      `Salam zan9a 👋%0a%0aI want to order:%0a${lines}%0a%0aTotal: ${total} ${cur}%0a%0aName:%0aAddress:%0aPhone:`;
    if (wa) {
      window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
    } else {
      alert("Set a WhatsApp number in the owner dashboard to enable ordering.");
    }
  }

  if (!items.length)
    return (
      <div className="empty wrap">
        <h3>Your bag is empty</h3>
        <p>Nothing copped yet.</p>
        <Link to="/shop" className="btn btn--solid" style={{ marginTop: 18 }}>Hit the shop</Link>
      </div>
    );

  return (
    <section className="section wrap">
      <div className="section__head"><h2>Your bag</h2></div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 30, alignItems: "start" }} className="cart-layout">
        <div>
          {items.map((i) => (
            <div className="cart-line" key={i.key}>
              {i.image_url ? <img src={i.image_url} alt={i.name} /> : <div className="noimg-sm" />}
              <div>
                <strong>{i.name}</strong>
                <div className="note">Size {i.size} · {i.price} {cur}</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
                  <div className="qty">
                    <button onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease">−</button>
                    <span>{i.qty}</span>
                    <button onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase">+</button>
                  </div>
                  <button className="link-btn danger" onClick={() => remove(i.key)}>Remove</button>
                </div>
              </div>
              <strong className="mono">{i.price * i.qty} {cur}</strong>
            </div>
          ))}
          <button className="link-btn" style={{ marginTop: 14 }} onClick={clear}>Clear bag</button>
        </div>

        <div className="cart-summary">
          <div className="row"><span>Subtotal</span><span>{total} {cur}</span></div>
          <div className="row"><span>Delivery</span><span>Paid on arrival</span></div>
          <div className="row total"><span>Total</span><b>{total} {cur}</b></div>
          <button className="btn btn--solid btn--block" style={{ marginTop: 16 }} onClick={checkout}>
            Order on WhatsApp
          </button>
          <p className="note" style={{ marginTop: 12, textAlign: "center" }}>
            We confirm your order by DM. Pay cash on delivery.
          </p>
        </div>
      </div>
    </section>
  );
}
