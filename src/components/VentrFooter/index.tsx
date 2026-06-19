import { ContactForm } from '@/components/ventr/ContactForm'
import { Facebook, Instagram, Linkedin, Star } from 'lucide-react'
import Link from 'next/link'

const footerLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Properties', href: '/properties' },
  { label: 'Agents', href: '/agents' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

export function VentrFooter() {
  return (
    <footer className="mt-20">
      {/* Contact CTA */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-[100px]">
        <div className="grid gap-10 rounded-[32px] bg-ink px-6 py-10 text-white md:grid-cols-2 md:px-12 md:py-14">
          <div className="flex flex-col justify-between gap-8">
            <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-[40px]">
              Still Not Sure Where to Start? Contact Us and Fill Out the Form
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-white text-white" />
                <span className="text-lg font-semibold">4.8</span>
              </div>
              <span className="text-sm text-white/60">(12K Reviews)</span>
            </div>
          </div>
          <div className="rounded-[24px] bg-background p-6 md:p-8">
            <ContactForm source="footer" />
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-[100px]">
        <div className="flex flex-col gap-10 border-b border-line pb-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="text-3xl font-bold tracking-[-0.04em] text-foreground">
              VENTR
            </Link>
            <p className="mt-4 text-sm text-subtle">
              Find a residence that aligns with your lifestyle.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-subtle transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex size-10 items-center justify-center rounded-full border border-line text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 text-sm text-subtle md:flex-row md:items-center md:justify-between">
          <p>©2024 VENTR. All Rights are reserved.</p>
          <div className="flex gap-6">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
