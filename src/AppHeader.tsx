import { Component } from 'preact'
import './AppHeader.css'
import logo from './logo.svg'

export default function AppHeader(props: { rightContent?: Component }) {
  return (
    <div className="AppHeader h-12">
      <img className="w-12 h-12" alt="" src={logo} />
      <h1 className="font-bold">ppqr.app</h1>
      <div className="AppHeaderのrightContent">{props.rightContent}</div>
    </div>
  )
}
