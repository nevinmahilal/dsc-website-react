'use client'

import type { SortingState } from '@tanstack/react-table'

export interface FilterConfig {
  id: string
  label: string
  isArray?: boolean
}

interface FilterPanelProps {
  filterConfigs: FilterConfig[]
  filterOptions: Record<string, string[]>
  activeFilters: Record<string, string | string[]>
  onFilterChange: (id: string, value: string | string[]) => void
  sorting: SortingState
  onSortChange: (sorting: SortingState) => void
}

export function FilterPanel({
  filterConfigs,
  filterOptions,
  activeFilters,
  onFilterChange,
  sorting,
  onSortChange,
}: FilterPanelProps) {
  const sortValue = sorting[0]?.id === 'title' ? (sorting[0].desc ? 'desc' : 'asc') : ''

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {filterConfigs.map(({ id, label, isArray }) => {
        const options = filterOptions[id] ?? []

        if (isArray) {
          const selected = (activeFilters[id] as string[]) ?? []
          return (
            <details key={id} className="relative group">
              <summary className="cursor-pointer list-none text-sm font-light text-cool-charcoal border border-cool-charcoal/20 rounded px-3 py-2 bg-white flex items-center gap-1.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal">
                {label}
                {selected.length > 0 && (
                  <span className="text-xs font-semibold text-tech-teal">({selected.length})</span>
                )}
              </summary>
              <div className="absolute z-10 top-full mt-1 left-0 bg-white border border-cool-charcoal/20 rounded shadow-md p-2 min-w-max max-h-48 overflow-y-auto">
                {options.length === 0 ? (
                  <p className="text-xs font-light text-cool-charcoal/60 px-2 py-1">No options available</p>
                ) : (
                  options.map(v => {
                    const checked = selected.includes(v)
                    return (
                      <label
                        key={v}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-cool-white cursor-pointer rounded"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? selected.filter(s => s !== v)
                              : [...selected, v]
                            onFilterChange(id, next)
                          }}
                          className="accent-tech-teal"
                        />
                        <span className="text-sm font-light text-cool-charcoal">{v}</span>
                      </label>
                    )
                  })
                )}
                {selected.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onFilterChange(id, [])}
                    className="w-full text-left text-xs font-light text-tech-teal px-2 py-1 mt-1 border-t border-cool-charcoal/10 hover:text-dark-teal"
                  >
                    Clear
                  </button>
                )}
              </div>
            </details>
          )
        }

        return (
          <select
            key={id}
            value={(activeFilters[id] as string) ?? ''}
            onChange={e => onFilterChange(id, e.target.value)}
            aria-label={`Filter by ${label}`}
            className="text-sm font-light text-cool-charcoal border border-cool-charcoal/20 rounded px-3 py-2 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
          >
            <option value="">{label}</option>
            {options.map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        )
      })}

      <select
        value={sortValue}
        onChange={e => {
          const v = e.target.value
          onSortChange(v ? [{ id: 'title', desc: v === 'desc' }] : [])
        }}
        aria-label="Sort by title"
        className="text-sm font-light text-cool-charcoal border border-cool-charcoal/20 rounded px-3 py-2 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
      >
        <option value="">Sort</option>
        <option value="asc">A → Z</option>
        <option value="desc">Z → A</option>
      </select>
    </div>
  )
}
