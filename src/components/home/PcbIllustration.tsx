export function PcbIllustration() {
  const pinsH = [0, 1, 2, 3, 4, 5];
  const pinsV = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 400 420" className="h-auto w-full max-w-md" role="img" aria-label="Ilustração técnica de placa de circuito">
      <defs>
        <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#27272a" strokeWidth="0.6" />
        </pattern>
        <radialGradient id="fade"><stop offset="0.4" stopColor="#fff" /><stop offset="1" stopColor="#000" /></radialGradient>
        <mask id="m"><rect width="400" height="420" fill="url(#fade)" /></mask>
      </defs>
      <rect width="400" height="420" fill="url(#g)" mask="url(#m)" opacity="0.6" />
      <g stroke="#52525b" strokeWidth="2" fill="none">
        <circle cx="70" cy="70" r="3" fill="#09090b" />
        <path d="M73 70H120l6-12 10 24 10-24 10 24 6-12h55" />
        <circle cx="230" cy="70" r="3" fill="#52525b" />
      </g>
      <rect x="110" y="120" width="220" height="160" rx="14" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
      {[[126, 136], [314, 136], [126, 264], [314, 264]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="none" stroke="#71717a" strokeWidth="1.5" />
      ))}
      <g stroke="#3f3f46" strokeWidth="1.2" fill="none">
        <path d="M130 170H165M130 190H155l12 12M130 215H190" />
        <path d="M195 130v25M210 130v25" />
        <path d="M290 195v40M235 245v20h40" />
      </g>
      {pinsH.map((i) => (
        <g key={`h${i}`} fill="#52525b">
          <rect x={185 + i * 9} y="148" width="3" height="8" />
          <rect x={185 + i * 9} y="232" width="3" height="8" />
        </g>
      ))}
      {pinsV.map((i) => (
        <g key={`v${i}`} fill="#52525b">
          <rect x="167" y={168 + i * 11} width="8" height="3" />
          <rect x="245" y={168 + i * 11} width="8" height="3" />
        </g>
      ))}
      <rect x="176" y="157" width="68" height="74" rx="6" fill="#09090b" stroke="#3f3f46" />
      <circle cx="185" cy="166" r="2" fill="#52525b" />
      <path d="M253 177H280" stroke="#a16207" strokeWidth="1.2" />
      <rect x="280" y="170" width="24" height="12" rx="2" fill="#f59e0b" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={180 + i * 10} cy="258" r="2" fill="#52525b" />)}
      <circle cx="312" cy="262" r="5" fill="#f59e0b" />
      <g stroke="#52525b" strokeWidth="2" fill="none">
        <circle cx="70" cy="340" r="3" fill="#09090b" />
        <path d="M73 340H143M157 340H230M143 324v32M157 324v32" />
        <circle cx="230" cy="340" r="3" fill="#52525b" />
      </g>
    </svg>
  );
}
