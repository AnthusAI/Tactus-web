import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import getVideoSrc from "../lib/getVideoSrc"
import VideosSpotlightSection from "../components/videos-spotlight-section"
import { VIDEOS } from "../content/videos"
import * as styles from "./videos.module.css"

const VideosPage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <h1 className={styles.title}>Videos</h1>
            <p className={styles.subtitle}>
              Short, practical walkthroughs of Tactus: the mental model, safety
              design, and real workflows.
            </p>
          </div>
        </section>

        <VideosSpotlightSection
          id="featured"
          title="Featured"
          lede="Start here — then browse the full catalog below."
          featuredIds={["why-new-language", "guardrails"]}
          to="/videos/#all"
          ctaText="Browse all videos"
          mutedBackground={true}
        />

        <section className={styles.section}>
          <div className={styles.container}>
            <div id="all" className={styles.grid}>
              {VIDEOS.map(v => (
                <article key={v.id} id={v.id} className={styles.card}>
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
          text="Follow a short walkthrough and build your first tool-using agent workflow."
          buttonLabel="Get Started"
          to="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export default VideosPage

export const Head = () => <Seo title="Videos" />
