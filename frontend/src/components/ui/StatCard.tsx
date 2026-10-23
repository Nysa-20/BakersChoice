interface StatCardProps {
  number: string;
  label: string;
  className?: string;
}

export function StatCard({ number, label, className = '' }: StatCardProps) {
  return (
    <div 
      className={`bg-[#1F3A18] text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-white/10 flex flex-col items-center justify-center text-center min-w-[130px] sm:min-w-[160px] ${className}`}
    >
      <span className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-cream">
        {number}
      </span>
      <span className="font-poppins text-[11px] sm:text-xs font-medium uppercase tracking-wider text-white/80 mt-1">
        {label}
      </span>
    </div>
  );
}

