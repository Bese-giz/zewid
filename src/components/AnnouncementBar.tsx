"use client";

import { useEffect, useState } from "react";

const messages = [
  { text: "እንኳን ወደ ዘውድ ማርኬት በሰላም መጣችሁ! 🇪🇹 🛍️", lang: "am" },
  { text: "Ethiopian essentials for everyday life.", lang: "en" },
  { text: "Rooted in tradition. Made for everyday.", lang: "en" },
  { text: "Food, coffee & home. Personal support on WhatsApp.", lang: "en" },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let interval: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      clearInterval(interval);
      if (!media.matches && !hovered) interval = setInterval(() => setIndex(current => (current + 1) % messages.length), 6000);
    };
    update();
    media.addEventListener("change", update);
    return () => { clearInterval(interval); media.removeEventListener("change", update); };
  }, [hovered]);

  return (
    <div className="market-announcement" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <p key={index} className="market-announcement__message" lang={messages[index].lang} aria-hidden="true">{messages[index].text}</p>
      <span className="sr-only">{messages.map(message => <span key={message.text} lang={message.lang}>{message.text}{" "}</span>)}</span>
    </div>
  );
}
