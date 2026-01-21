export const VIDEOS = [
  {
    id: "intro",
    title: "Intro to Tactus",
    meta: "4 min",
    description: "What Tactus is, why tool-using agents need guardrails, and how the runtime helps.",
    filename: "intro.mp4",
    poster: "intro-poster.jpg",
  },
  {
    id: "why-new-language",
    title: "Why a New Language?",
    meta: "7 min",
    description: "The evolution of programming paradigms and why Tactus was created for the age of AI agents.",
    filename: "why-new-language.mp4",
    poster: "why-new-language-poster.jpg",
  },
  {
    id: "guardrails",
    title: "Guardrails for Agent Autonomy",
    description: "Why constraints enable autonomy: staged tools, human gates, and a secretless broker boundary (so there’s nothing in the runtime to steal).",
    filename: "guardrails.mp4",
    poster: "guardrails-poster.jpg",
  },
]

export const getVideoById = (id) => VIDEOS.find((video) => video.id === id)

