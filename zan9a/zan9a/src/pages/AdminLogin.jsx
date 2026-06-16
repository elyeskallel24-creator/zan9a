import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../lib/api";
import { isLive } from "../supabaseClient";

export default function AdminLogin({ onAuthed }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signIn(email, password);
      onAuthed?.();
      navigate("/admin");
    } catch (e) {
      setErr(e.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-box">
      <span className="eyebrow">/ owner access</span>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", textTransform: "uppercase", margin: "8px 0 18px" }}>
        Run the block
      </h2>

      {!isLive && (
        <p className="demo-badge">Demo mode · password: demo</p>
      )}

      <form className="form-grid" onSubmit={submit}>
        <div>
          <label className="field-label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={isLive ? "owner@zan9a.tn" : "anything@demo.com"} required={isLive} />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required />
        </div>
        {err && <p className="note err">{err}</p>}
        <button className="btn btn--solid btn--block" disabled={busy}>
          {busy ? "Checking…" : "Enter dashboard"}
        </button>
      </form>
    </div>
  );
}
