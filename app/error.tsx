"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="route-state route-state--error">
      <AlertTriangle />
      <p>VERITY / RECOVERY</p>
      <h1>The evidence view stopped unexpectedly.</h1>
      <span>
        Your file has not been uploaded. Retry the local interface safely.
      </span>
      <button onClick={reset}>
        <RotateCcw />
        Retry interface
      </button>
    </main>
  );
}
