interface ScallopedDividerProps {
  color?: string;
  inverted?: boolean;
  className?: string;
}

export function ScallopedDivider({ color = '#F1E4A6', inverted = false, className = '' }: ScallopedDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className} ${inverted ? 'rotate-180' : ''}`}>
      <svg
        className="w-full h-4 sm:h-6 block"
        viewBox="0 0 1200 30"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 
             C50,20 100,20 150,0 
             C200,20 250,20 300,0 
             C350,20 400,20 450,0 
             C500,20 550,20 600,0 
             C650,20 700,20 750,0 
             C800,20 850,20 900,0 
             C950,20 1000,20 1050,0 
             C1100,20 1150,20 1200,0 
             L1200,30 L0,30 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

