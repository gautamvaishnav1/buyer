
import { Link } from 'react-router-dom'
import '../../../src/styles/link_button.css'
import {  type ReactElement, type ReactNode } from 'react'
interface LinkButtonProps {
  link: string
  text?: string
  icon?:ReactElement
  styleName?: string
  children?:ReactNode
}
const LinkButton = (props: LinkButtonProps) => {
  return (
    <Link
      to={props.link}
      className={`${
        props.styleName === 'green'
          ? 'green-link'
          : props.styleName === 'red'
          ? 'red-link'
          : props.styleName === 'blue'
          ? 'blue-link'
          : 'default-link'
      }`}
    >
      {props.children}
      {props.text}
    </Link>
  )
}

export default LinkButton
