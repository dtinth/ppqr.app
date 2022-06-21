import { Component } from 'preact'
import logo from './logo.svg'

export default function AppHeader(props: { rightContent?: Component }) {
  return (
    <div className="max-w-[440px] mx-auto h-12 flex items-center">
      <img className="w-12 h-12" alt="" src={logo} />
      <h1 className="font-bold">ppqr.app</h1>
      <div className="ml-auto self-stretch">{props.rightContent}</div>
    </div>
  )
}
