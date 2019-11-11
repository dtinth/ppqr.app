import React, { ReactNode } from 'react'
import './AppHeader.css'
import logo from './logo.svg'

export default function AppHeader(props: { rightContent?: ReactNode }) {
  return (
    <div className="AppHeader">
      <img alt="" src={logo} />
      <h1>ppqr.app</h1>
      <div className="AppHeaderのrightContent">{props.rightContent}</div>
    </div>
  )
}
