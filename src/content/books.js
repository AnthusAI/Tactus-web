import learningCover from "../images/books/learning-tactus.png"
import programmingCover from "../images/books/programming-tactus.png"
import nutshellCover from "../images/books/tactus-in-a-nutshell.png"

export const BOOKS = [
  {
    id: "learning-tactus",
    title: "Learning Tactus",
    description: "A coherent introduction: the why, the mental model, and the core patterns.",
    href: "https://anthusai.github.io/Learning-Tactus/",
    pdf: "https://anthusai.github.io/Learning-Tactus/pdf/Learning-Tactus.pdf",
    repo: "https://github.com/AnthusAI/Learning-Tactus",
    coverSrc: learningCover,
  },
  {
    id: "programming-tactus",
    title: "Programming Tactus",
    description: "The reference: a deeper and broader tour of the language.",
    href: "https://anthusai.github.io/Programming-Tactus/",
    pdf: "https://anthusai.github.io/Programming-Tactus/pdf/Programming-Tactus.pdf",
    repo: "https://github.com/AnthusAI/Programming-Tactus",
    coverSrc: programmingCover,
  },
  {
    id: "tactus-in-a-nutshell",
    title: "Tactus in a Nutshell",
    description: "A quick reference for when you’re writing and debugging.",
    href: "https://anthusai.github.io/Tactus-in-a-Nutshell/",
    pdf: "https://anthusai.github.io/Tactus-in-a-Nutshell/pdf/Tactus-in-a-Nutshell.pdf",
    repo: "https://github.com/AnthusAI/Tactus-in-a-Nutshell",
    coverSrc: nutshellCover,
  },
]

export const getBookById = (id) => BOOKS.find((book) => book.id === id)

