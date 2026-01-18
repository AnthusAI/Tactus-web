import * as React from "react"

export const Link = React.forwardRef(({ to, ...props }, ref) => (
  <a ref={ref} href={to} {...props} />
))

export const navigate = (to) => {
  if (typeof window === "undefined") return
  window.location.assign(to)
}

export const graphql = () => null

export const useStaticQuery = () => ({
  site: {
    siteMetadata: {
      title: "Tactus",
      description: "",
      siteUrl: "",
    },
  },
})

export const StaticQuery = ({ render }) => render(useStaticQuery())

export const withPrefix = (path) => path

