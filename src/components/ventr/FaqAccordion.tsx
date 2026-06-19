'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { RichText } from '@/components/RichText'

type Faq = {
  question: string
  answer?: unknown
  id?: string | null
}

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (!faqs?.length) return null

  return (
    <Accordion type="single" collapsible className="w-full divide-y divide-line">
      {faqs.map((faq, i) => (
        <AccordionItem key={faq.id || i} value={`faq-${i}`} className="border-b border-line">
          <AccordionTrigger className="py-6 text-left text-lg font-medium text-foreground hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-base text-subtle">
            {faq.answer ? (
              <RichText data={faq.answer as never} enableGutter={false} enableProse={false} />
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
