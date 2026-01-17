import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import * as styles from "./book-series-section.module.css"

const BookSeriesSection = ({ id = "books", showHeader = true, mutedBackground = false }) => {
  const books = [
    {
      title: "Learning Tactus",
      description: "A coherent introduction: the why, the mental model, and the core patterns.",
      href: "https://anthusai.github.io/Learning-Tactus/",
      pdf: "https://anthusai.github.io/Learning-Tactus/pdf/Learning-Tactus.pdf",
      repo: "https://github.com/AnthusAI/Learning-Tactus",
      cover: (
        <StaticImage
          src="../images/books/learning-tactus.png"
          alt="Learning Tactus book cover"
          formats={["auto", "webp", "avif"]}
          placeholder="blurred"
          className={styles.cover}
        />
      ),
    },
    {
      title: "Programming Tactus",
      description: "The reference: a deeper and broader tour of the language.",
      href: "https://anthusai.github.io/Programming-Tactus/",
      pdf: "https://anthusai.github.io/Programming-Tactus/pdf/Programming-Tactus.pdf",
      repo: "https://github.com/AnthusAI/Programming-Tactus",
      cover: (
        <StaticImage
          src="../images/books/programming-tactus.png"
          alt="Programming Tactus book cover"
          formats={["auto", "webp", "avif"]}
          placeholder="blurred"
          className={styles.cover}
        />
      ),
    },
    {
      title: "Tactus in a Nutshell",
      description: "A quick reference for when you’re writing and debugging.",
      href: "https://anthusai.github.io/Tactus-in-a-Nutshell/",
      pdf: "https://anthusai.github.io/Tactus-in-a-Nutshell/pdf/Tactus-in-a-Nutshell.pdf",
      repo: "https://github.com/AnthusAI/Tactus-in-a-Nutshell",
      cover: (
        <StaticImage
          src="../images/books/tactus-in-a-nutshell.png"
          alt="Tactus in a Nutshell book cover"
          formats={["auto", "webp", "avif"]}
          placeholder="blurred"
          className={styles.cover}
        />
      ),
    },
  ]

  return (
    <section id={id} className={`${styles.section} ${mutedBackground ? styles.muted : ""}`}>
      <div className={styles.container}>
        {showHeader ? (
          <header className={styles.header}>
            <h2 className={styles.title}>The Tactus Book Series</h2>
            <p className={styles.subtitle}>
              Three complementary books: learn the patterns, dive into the reference, or keep the cheat sheet on your desk.
            </p>
          </header>
        ) : null}

        <div className={styles.grid}>
          {books.map((book) => (
            <article key={book.href} className={styles.card}>
              <a className={styles.link} href={book.href} target="_blank" rel="noreferrer">
                {book.cover}
              </a>
              <h3 className={styles.cardTitle}>
                <a className={styles.link} href={book.href} target="_blank" rel="noreferrer">
                  {book.title}
                </a>
              </h3>
              <p className={styles.description}>{book.description}</p>
              <div className={styles.links}>
                <a href={book.href} target="_blank" rel="noreferrer">
                  Read
                </a>
                <a href={book.pdf} target="_blank" rel="noreferrer">
                  PDF
                </a>
                <a href={book.repo} target="_blank" rel="noreferrer">
                  Repo
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BookSeriesSection
