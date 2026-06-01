/** Returns true if query is empty or matches any of the given field values (case-insensitive). */
export function matchesSearch(
  query: string,
  ...fields: (string | number | undefined | null)[]
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return fields.some((field) =>
    String(field ?? '')
      .toLowerCase()
      .includes(q)
  )
}
