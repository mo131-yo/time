"use client";

import { useEffect, useMemo, useState } from "react";
import {
  estimateLifeExpectancy,
  LifeProfile,
} from "@/lib/lifeExpectancy";
import { clearProfile, loadProfile, saveProfile } from "@/lib/storage";
import { useGsapReveal } from "@/components/useGsapReveal";
import Hero from "@/components/Hero";
import ProfileForm from "@/components/ProfileForm";
import ResultReveal from "@/components/ResultReveal";
import PercentUsed from "@/components/PercentUsed";
import YearConversion from "@/components/YearConversion";
import LiveCountdown from "@/components/LiveCountdown";
import Disclaimer from "@/components/Disclaimer";
import YearEndCountdown from "@/components/YearEndCountdown";
import Marquee from "@/components/Marquee";
import StatBand from "@/components/StatBand";

export default function Home() {
  const [profile, setProfile] = useState<LifeProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setProfile(loadProfile());
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const estimate = useMemo(
    () => (profile ? estimateLifeExpectancy(profile) : null),
    [profile],
  );

  const containerRef = useGsapReveal<HTMLDivElement>([hydrated, !!profile]);

  function handleSubmit(p: LifeProfile) {
    saveProfile(p);
    setProfile(p);
    requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  function handleReset() {
    clearProfile();
    setProfile(null);
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToForm()));
  }

  function scrollToForm() {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  }

  if (!hydrated) {
    return <div className="min-h-screen" />;
  }

  return (
    <div ref={containerRef} className="flex-1">
      {!profile || !estimate ? (
        <>
          <Hero onStart={scrollToForm} />
          <YearEndCountdown sectionN={2} sectionTotal={3} />
          <ProfileForm onSubmit={handleSubmit} />
        </>
      ) : (
        <>
          <ResultReveal
            estimate={estimate}
            countryCode={profile.countryCode}
          />
          <StatBand profile={profile} estimate={estimate} />
          <Marquee />
          <PercentUsed profile={profile} estimate={estimate} />
          <YearConversion estimate={estimate} />
          <YearEndCountdown sectionN={4} sectionTotal={6} />
          <LiveCountdown estimate={estimate} />
          <Disclaimer onReset={handleReset} />
        </>
      )}
    </div>
  );
}
