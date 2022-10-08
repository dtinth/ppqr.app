import { useLocalization } from '../services/useLocalization'

export function LocalizedText(props: { th: string; en: string }) {
  const { main, sub } = useLocalization(props.th, props.en)

  return <span title={sub}>{main}</span>
}
