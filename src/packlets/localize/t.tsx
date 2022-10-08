import { LocalizedText } from './LocalizedText'

export function t(th: string, en: string) {
  return <LocalizedText th={th} en={en} />
}
