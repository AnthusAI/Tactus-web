const RELEASES_URL = "https://api.github.com/repos/AnthusAI/Tactus/releases/latest"
const RELEASE_ASSETS = { mac: ".dmg", windows: ".exe", linux: ".appimage" }
const RELEASE_LABELS = { mac: "Download for Mac", windows: "Download for Windows", linux: "Download for Linux" }

// Points the download buttons at the latest GitHub release and names the version.
export const enhanceReleaseLinks = element => {
  fetch(RELEASES_URL)
    .then(response => response.json())
    .then(release => {
      const version = release.tag_name || release.name
      if (version) {
        const label = document.createElement("p")
        label.setAttribute("aria-label", "Latest version")
        label.innerHTML = "<strong>Latest version</strong> "
        label.append(version)
        element.append(label)
      }
      Object.entries(RELEASE_ASSETS).forEach(([platform, extension]) => {
        const asset = (release.assets || []).find(item => item.name.toLowerCase().endsWith(extension))
        const link = document.querySelector(`a[href$="releases/latest#${platform}"]`)
        if (asset && link) {
          link.href = asset.browser_download_url
          link.textContent = RELEASE_LABELS[platform]
        }
      })
    })
    .catch(error => console.error("Failed to fetch release", error))
}
