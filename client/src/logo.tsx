export function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 500 500"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f7ff" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#logoGradient)" strokeWidth="8">
        <path d="M100,250 L160,150 L220,250 L160,350 Z" />
        <path d="M250,150 L350,150 L350,350 L250,350 L250,150 Z" />
        <path d="M400,150 L400,350" />
        <circle cx="400" cy="125" r="25" />
      </g>
    </svg>
  );
}
