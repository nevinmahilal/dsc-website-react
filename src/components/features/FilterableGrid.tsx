'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type FilterFn,
} from '@tanstack/react-table'
import { FilterPanel, type FilterConfig } from './FilterPanel'

const arrayIncludesFilter: FilterFn<Record<string, unknown>> = (
  row,
  columnId,
  filterValue
) => {
  if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return true
  const val = row.getValue<string[]>(columnId)
  if (!Array.isArray(val)) return false
  const selected = Array.isArray(filterValue) ? filterValue : [filterValue as string]
  return selected.some(v => val.includes(v))
}
arrayIncludesFilter.autoRemove = (val: unknown) =>
  !val || (Array.isArray(val) && val.length === 0)

interface FilterableGridProps<T extends object> {
  data: T[]
  filterConfigs: FilterConfig[]
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
}

export function FilterableGrid<T extends object>({
  data,
  filterConfigs,
  renderItem,
  emptyMessage = 'No results found.',
}: FilterableGridProps<T>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<T>[]>(
    () => [
      {
        id: 'title',
        accessorKey: 'title' as keyof T & string,
      },
      ...filterConfigs.map(({ id, isArray }) => ({
        id,
        accessorKey: id as keyof T & string,
        filterFn: isArray
          ? (arrayIncludesFilter as FilterFn<T>)
          : ('equalsString' as const),
      })),
    ],
    [filterConfigs]
  )

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Compute unique options for each filter field.
  // - Array fields (isArray: true): manually flatten unique values from raw data
  //   (getFacetedUniqueValues does not flatten nested arrays)
  // - String fields: use TanStack getFacetedUniqueValues via the table column
  const filterOptions = useMemo<Record<string, string[]>>(() => {
    return filterConfigs.reduce<Record<string, string[]>>((acc, { id, isArray }) => {
      if (isArray) {
        const values = new Set<string>()
        data.forEach(item => {
          const val = (item as Record<string, unknown>)[id]
          if (Array.isArray(val)) {
            val.forEach(v => typeof v === 'string' && v && values.add(v))
          }
        })
        acc[id] = [...values].sort()
      } else {
        const col = table.getColumn(id)
        acc[id] = col
          ? [...col.getFacetedUniqueValues().keys()]
              .filter((v): v is string => typeof v === 'string' && !!v)
              .sort()
          : []
      }
      return acc
    }, {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filterConfigs, columnFilters])

  const activeFilters = useMemo(
    () =>
      Object.fromEntries(
        columnFilters.map(f => [f.id, f.value as string | string[]])
      ),
    [columnFilters]
  )

  const hasActiveFilters = columnFilters.length > 0
  const rows = table.getRowModel().rows

  return (
    <>
      <FilterPanel
        filterConfigs={filterConfigs}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={(id, value) => {
          const col = table.getColumn(id)
          const isEmpty = Array.isArray(value) ? value.length === 0 : !value
          col?.setFilterValue(isEmpty ? undefined : value)
        }}
        sorting={sorting}
        onSortChange={setSorting}
      />
      {rows.length === 0 ? (
        <p className="text-center py-12 font-light text-body-text">
          {hasActiveFilters ? emptyMessage : 'No items available.'}
        </p>
      ) : (
        <div className="space-y-4">
          {rows.map(row => renderItem(row.original))}
        </div>
      )}
    </>
  )
}
