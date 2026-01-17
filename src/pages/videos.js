import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import getVideoSrc from "../lib/getVideoSrc"
import * as styles from "./videos.module.css"

const VIDEOS = [
  {
    id: "intro",
    title: "Intro to Tactus",
    description: "What Tactus is, why tool-using agents need guardrails, and how the runtime helps.",
    filename: "intro.mp4",
    poster: "intro-poster.jpg",
  },
  {
    id: "why-new-language",
    title: "Why a New Language?",
    description: "The evolution of programming paradigms and why Tactus was created for the age of AI agents.",
    filename: "why-new-language.mp4",
    poster: "why-new-language-poster.jpg",
  },
]

const VideosPage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <h1 className={styles.title}>Videos</h1>
            <p className={styles.subtitle}>
              Short, practical walkthroughs of Tactus: the mental model, safety design, and real workflows.
            </p>

            <div className={styles.grid}>
              {VIDEOS.map((v) => (
                <article key={v.id} className={styles.card}>
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{v.title}</h2>
                    <p className={styles.cardDescription}>{v.description}</p>
                  </div>

                  <div className={styles.player}>
                    <video
                      className={styles.video}
                      controls
                      preload="metadata"
                      playsInline
                      src={getVideoSrc(v.filename)}
                      poster={v.poster ? getVideoSrc(v.poster) : undefined}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <BottomCta
          title="Ready to start building?"
          text="Follow a short walkthrough and write your first durable procedure."
          buttonLabel="Get Started"
          to="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export default VideosPage

export const Head = () => <Seo title="Videos" />
