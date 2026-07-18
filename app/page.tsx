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

  // localStorage-оос профайл ачаална (зөвхөн client дээр).
  // setState-ийг microtask-д хойшлуулж effect доторх sync cascade-аас зайлсхийв.
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
    // Профайл цэвэрлэгдэж, форм дахин рендэрлэгдэх хүртэл хүлээгээд шууд форм руу гүйлгэнэ
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToForm()));
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
