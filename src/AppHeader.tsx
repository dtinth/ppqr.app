import { ComponentChildren } from 'preact'
import { logo } from './packlets/branding'

export default function AppHeader(props: { rightContent?: ComponentChildren }) {
  return (
    <div className="max-w-[440px] mx-auto h-12 flex items-center">
      <img className="w-12 h-12" alt="" src={logo} />
      <h1 className="font-bold">ppqr.app</h1>
      <div className="ml-auto">{props.rightContent}</div>
    </div>
  )
}
