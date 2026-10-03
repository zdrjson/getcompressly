import { useCallback, useId, useRef, useState } from 'react';

// Hero specimen: one image, split down the middle — original on the left,
// compressed on the right. They are the same picture, which is the point:
// you are invited to find the seam and can't. Figures are illustrative.
export default function Specimen() {
  const [pos, setPos] = useState(52);
  const [dragging, setDragging] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  const moveTo = useCallback((clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <figure className="relative">
      <div className="rounded-[28px] border border-ink-600/70 bg-ink-800/60 p-2 shadow-[0_40px_120px_-40px_rgb(143_209_63/0.25)]">
        <div
          ref={frame}
          className={`relative aspect-[5/6] lg:aspect-[6/7] touch-none select-none overflow-hidden rounded-[22px] ${dragging ? 'cursor-grabbing' : 'cursor-ew-resize'}`}
          onPointerDown={(e) => { setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); moveTo(e.clientX); }}
          onPointerMove={(e) => dragging && moveTo(e.clientX)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          <Dunes />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
            <Dunes />
          </div>

          {/* Labels */}
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink-950/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-100 backdrop-blur-md">
            Original · PNG
          </span>
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-950">
            AVIF · q62
          </span>

          {/* Divider */}
          <div className="pointer-events-none absolute inset-y-0 w-px bg-bone-100/90" style={{ left: `${pos}%` }}>
            <div
              className={`absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-bone-100/70 bg-ink-950/50 text-bone-100 backdrop-blur-md transition-transform duration-300 ${dragging ? 'scale-90' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
              </svg>
            </div>
          </div>

          <input
            type="range"
            min={4}
            max={96}
            value={Math.round(pos)}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Move the comparison divider"
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            onPointerDown={(e) => e.preventDefault()}
          />
        </div>

        <figcaption className="grid grid-cols-3 gap-px px-2 pb-2 pt-4 font-mono">
          <Stat label="Before" value="4.82" unit="MB" />
          <Stat label="After" value="1.07" unit="MB" />
          <Stat label="Saved" value="−77.8" unit="%" accent />
        </figcaption>
      </div>
      <p className="mt-4 text-center text-xs text-bone-500">
        Drag the line. <span className="font-serif text-[15px] italic text-bone-300">Can you find the seam?</span>
        <span className="ml-2 text-bone-600">Illustrative figures.</span>
      </p>
    </figure>
  );
}

function Stat({ label, value, unit, accent = false }: { label: string; value: string; unit: string; accent?: boolean }) {
  return (
    <div className="px-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-bone-600">{label}</div>
      <div className={`tabular mt-1 text-xl tracking-tight sm:text-2xl ${accent ? 'text-accent-500' : 'text-bone-100'}`}>
        {value}
        <span className="ml-1 text-xs text-bone-500">{unit}</span>
      </div>
    </div>
  );
}

// A small, hand-built landscape so the hero needs no image download.
function Dunes() {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1a1c" />
          <stop offset="0.38" stopColor="#3b3f3a" />
          <stop offset="0.62" stopColor="#c78a55" />
          <stop offset="0.78" stopColor="#efc38a" />
        </linearGradient>
        <radialGradient id={`sun${id}`} cx="0.62" cy="0.5" r="0.45">
          <stop offset="0" stopColor="#fff2d6" stopOpacity="1" />
          <stop offset="0.12" stopColor="#ffd9a0" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#f0a868" stopOpacity="0.25" />
          <stop offset="1" stopColor="#f0a868" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`d1${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8643a" />
          <stop offset="1" stopColor="#5c3020" />
        </linearGradient>
        <linearGradient id={`d2${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a4128" />
          <stop offset="1" stopColor="#2a1610" />
        </linearGradient>
        <linearGradient id={`d3${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2117" />
          <stop offset="1" stopColor="#0e0806" />
        </linearGradient>
        <filter id={`g${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect width="500" height="600" fill={`url(#sky${id})`} />
      <rect width="500" height="600" fill={`url(#sun${id})`} />
      <circle cx="310" cy="300" r="34" fill="#fff4dc" />
      <path d="M0 360 C 90 330, 160 300, 250 322 S 420 372, 500 340 L 500 600 L 0 600 Z" fill={`url(#d1${id})`} opacity="0.92" />
      <path d="M0 420 C 120 380, 210 400, 290 430 S 430 470, 500 420 L 500 600 L 0 600 Z" fill={`url(#d2${id})`} />
      <path d="M-20 520 C 80 470, 180 470, 270 500 S 420 560, 520 500 L 520 600 L -20 600 Z" fill={`url(#d3${id})`} />
      <path d="M0 360 C 90 330, 160 300, 250 322" stroke="#ffd9a0" strokeOpacity="0.55" strokeWidth="1.2" fill="none" />
      <path d="M290 430 S 430 470, 500 420" stroke="#e8a46d" strokeOpacity="0.35" strokeWidth="1" fill="none" />
      <rect width="500" height="600" filter={`url(#g${id})`} opacity="0.9" />
    </svg>
  );
}
