'use client'

import { cn } from '@/utilities/cn'
import { useTheme } from '@/providers/Theme'
import { Menu, Moon, Sun, User, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Properties', href: '/properties' },
  { label: 'Agents', href: '/agents' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
]

export function VentrHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:h-24 md:px-[100px]">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-[-0.04em] text-foreground">
          VENTR
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium tracking-[-0.01em] transition-colors hover:text-foreground',
                isActive(item.href) ? 'text-foreground' : 'text-subtle',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color mode"
            className="flex size-11 items-center justify-center rounded-full border border-line text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <Sun className="size-5 dark:hidden" />
            <Moon className="hidden size-5 dark:block" />
          </button>
          <Link
            href="/login"
            className="rounded-full border border-line px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Login
          </Link>
          <Link
            href="/login"
            aria-label="Account"
            className="flex size-11 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90"
          >
            <User className="size-5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="flex size-11 items-center justify-center rounded-full border border-line text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-background lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-5 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'border-b border-line py-3 text-base font-medium last:border-b-0',
                  isActive(item.href) ? 'text-foreground' : 'text-subtle',
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-4 flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-foreground"
            >
              <Sun className="size-4 dark:hidden" />
              <Moon className="hidden size-4 dark:block" />
              <span className="dark:hidden">Dark mode</span>
              <span className="hidden dark:block">Light mode</span>
            </button>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-foreground px-6 py-3 text-center text-sm font-medium text-background"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
