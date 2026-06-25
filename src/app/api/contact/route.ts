import { type NextRequest } from 'next/server'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { sendContactEmail } from '@/lib/email'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>

    const { firstName, lastName, workEmail, companyName, jobTitle, hearAboutUs, howCanWeHelp, recaptchaToken } = body

    if (!firstName || !lastName || !workEmail || !companyName || !recaptchaToken) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!emailRegex.test(String(workEmail))) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const recaptchaValid = await verifyRecaptcha(String(recaptchaToken))
    if (!recaptchaValid) {
      return Response.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
    }

    await sendContactEmail({
      firstName: String(firstName),
      lastName: String(lastName),
      workEmail: String(workEmail),
      companyName: String(companyName),
      jobTitle: jobTitle ? String(jobTitle) : undefined,
      hearAboutUs: hearAboutUs ? String(hearAboutUs) : undefined,
      howCanWeHelp: howCanWeHelp ? String(howCanWeHelp) : undefined,
    })

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[contact] Unhandled error:', error)
    return Response.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
