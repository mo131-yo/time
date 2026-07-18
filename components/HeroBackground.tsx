/**
 * k3studios-ийн hero дэвсгэрийн иж бүрдэл: босоо grid шугам + гүйх гэрлийн
 * pulse, scan шугам, доош унах particle, амьсгалах glow, булангийн +
 * тэмдгүүд, эргэдэг чимэглэлийн SVG. Бүгд цэвэр CSS анимаци.
 *
 * Particle-ийн утгууд hydration mismatch-ээс сэргийлж урьдчилан тогтмол
 * (render дотор Math.random() ашиглахгүй).
 */

const GRID_LINES = [
  { left: "10%", pulseDelay: "0.5s", pulseDuration: "5s" },
  { left: "30%", pulseDelay: "2s", pulseDuration: "6s" },
  { left: "50%", pulseDelay: "1s", pulseDuration: "4.5s" },
  { left: "70%", pulseDelay: "3s", pulseDuration: "5.5s" },
  { left: "90%", pulseDelay: "1.5s", pulseDuration: "5s" },
];

const PARTICLES = [
  { size: 3, left: "17%", delay: "0s", duration: "9.9s" },
  { size: 2, left: "32%", delay: "0.9s", duration: "12s" },
  { size: 2, left: "36%", delay: "1.8s", duration: "8.9s" },
  { size: 3, left: "69%", delay: "2.7s", duration: "8s" },
  { size: 2, left: "61%", delay: "3.6s", duration: "8.2s" },
  { size: 2, left: "29%", delay: "4.5s", duration: "7.7s" },
  { size: 3, left: "25%", delay: "5.4s", duration: "11.4s" },
  { size: 3, left: "89%", delay: "6.3s", duration: "9.7s" },
  { size: 3, left: "54%", delay: "7.2s", duration: "9.6s" },
  { size: 3, left: "87%", delay: "8.1s", duration: "10s" },
  { size: 2, left: "44%", delay: "5s", duration: "10.5s" },
  { size: 2, left: "78%", delay: "2.2s", duration: "9.2s" },
];

export default function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid шугамууд + гүйх гэрлийн pulse */}
      {GRID_LINES.map((line) => (
        <div key={line.left} className="hero-grid-line" style={{ left: line.left }}>
          <div
            className="grid-pulse"
            style={{
              animationDelay: line.pulseDelay,
              animationDuration: line.pulseDuration,
            }}
          />
        </div>
      ))}

      {/* Scan шугам */}
      <div className="scan-line" />

      {/* Particle цэгүүд */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Амьсгалах glow-ууд */}
      <div className="breathe-glow -left-32 top-1/4 h-96 w-96 bg-ember/15" />
      <div
        className="breathe-glow -right-40 bottom-1/4 h-80 w-80 bg-ember-soft/10"
        style={{ animationDelay: "2.5s" }}
      />

      {/* Булангийн + тэмдгүүд */}
      <span className="font-mono-nums absolute left-6 top-24 text-bone-dim/40">+</span>
      <span className="font-mono-nums absolute right-6 top-24 text-bone-dim/40">+</span>
      <span className="font-mono-nums absolute bottom-24 left-6 text-bone-dim/40">+</span>
      <span className="font-mono-nums absolute bottom-24 right-6 text-bone-dim/40">+</span>

      {/* Эргэдэг чимэглэл — зүүн талд 4 хошуут од */}
      <div className="absolute left-[8%] top-1/3 hidden w-20 text-ember opacity-10 md:block">
        <svg className="rotate-slow" viewBox="0 0 80 80" fill="none">
          <path
            d="M40 0L43 37L80 40L43 43L40 80L37 43L0 40L37 37Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {/* Баруун талд төвлөрсөн цагирагууд */}
      <div className="absolute right-[8%] top-2/3 hidden w-20 text-ember opacity-10 md:block">
        <svg className="rotate-slow-reverse" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1" />
          <circle cx="40" cy="40" r="18" stroke="currentColor" strokeWidth="1" />
          <line x1="40" y1="4" x2="40" y2="76" stroke="currentColor" strokeWidth=".5" />
          <line x1="4" y1="40" x2="76" y2="40" stroke="currentColor" strokeWidth=".5" />
        </svg>
      </div>
    </div>
  );
}
