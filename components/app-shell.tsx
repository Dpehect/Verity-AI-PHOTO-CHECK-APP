"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function AppShell({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [open]);
  const links = [
    { href: "/", label: "Overview" },
    { href: "/verify", label: "Verify" },
    { href: "/workspace", label: "Workspace" },
  ];
  return (
    <div className={dark ? "app-page app-page--dark" : "app-page"}>
      <header className="app-nav shell">
        <Link className="brand" href="/">
          <span className="brand__mark">V</span>
          <span>VERITY</span>
        </Link>
        <nav
          id="product-navigation"
          aria-label="Product navigation"
          className={open ? "app-nav__links is-open" : "app-nav__links"}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="app-nav__action" href="/verify">
          New verification
        </Link>
        <button
          className="app-nav__toggle"
          aria-expanded={open}
          aria-controls="product-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
          <span className="sr-only">Toggle navigation</span>
        </button>
      </header>
      {children}
    </div>
  );
}
