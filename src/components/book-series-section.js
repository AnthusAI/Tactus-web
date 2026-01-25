import * as React from "react"
import { BOOKS } from "../content/books"
import BookCard from "./media/BookCard"
import * as styles from "./book-series-section.module.css"

const BookSeriesSection = ({
  id = "books",
  showHeader = true,
  mutedBackground = false,
}) => {
  return (
    <section
      id={id}
      className={`${styles.section} ${mutedBackground ? styles.muted : ""}`}
    >
      <div className={styles.container}>
        {showHeader ? (
          <header className={styles.header}>
            <h2 className={styles.title}>The Tactus Book Series</h2>
            <p className={styles.subtitle}>
              Three complementary books: learn the patterns, dive into the
              reference, or keep the cheat sheet on your desk.
            </p>
          </header>
        ) : null}

        <div className={styles.grid}>
          {BOOKS.map(book => (
            <BookCard
              key={book.id}
              className={styles.card}
              title={book.title}
              description={book.description}
              href={book.href}
              pdf={book.pdf}
              repo={book.repo}
              coverSrc={book.coverSrc}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BookSeriesSection
