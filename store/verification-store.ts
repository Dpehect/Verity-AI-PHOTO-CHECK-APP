"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssetAnalysis } from "@/lib/analysis";

type VerificationStore = {
  analysis: AssetAnalysis | null;
  preview: string | null;
  setResult: (analysis: AssetAnalysis, preview?: string | null) => void;
  clear: () => void;
};

export const useVerificationStore = create<VerificationStore>()(
  persist(
    (set) => ({
      analysis: null,
      preview: null,
      setResult: (analysis, preview = null) => set({ analysis, preview }),
      clear: () => set({ analysis: null, preview: null }),
    }),
    {
      name: "verity-verification",
      partialize: ({ analysis }) => ({ analysis, preview: null }),
    },
  ),
);
