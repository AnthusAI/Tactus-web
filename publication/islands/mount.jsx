import * as React from "react"
import { createRoot } from "react-dom/client"

// ::island attributes arrive as strings in the island's props; components expect numbers and booleans.
export const coerceValue = value => {
  if (typeof value !== "string") return value
  if (/^\d+$/.test(value)) return Number(value)
  if (/^\d+\.\d+$/.test(value)) return Number(value)
  if (value === "true") return true
  if (value === "false") return false
  return value
}

const useColorScheme = () => {
  const [theme, setTheme] = React.useState("light")
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setTheme(query.matches ? "dark" : "light")
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return theme
}

const Island = ({ Component, props }) => {
  const theme = useColorScheme()
  return <Component theme={theme} {...props} />
}

const coerceProps = props => Object.fromEntries(Object.entries(props).map(([name, value]) => [name, coerceValue(value)]))

export const mountReact = (element, Component, props) => {
  createRoot(element).render(<Island Component={Component} props={props} />)
}

// A Papyrus island: `(element, props) => ...` that renders a React component into the mount point.
export const reactIsland = Component => (element, props) => mountReact(element, Component, coerceProps(props))

// The code of a fenced block that follows the mount point on the page; the block stays as the fallback until
// the island mounts and then goes away.
export const takeFollowingCode = element => {
  const block = element.nextElementSibling
  const codeElement = block && block.tagName === "PRE" ? block.querySelector("code") : null
  if (!codeElement) throw new Error("This island must be followed by a fenced code block")
  const language = (codeElement.className.match(/language-([\w-]+)/) || [])[1]
  block.remove()
  return { code: codeElement.textContent.replace(/\n$/, ""), language }
}

// An island that loads its component on demand (a large dependency used by one page).
export const lazyIsland = load => (element, props) =>
  load().then(module => reactIsland(module.default)(element, props))

export const registerIslands = islands => {
  window.papyrusIslands = { ...window.papyrusIslands, ...islands }
}
