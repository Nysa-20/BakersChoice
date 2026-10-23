interface ChevronListProps {
  items: string[];
  className?: string;
}

export function ChevronList({ items, className = '' }: ChevronListProps) {
  return (
    <ul className={`space-y-3 font-poppins text-sm sm:text-base text-[#333333] ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="flex items-center gap-3">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1F3A18]/10 text-[#1F3A18] font-bold text-sm shrink-0 select-none">
            ‹
          </span>
          <span className="leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  );
}

