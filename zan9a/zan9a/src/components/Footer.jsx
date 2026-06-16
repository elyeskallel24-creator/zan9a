import { Link } from "react-router-dom";

export default function Footer({ settings }) {
  const ig = settings?.instagram || "zan9a.tn";
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__big">zan9a</div>
          <div className="footer__cols">
            <div>
              <h5>Shop</h5>
              <Link to="/shop">All</Link>
              <Link to="/shop?drop=1">Drops</Link>
              <Link to="/cart">Bag</Link>
            </div>
            <div>
              <h5>Info</h5>
              <p>Delivery: Tunis · Sousse · Sfax</p>
              <p>Order via DM, pay on delivery</p>
              <Link to="/admin">Owner login</Link>
            </div>
            <div>
              <h5>Find us</h5>
              <a href={`https://instagram.com/${ig}`} target="_blank" rel="noreferrer">
                @{ig}
              </a>
            </div>
          </div>
        </div>

        <div className="footer__sig">
          <span className="mono">© {year} zan9a — drops live for one hour.</span>
          <span className="mono made">created by <b>28Solutions</b></span>
        </div>
      </div>
    </footer>
  );
}
