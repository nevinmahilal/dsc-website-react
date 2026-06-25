'use client'
import { forwardRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface ReCaptchaProps {
  onChange: (token: string | null) => void
  onExpired?: () => void
  onErrored?: () => void
}

export const ReCaptcha = forwardRef<ReCAPTCHA, ReCaptchaProps>(
  function ReCaptcha({ onChange, onExpired, onErrored }, ref) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) {
      return (
        <p className="text-sm text-red-600">
          reCAPTCHA is not configured. Please contact support.
        </p>
      )
    }
    return (
      <ReCAPTCHA
        ref={ref}
        sitekey={siteKey}
        onChange={onChange}
        onExpired={onExpired}
        onErrored={onErrored}
      />
    )
  }
)

ReCaptcha.displayName = 'ReCaptcha'
