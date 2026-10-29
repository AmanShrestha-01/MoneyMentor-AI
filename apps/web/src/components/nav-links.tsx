"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";

const studentNav = [
  { label: "Dashboard", href: "/" },
  { label: `${brand.assistantName} Chat`, href: "/chat" },
  { label: "My Learning", href: "/learning" },
  { label: "Decision Lab", href: "/decision-lab" },
  { label: "Resources", href: "/resources" },
  { label: "Profile & Privacy", href: "/privacy" },
];

const projectNav = [{ label: "About this project", href: "/project" }];

function NavItem({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <li className="min-w-0 flex-[1_1_170px]">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-11 items-center whitespace-nowrap rounded-lg px-3 text-sm ${
          active ? "bg-primary-soft font-semibold text-primary" : "font-medium hover:bg-muted"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      <ul className="flex flex-wrap gap-1">
        {studentNav.map((item) => (
          <NavItem key={item.href} {...item} active={pathname === item.href} />
        ))}
      </ul>
      <p className="mb-1 mt-5 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Research
      </p>
      <ul className="flex flex-wrap gap-1">
        {projectNav.map((item) => (
          <NavItem key={item.href} {...item} active={pathname === item.href} />
        ))}
      </ul>
    </>
  );
}
