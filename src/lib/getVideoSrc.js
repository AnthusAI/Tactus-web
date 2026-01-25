const getVideoSrc = filename => {
  let base = process.env.GATSBY_VIDEOS_BASE_URL

  if (!base) {
    try {
      // eslint-disable-next-line global-require
      const outputs = require("../../amplify_outputs.json")
      base = outputs.custom?.videosCdnUrl
      if (base) base = `${base}/videos`
    } catch (e) {
      // Fall back to local
    }
  }

  if (base && typeof base === "string") {
    return `${base.replace(/\/$/, "")}/${filename}`
  }

  return `/videos/${filename}`
}

export default getVideoSrc
