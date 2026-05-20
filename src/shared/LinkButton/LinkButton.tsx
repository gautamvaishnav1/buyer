interface LinkButtonProps {
  link: string
  text: string
  styleName: string
}
import { Link } from 'react-router-dom'
import '../../../src/styles/link_button.css'
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
      {props.text}
    </Link>
  )
}

export default LinkButton
