import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  // stop the page behind from scrolling while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Link to="/" className="brand" onClick={close} aria-label="zan9a home">
          zan<b>9</b>a <small>/ THE STREET</small>
        </Link>

        <nav className="nav__links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/shop?drop=1">Drops</NavLink>
          <NavLink to="/admin">Owner</NavLink>
        </nav>

        <div className="nav__right">
          <Link to="/cart" className="cart-btn" onClick={close}>
            BAG <span>[{count}]</span>
          </Link>
          <button
            className="burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* mobile dropdown — solid, layered above the page */}
      {open && <div className="mobile-menu__back" onClick={close} />}
      <div className={"mobile-menu" + (open ? " open" : "")}>
        <Link to="/" onClick={close}>Home</Link>
        <Link to="/shop" onClick={close}>Shop</Link>
        <Link to="/shop?drop=1" onClick={close}>Drops</Link>
        <Link to="/cart" onClick={close}>Bag [{count}]</Link>
        <Link to="/admin" onClick={close}>Owner</Link>
      </div>
    </header>
  );
}
