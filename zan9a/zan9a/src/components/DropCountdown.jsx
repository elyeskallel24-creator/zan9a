import { useEffect, useState } from "react";

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  const h = Math.floor(ms / 3.6e6);
  const m = Math.floor((ms % 3.6e6) / 6e4);
  const s = Math.floor((ms % 6e4) / 1000);
  return { h, m, s, ended: ms === 0 };
}

const pad = (n) => String(n).padStart(2, "0");

export default function DropCountdown({ endsAt, title = "ONE-HOUR DROP" }) {
  const [t, setT] = useState(() => diff(endsAt));

  useEffect(() => {
    const id = setInterval(() => setT(diff(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return (
    <div className="dropcard">
      <span className="dropcard__live">
        <i className="dot" /> {t.ended ? "DROP CLOSED" : "LIVE NOW"}
      </span>
      <h3>{title}</h3>
      <p className="note">{t.ended ? "This drop is gone. The next one lands soon." : "Gone the second the clock hits zero."}</p>
      <div className={"countdown" + (t.ended ? " ended" : "")}>
        <div className="count-unit"><b>{pad(t.h)}</b><small>hrs</small></div>
        <div className="count-unit"><b>{pad(t.m)}</b><small>min</small></div>
        <div className="count-unit"><b>{pad(t.s)}</b><small>sec</small></div>
      </div>
    </div>
  );
}
