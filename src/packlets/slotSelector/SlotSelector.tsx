import { FunctionComponent, JSX } from 'preact'

import './SlotSelector.css'

interface Props {
  active: number
  onSelect(
    index: number,
    event: JSX.TargetedMouseEvent<HTMLButtonElement>,
  ): void
  data: {
    [key: string]: string
  }
}

export const SlotSelector: FunctionComponent<Props> = (props) => {
  return (
    <div className="SlotSelector">
      {[1, 2, 3, 4].map((i) => {
        return (
          <button
            key={`SlotSelector-${i}`}
            className={
              'SlotSelectorのitem' + (props.active === i ? ' is-active' : '')
            }
            onClick={(e) => props.onSelect(i, e)}
          >
            <span className="SlotSelectorのnum">{i}</span>
            <span className="SlotSelectorのinfo">
              {renderInfo(props.data[i])}
            </span>
          </button>
        )
      })}
    </div>
  )

  function renderInfo(data: string) {
    if (!data) {
      return 'Empty slot'
    }
    data = String(data)
    if (data.length === 10) {
      return [data.slice(0, 3), data.slice(3, 6), data.slice(6)].join('-')
    }
    if (data.length === 13) {
      return [
        data.slice(0, 1),
        data.slice(1, 5),
        data.slice(5, 10),
        data.slice(10, 12),
        data.slice(12),
      ].join('-')
    }
    if (data.length === 15) {
      return [data.slice(0, 5), data.slice(5)].join('-')
    }
    return data
  }
}

export default SlotSelector
