"use client";

import { useId } from "react";
import MarketIcon from "./MarketIcon";

export default function MarketSearch() {
  const id = useId();
  return (
    <form action="/products" method="get" role="search" className="market-search">
      <label htmlFor={id} className="sr-only">Search food, coffee and home essentials</label>
      <input id={id} name="q" type="search" placeholder="Search food, coffee & home essentials" maxLength={120} required />
      <button type="submit" aria-label="Search products"><MarketIcon name="search" size={23} /></button>
    </form>
  );
}
