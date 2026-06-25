import { Resend } from 'resend'

export interface ContactEmailData {
  firstName: string
  lastName: string
  workEmail: string
  companyName: string
  jobTitle?: string
  hearAboutUs?: string
  howCanWeHelp?: string
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'DSC Contact Form <contact@datasolutionsinc.ca>',
    to: 'mnandlall@datasolutionsinc.ca',
    replyTo: data.workEmail,
    subject: `New Contact Form Submission from ${data.firstName} ${data.lastName}`,
    html: buildEmailHtml(data),
  })
  if (error) throw new Error(error.message)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function buildEmailHtml(data: ContactEmailData): string {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
    <p><strong>Work Email:</strong> ${escapeHtml(data.workEmail)}</p>
    <p><strong>Company:</strong> ${escapeHtml(data.companyName)}</p>
    ${data.jobTitle ? `<p><strong>Job Title:</strong> ${escapeHtml(data.jobTitle)}</p>` : ''}
    ${data.hearAboutUs ? `<p><strong>How They Heard About Us:</strong> ${escapeHtml(data.hearAboutUs)}</p>` : ''}
    ${data.howCanWeHelp ? `<p><strong>How We Can Help:</strong><br/>${escapeHtml(data.howCanWeHelp)}</p>` : ''}
  `.trim()
}
