// app/components/scroll-reset.tsx
"use client";

import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}
