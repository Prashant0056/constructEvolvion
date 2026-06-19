'use client'

import { cn } from '@/utilities/cn'
import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm({
  source = 'footer',
  className,
}: {
  source?: string
  className?: string
}) {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const inputCls =
    'w-full rounded-[16px] border border-line bg-background px-5 py-3.5 text-sm text-foreground placeholder:text-faint focus:border-foreground focus:outline-none'

  return (
    <form onSubmit={onSubmit} className={cn('flex flex-col gap-4', className)}>
      <input name="name" required placeholder="Name" className={inputCls} />
      <input
        name="email"
        type="email"
        required
        placeholder="Email Address"
        className={inputCls}
      />
      <input name="phone" placeholder="Mobile Number" className={inputCls} />
      <textarea name="message" required placeholder="Message" rows={4} className={inputCls} />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'success' && (
        <p className="text-sm text-green-600">Thanks — we&apos;ll be in touch shortly.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
