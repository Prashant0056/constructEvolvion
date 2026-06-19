import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Contact form handler. There is no `contact-submissions` collection yet, so
 * for now we validate, log the submission, and return success. When the
 * collection lands, swap the log for `payload.create({ collection: ... })`.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json()
    const { name, email, message } = body ?? {}

    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: 'Name, email and message are required.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    payload.logger.info({
      msg: 'Contact form submission',
      name,
      email,
      phone: body.phone ?? null,
      source: body.source ?? 'contact-page',
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ success: false, error: 'Invalid request.' }, { status: 400 })
  }
}
