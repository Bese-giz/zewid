"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import MarketIcon from "./MarketIcon";

const messages = [
  "Ethiopian essentials. Delivered across Finland.",
  `Nationwide delivery · €${site.deliveryFeeEur.toFixed(2)} per order · ${site.deliveryTime}`,
  "Food, coffee & home. Personal support on WhatsApp.",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let interval: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      clearInterval(interval);
      if (!media.matches && !paused && !hovered && !focused) interval = setInterval(() => setIndex(current => (current + 1) % messages.length), 6000);
    };
    update();
    media.addEventListener("change", update);
    return () => { clearInterval(interval); media.removeEventListener("change", update); };
  }, [paused, hovered, focused]);

  return (
    <div className="market-announcement" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <p key={index} className="market-announcement__message" aria-hidden="true">{messages[index]}</p>
      <span className="sr-only">{messages.join(" ")}</span>
      <button type="button" onClick={() => setPaused(current => !current)} aria-label={paused ? "Play announcements" : "Pause announcements"} aria-pressed={paused} className="market-announcement__toggle">
        <MarketIcon name={paused ? "play" : "pause"} size={13} />
      </button>
    </div>
  );
}
