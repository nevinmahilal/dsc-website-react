'use client'

import { useEffect, useRef } from 'react'

interface DashboardEmbedProps {
  body: string
}

export function DashboardEmbed({ body }: DashboardEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // React's dangerouslySetInnerHTML suppresses <script> execution.
    // We must find each injected script, clone it as a new DOM script element
    // (which the browser WILL execute), and replace the inert one.
    const scripts = Array.from(container.querySelectorAll('script'))
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      )
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [body])

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  )
}
