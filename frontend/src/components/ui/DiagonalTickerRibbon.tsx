const TAGS = [
  "100% Eggless Options",
  "HandCrafted",
  "DesiMawaCakes",
  "SourdoughPav",
  "CulturedButter",
  "RasmalaiGateau",
  "BelgianTruffle",
  "KhapliWheat",
  "PaneerPuff",
  "DailyFreshBakes",
  "PureDesiGhee",
  "IraniBakeryCraft"
];

export function DiagonalTickerRibbon() {
  return (
    <div className="relative w-full overflow-hidden py-10 my-6 bg-transparent select-none">
      {/* Rotated Banner Strip */}
      <div className="relative -mx-4 -rotate-1 sm:-rotate-2 bg-[#1F3A18] text-cream py-4 sm:py-5 shadow-lg border-y border-[#264A1E]">
        <div className="flex overflow-hidden whitespace-nowrap">
          {/* Duplicated row for seamless infinite marquee loop */}
          <div className="animate-marquee flex items-center gap-8 text-sm sm:text-base font-poppins font-medium tracking-widest uppercase">
            {TAGS.concat(TAGS).map((tag, idx) => (
              <span key={idx} className="flex items-center gap-8">
                <span>{tag}</span>
                <span className="text-[#F1E4A6]/40 text-xs">✦</span>
              </span>
            ))}
          </div>
          <div className="animate-marquee flex items-center gap-8 text-sm sm:text-base font-poppins font-medium tracking-widest uppercase" aria-hidden="true">
            {TAGS.concat(TAGS).map((tag, idx) => (
              <span key={`dup-${idx}`} className="flex items-center gap-8">
                <span>{tag}</span>
                <span className="text-[#F1E4A6]/40 text-xs">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
