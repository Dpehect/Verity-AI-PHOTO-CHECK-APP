import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="route-state">
      <FileQuestion />
      <p>VERITY / 404</p>
      <h1>No evidence found.</h1>
      <span>The requested route or report is not available.</span>
      <Link href="/">
        <ArrowLeft />
        Return to Verity
      </Link>
    </main>
  );
}
