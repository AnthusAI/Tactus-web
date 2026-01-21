import * as React from "react"
import { Link } from "gatsby"
import * as styles from "./button.module.css"

const Button = ({
  to,
  href,
  variant = "primary", // "primary" | "secondary" | "tertiary"
  size = "medium", // "medium" | "large"
  shadow = false, // boolean to enable flat shadow
  as: Component = "button", // allow overriding the component (e.g. "div")
  className,
  children,
  ...props
}) => {
  const rootClassName = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${shadow ? styles.shadow : ""}
    ${className || ""}
  `.trim()

  if (to) {
    return (
      <Link className={rootClassName} to={to} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a className={rootClassName} href={href} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Component className={rootClassName} {...props}>
      {children}
    </Component>
  )
}

export default Button
