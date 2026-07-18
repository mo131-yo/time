import Badge from "./Badge";
import SplitChars from "./SplitChars";

/**
 * k3studios-ийн секцийн 2 мөрт аварга гарчиг: эхний мөр цул, хоёр дахь мөр
 * stroke-only (.text-outline). `.reveal-chars` контейнерийг useGsapReveal
 * scroll дээр үсэг-үсгээр амилуулна.
 */
export default function SectionHeading({
  line1,
  line2,
  badge,
  className = "",
}: {
  line1: string;
  line2: string;
  badge?: string;
  className?: string;
}) {
  return (
    <div className={`reveal-chars ${className}`}>
      {badge && <Badge className="mb-6">{badge}</Badge>}
      <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-bone sm:text-6xl md:text-7xl">
        <span className="block">
          <SplitChars text={line1} />
        </span>
        <span className="text-outline block">
          <SplitChars text={line2} />
        </span>
      </h2>
    </div>
  );
}
