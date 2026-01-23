import * as React from "react"
import * as styles from "./tech-stack-section.module.css"

import dspyLogo from "../images/logos/dspy.png"
import luaLogo from "../images/logos/lua.svg"
import pydanticLogo from "../images/logos/pydantic.svg"

const ITEMS = [
  {
    name: "Lua",
    description: "A fast, lightweight, and securely sandboxable scripting runtime.",
    logo: luaLogo,
    url: "https://www.lua.org",
  },
  {
    name: "DSPy",
    description: "Algorithmic optimization of prompts and weights for reliable agents.",
    logo: dspyLogo,
    url: "https://dspy.ai",
  },
  {
    name: "Pydantic",
    description: "The industry standard for data validation and schema definition.",
    logo: pydanticLogo,
    url: "https://docs.pydantic.dev",
  },
  {
    name: "Pydantic AI",
    description: "Production-grade primitives for building agentic workflows.",
    logo: pydanticLogo,
    url: "https://ai.pydantic.dev",
  },
]

const TechStackSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Built on the shoulders of giants</h2>
        </header>
        <div className={styles.grid}>
          {ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              style={{ textDecoration: 'none' }}
            >
              <div className={styles.logoContainer}>
                <img
                  src={item.logo}
                  alt={`${item.name} logo`}
                  className={`${styles.logo} ${styles[`logo${item.name.replace(/\s+/g, '')}`]}`}
                />
              </div>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.description}>{item.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStackSection
