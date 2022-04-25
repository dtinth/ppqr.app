import { Component } from 'preact'
import './AppHeader.css'
import logo from './logo.svg'

export default function AppHeader(props: { rightContent?: Component }) {
  return (
    <div className="AppHeader">
      <img alt="" src={logo} />
      <h1>ppqr.app</h1>
      <div className="AppHeaderのrightContent">{props.rightContent}</div>
    </div>
  )
}
