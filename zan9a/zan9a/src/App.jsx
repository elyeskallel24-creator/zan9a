import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnnouncementBanner from "./components/AnnouncementBanner";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import { CartProvider } from "./context/CartContext";
import { getSession } from "./lib/api";

function AdminRoute() {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  if (session === undefined) return <div className="center-pad"><div className="spinner" />…</div>;
  return session ? (
    <AdminDashboard onSignOut={() => setSession(null)} />
  ) : (
    <AdminLogin onAuthed={() => getSession().then(setSession)} />
  );
}

function Shell() {
  const { settings } = useSettings();
  return (
    <>
      <AnnouncementBanner text={settings?.announcement_text} active={settings?.announcement_active} />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
      </main>
      <Footer settings={settings} />
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </SettingsProvider>
  );
}
