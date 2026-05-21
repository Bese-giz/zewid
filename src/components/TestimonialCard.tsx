interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
}

export default function TestimonialCard({
  quote,
  author,
  location,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex gap-1 mb-3 text-yellow-400">
        {"★★★★★".split("").map((star, i) => (
          <span key={i} className="text-lg">{star}</span>
        ))}
      </div>
      <p className="text-gray-600 leading-relaxed mb-5">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">
          {author[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{author}</p>
          <p className="text-xs text-gray-400">{location}</p>
        </div>
      </div>
    </div>
  );
}
