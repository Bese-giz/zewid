export default function BrandMark() {
  return (
    <span className="market-brand" role="img" aria-label="ZEWID Market">
      <svg className="market-brand__sun" viewBox="0 0 48 20" fill="none" aria-hidden="true">
        <path d="M14 18a10 10 0 0 1 20 0Z" fill="currentColor" />
        <path d="M24 1v4M12 4l2 4M4 12l4 2M36 4l-2 4M44 12l-4 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <span className="market-brand__name">ZEWID</span>
      <span className="market-brand__subtitle">MARKET</span>
    </span>
  );
}
