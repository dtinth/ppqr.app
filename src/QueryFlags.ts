let flagSet: Set<string> | undefined

export function isQueryFlagEnabled(flagName: string) {
  if (!flagSet) {
    flagSet = new Set(
      (new URLSearchParams(window.location.search).get('flags') || '')
        .split(',')
        .filter(Boolean),
    )
  }
  return flagSet.has(flagName)
}
