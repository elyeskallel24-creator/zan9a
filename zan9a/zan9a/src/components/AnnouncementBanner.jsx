export default function AnnouncementBanner({ text, active }) {
  if (!active || !text) return null;
  // duplicate the text so the scroll loops seamlessly
  return (
    <div className="marquee" role="region" aria-label="Announcement">
      <div className="marquee__track">
        <span>{text}</span><span>{text}</span><span>{text}</span><span>{text}</span>
      </div>
    </div>
  );
}
