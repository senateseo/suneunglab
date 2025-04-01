"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Settings } from "lucide-react"

export default function MyPageLayout({ children }) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "내 강의",
      href: "/my-page",
      icon: <BookOpen className="h-5 w-5" />,
      active: pathname === "/my-page",
    },
    {
      title: "설정",
      href: "/my-page/settings",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/my-page/settings",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Navigation */}
        <aside className="md:w-64 flex-shrink-0">
          <nav className="space-y-1 sticky top-20">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  item.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}

