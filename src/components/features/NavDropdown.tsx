'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import type { NavItem } from '@/types/nav-types'

export function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const [subOpen, setSubOpen] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const subCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // P4: defer activeElement check — reliable in Safari where relatedTarget is null
  function handleBlur() {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setOpen(false)
        setSubOpen(null)
      }
    }, 0)
  }

  // P8: clear subOpen when focus leaves the specific sub-trigger wrapper
  function handleSubWrapperBlur(subLabel: string) {
    setTimeout(() => {
      if (!containerRef.current) return
      const wrapper = containerRef.current.querySelector(`[data-sub="${subLabel}"]`)
      if (wrapper && !wrapper.contains(document.activeElement)) {
        setSubOpen(null)
      }
    }, 0)
  }

  // P1: delayed close so mouse can cross from sub-trigger to left-full flyout panel
  function clearSubTimer() {
    if (subCloseTimer.current) {
      clearTimeout(subCloseTimer.current)
      subCloseTimer.current = null
    }
  }
  function scheduleSubClose() {
    clearSubTimer()
    subCloseTimer.current = setTimeout(() => setSubOpen(null), 150)
  }

  // P2 + P3: keyboard handler — Escape, ArrowDown/Up, ArrowRight/Left
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      setSubOpen(null)
      triggerRef.current?.focus()
      return
    }
    if (!open) return

    const panel = containerRef.current?.querySelector<HTMLElement>('[data-dropdown-panel]')
    const currentFocus = document.activeElement as HTMLElement
    const inSubMenu = !!currentFocus.closest('[data-submenu-panel]')

    if (inSubMenu) {
      const subPanel = currentFocus.closest<HTMLElement>('[data-submenu-panel]')
      if (!subPanel) return
      const subItems = Array.from(subPanel.querySelectorAll<HTMLElement>('[role="menuitem"]'))
      const idx = subItems.indexOf(currentFocus)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        subItems[(idx + 1) % subItems.length]?.focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        subItems[(idx - 1 + subItems.length) % subItems.length]?.focus()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSubOpen(null)
        panel?.querySelector<HTMLElement>(`[data-sub-trigger="${subOpen}"]`)?.focus()
      }
      return
    }

    if (!panel) return
    const mainItems = Array.from(
      panel.querySelectorAll<HTMLElement>(
        ':scope > [role="menuitem"], :scope > div[data-sub] > button[role="menuitem"]'
      )
    )
    const idx = mainItems.indexOf(currentFocus)
    const fromTrigger = currentFocus === triggerRef.current

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (fromTrigger) { mainItems[0]?.focus(); return }
      mainItems[(idx + 1) % mainItems.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (fromTrigger) { mainItems[mainItems.length - 1]?.focus(); return }
      mainItems[(idx - 1 + mainItems.length) % mainItems.length]?.focus()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const subLabel = currentFocus.getAttribute('data-sub-trigger')
      if (subLabel) {
        setSubOpen(subLabel)
        setTimeout(() => {
          if (!containerRef.current) return
          containerRef.current
            .querySelector<HTMLElement>(`[data-sub="${subLabel}"] [data-submenu-panel] [role="menuitem"]`)
            ?.focus()
        }, 0)
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { setOpen(false); setSubOpen(null) }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        className="flex items-center gap-1 text-sm font-light text-cool-charcoal hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal rounded"
      >
        {item.label}
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={item.label}
          data-dropdown-panel=""
          className="absolute top-full left-0 mt-1 bg-white border border-gray-100 shadow-lg rounded py-2 min-w-48 z-50"
        >
          {item.children?.map((child) => {
            if (child.children) {
              return (
                <div
                  key={child.label}
                  className="relative"
                  data-sub={child.label}
                  onMouseEnter={() => { clearSubTimer(); setSubOpen(child.label) }}
                  onMouseLeave={scheduleSubClose}
                  onBlur={() => handleSubWrapperBlur(child.label)}
                >
                  <button
                    role="menuitem"
                    aria-haspopup="menu"
                    aria-expanded={subOpen === child.label}
                    onFocus={() => setSubOpen(child.label)}
                    data-sub-trigger={child.label}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm font-light text-cool-charcoal hover:bg-cool-white hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tech-teal"
                  >
                    {child.label}
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  {subOpen === child.label && (
                    <div
                      role="menu"
                      aria-label={child.label}
                      data-submenu-panel=""
                      className="absolute left-full top-0 bg-white border border-gray-100 shadow-lg rounded py-2 min-w-48 z-50"
                      onMouseEnter={clearSubTimer}
                      onMouseLeave={scheduleSubClose}
                    >
                      {child.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          role="menuitem"
                          className="block px-4 py-2 text-sm font-light text-cool-charcoal hover:bg-cool-white hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tech-teal"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                className="block px-4 py-2 text-sm font-light text-cool-charcoal hover:bg-cool-white hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tech-teal"
              >
                {child.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
