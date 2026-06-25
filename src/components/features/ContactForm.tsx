'use client'
import { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReCAPTCHA from 'react-google-recaptcha'
import Link from 'next/link'
import { ReCaptcha } from './ReCaptcha'

const hearAboutUsOptions = [
  'Search Engine',
  'Referral',
  'Social Media',
  'Event or Networking',
  'Other',
] as const

const contactSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  workEmail: z.string().trim().min(1, 'Work email is required').email('Please enter a valid email address'),
  companyName: z.string().trim().min(1, 'Company name is required'),
  jobTitle: z.string().optional(),
  hearAboutUs: z.string().optional(),
  howCanWeHelp: z.string().max(5000, 'Message must be 5,000 characters or fewer').optional(),
  recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA verification'),
})

type ContactFormValues = z.infer<typeof contactSchema>

type SubmitState = 'idle' | 'loading' | 'success'

export function ContactForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const isSubmittingRef = useRef(false)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [apiError, setApiError] = useState<string | null>(null)
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      workEmail: '',
      companyName: '',
      jobTitle: '',
      hearAboutUs: '',
      howCanWeHelp: '',
      recaptchaToken: '',
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setSubmitState('loading')
    setApiError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        let errorMessage = 'Failed to send message. Please try again.'
        try {
          const json = await res.json() as { error?: string }
          errorMessage = json.error ?? errorMessage
        } catch {
          // Non-JSON error body — use default message
        }
        setApiError(errorMessage)
        setSubmitState('idle')
        recaptchaRef.current?.reset()
        setValue('recaptchaToken', '')
        return
      }
      setSubmitState('success')
      reset()
      recaptchaRef.current?.reset()
      setValue('recaptchaToken', '')
    } catch {
      setApiError('Failed to send message. Please try again.')
      setSubmitState('idle')
      recaptchaRef.current?.reset()
      setValue('recaptchaToken', '')
    } finally {
      isSubmittingRef.current = false
    }
  }

  if (submitState === 'success') {
    return (
      <div className="text-center py-8">
        <h2 className="font-thin text-2xl text-cool-charcoal mb-4">Thank You!</h2>
        <p className="font-light text-body-text">
          We&apos;ve received your message and will be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* First Name + Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-light text-cool-charcoal mb-1">
            First Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            aria-required="true"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-tech-teal focus:border-transparent font-light text-cool-charcoal"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p id="firstName-error" role="alert" className="text-sm text-red-600 mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-light text-cool-charcoal mb-1">
            Last Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            aria-required="true"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-tech-teal focus:border-transparent font-light text-cool-charcoal"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p id="lastName-error" role="alert" className="text-sm text-red-600 mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Work Email */}
      <div>
        <label htmlFor="workEmail" className="block text-sm font-light text-cool-charcoal mb-1">
          Work Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="workEmail"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors.workEmail}
          aria-describedby={errors.workEmail ? 'workEmail-error' : undefined}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-tech-teal focus:border-transparent font-light text-cool-charcoal"
          {...register('workEmail')}
        />
        {errors.workEmail && (
          <p id="workEmail-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.workEmail.message}
          </p>
        )}
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-light text-cool-charcoal mb-1">
          Company Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="companyName"
          type="text"
          autoComplete="organization"
          aria-required="true"
          aria-invalid={!!errors.companyName}
          aria-describedby={errors.companyName ? 'companyName-error' : undefined}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-tech-teal focus:border-transparent font-light text-cool-charcoal"
          {...register('companyName')}
        />
        {errors.companyName && (
          <p id="companyName-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.companyName.message}
          </p>
        )}
      </div>

      {/* Job Title (optional) */}
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-light text-cool-charcoal mb-1">
          Job Title
        </label>
        <input
          id="jobTitle"
          type="text"
          autoComplete="organization-title"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-tech-teal focus:border-transparent font-light text-cool-charcoal"
          {...register('jobTitle')}
        />
      </div>

      {/* How did you hear about us? */}
      <div>
        <label htmlFor="hearAboutUs" className="block text-sm font-light text-cool-charcoal mb-1">
          How did you hear about us?
        </label>
        <select
          id="hearAboutUs"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-tech-teal focus:border-transparent font-light text-cool-charcoal appearance-none"
          {...register('hearAboutUs')}
        >
          <option value="">Select an option</option>
          {hearAboutUsOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* How can we help? */}
      <div>
        <label htmlFor="howCanWeHelp" className="block text-sm font-light text-cool-charcoal mb-1">
          How can we help?
        </label>
        <textarea
          id="howCanWeHelp"
          rows={5}
          maxLength={5000}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-tech-teal focus:border-transparent font-light text-cool-charcoal resize-y"
          {...register('howCanWeHelp')}
        />
      </div>

      {/* reCAPTCHA */}
      <div>
        <Controller
          name="recaptchaToken"
          control={control}
          render={({ field: { onChange } }) => (
            <ReCaptcha
              ref={recaptchaRef}
              onChange={(token) => { onChange(token); setRecaptchaError(null) }}
              onExpired={() => onChange('')}
              onErrored={() => setRecaptchaError('reCAPTCHA could not load. Please disable your ad blocker or try a different browser.')}
            />
          )}
        />
        {recaptchaError && (
          <p role="alert" className="text-sm text-red-600 mt-1">
            {recaptchaError}
          </p>
        )}
        {errors.recaptchaToken && (
          <p role="alert" className="text-sm text-red-600 mt-1">
            {errors.recaptchaToken.message}
          </p>
        )}
      </div>

      {/* Legal consent */}
      <p className="text-xs font-light text-body-text">
        By submitting this form, you agree to our{' '}
        <Link href="/terms-and-conditions/" className="text-tech-teal underline hover:text-dark-teal">
          Terms &amp; Conditions
        </Link>{' '}
        and{' '}
        <Link href="/privacy-policy/" className="text-tech-teal underline hover:text-dark-teal">
          Privacy Policy
        </Link>
        .
      </p>

      {/* API error */}
      {apiError && (
        <p role="alert" className="text-sm text-red-600">{apiError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitState === 'loading'}
        className="w-full sm:w-auto px-8 py-3 bg-tech-teal text-white font-semibold rounded-full hover:bg-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitState === 'loading' ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}
