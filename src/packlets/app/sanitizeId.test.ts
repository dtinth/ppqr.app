import { describe, expect, it } from 'vite-plus/test'

import { sanitizeId } from './sanitizeId'

describe('sanitizeId', () => {
  it('keeps only digits', () => {
    expect(sanitizeId(' 08-1234-5678 ')).toBe('0812345678')
  })

  it('returns an empty string when there are no digits', () => {
    expect(sanitizeId('abc')).toBe('')
  })
})
