import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Link to="/" className="brand" aria-label="zan9a home">
          zan<b>9</b>a <small>/ THE STREET</small>
        </Link>

        <nav className="nav__links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/shop?drop=1">Drops</NavLink>
          <NavLink to="/admin">Owner</NavLink>
        </nav>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/cart" className="cart-btn">
            BAG <span>[{count}]</span>
          </Link>
          <button className="burger" onClick={() => setOpen(true)} aria-label="Open menu">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="drawer-back" onClick={() => setOpen(false)} />
          <div className="drawer" role="dialog" aria-label="Menu">
            <button
              onClick={() => setOpen(false)}
              style={{ alignSelf: "flex-end", background: "none", border: 0, color: "var(--chalk)", fontSize: "1.6rem" }}
              aria-label="Close menu"
            >×</button>
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link to="/shop?drop=1" onClick={() => setOpen(false)}>Drops</Link>
            <Link to="/cart" onClick={() => setOpen(false)}>Bag</Link>
            <Link to="/admin" onClick={() => setOpen(false)}>Owner</Link>
          </div>
        </>
      )}
    </header>
  );
}
