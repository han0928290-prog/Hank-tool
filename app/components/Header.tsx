"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/lottery", label: "抽獎轉盤" },
  { href: "/pomodoro", label: "番茄鐘" },
  { href: "/fortune", label: "好運抽籤" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap sm:justify-between sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-base font-bold text-gray-900 sm:gap-2 sm:text-lg"
        >
          <span className="text-xl sm:text-2xl">🧰</span>
          Hank 的小工具箱
        </Link>
        <nav className="flex flex-wrap justify-center gap-1 sm:flex-nowrap sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition sm:px-3 sm:py-1.5 sm:text-sm ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
