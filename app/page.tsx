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

export default function Home() {
  const [profile, setProfile] = useState<LifeProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // localStorage-оос профайл ачаална (зөвхөн client дээр)
  useEffect(() => {
    setProfile(loadProfile());
    setHydrated(true);
  }, []);

  // deathDate profile-оос гарна; тооцоолол нь Date.now()-оос хамааралгүй хэсэг
  const estimate = useMemo(
    () => (profile ? estimateLifeExpectancy(profile) : null),
    [profile],
  );

  // GSAP reveal — профайлын төлөв солигдох бүрт дахин холбоно
  const containerRef = useGsapReveal<HTMLDivElement>([hydrated, !!profile]);

  function handleSubmit(p: LifeProfile) {
    saveProfile(p);
    setProfile(p);
    // Үр дүн рүү зөөлөн гүйлгэнэ
    requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  function handleReset() {
    clearProfile();
    setProfile(null);
    requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  function scrollToForm() {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  }

  // Hydration mismatch-аас сэргийлж, ачаалахаас өмнө хоосон каркас
  if (!hydrated) {
    return <div className="min-h-screen" />;
  }

  return (
    <div ref={containerRef} className="flex-1">
      {!profile || !estimate ? (
        <>
          <Hero onStart={scrollToForm} />
          <ProfileForm onSubmit={handleSubmit} />
        </>
      ) : (
        <>
          <ResultReveal
            estimate={estimate}
            countryCode={profile.countryCode}
          />
          <PercentUsed profile={profile} estimate={estimate} />
          <YearConversion estimate={estimate} />
          <LiveCountdown estimate={estimate} />
          <Disclaimer onReset={handleReset} />
        </>
      )}
    </div>
  );
}
