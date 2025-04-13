// components/client-section-wrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const AnimatedSection = dynamic(() => import("@/components/animated-section"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
    </div>
  ),
});

export default function ClientSectionWrapper({
  section,
  index,
}: {
  section: any;
  index: number;
}) {
  useEffect(() => {
    if (index === 0) {
      console.log("SCROLLING TO TOP");
      window.scrollTo(0, 0);
    }
  }, [index]);

  return <AnimatedSection section={section} index={index} />;
}
