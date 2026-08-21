const GRID_LINES = [
  { left: "10%", pulseDelay: "0.5s", pulseDuration: "5s" },
  { left: "30%", pulseDelay: "2s", pulseDuration: "6s" },
  { left: "50%", pulseDelay: "1s", pulseDuration: "4.5s" },
  { left: "70%", pulseDelay: "3s", pulseDuration: "5.5s" },
  { left: "90%", pulseDelay: "1.5s", pulseDuration: "5s" },
];

export default function GlobalBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
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

      <div className="breathe-glow -left-32 top-1/4 h-96 w-96 bg-ember/10" />
      <div
        className="breathe-glow -right-40 bottom-1/4 h-80 w-80 bg-ember-soft/5"
        style={{ animationDelay: "2.5s" }}
      />
    </div>
  );
}
