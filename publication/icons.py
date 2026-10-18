"""Inline SVG icons and button rows that Markus has no directive for.

A page writes ``{{icon box}}`` for a standalone icon, ``icon="svg-box"`` on a card, and
``{{actions}}`` before a paragraph made only of links to turn those links into buttons.
"""
import re

STROKE_ATTRIBUTES = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
ICON_BODIES = {
    "box": (
        '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>'
        '<polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>'
    ),
    "wifi-off": (
        '<line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>'
        '<path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>'
        '<path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>'
        '<line x1="12" y1="20" x2="12.01" y2="20"/>'
    ),
    "key": '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    "cable": (
        '<path d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z"/><path d="M17 21v-2"/>'
        '<path d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10"/><path d="M21 21v-2"/><path d="M3 5V3"/>'
        '<path d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z"/><path d="M7 5V3"/>'
    ),
    "lock": '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    "save": (
        '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>'
        '<polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>'
    ),
    "check-circle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    "eye": '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    "alert": (
        '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/>'
        '<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
    ),
    "github": (
        '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>'
        '<path d="M9 18c-4.51 2-5-2-7-2"/>'
    ),
    "terminal": '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
}
FILLED_ICON_BODIES = {
    "apple": '<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-2.96-.9-3.86-.9s-2.53.93-3.86.9c-2.08-.03-3.7-2.17-4.75-3.68-2.12-3.03-1.85-7.58 1.05-8.74 1.42-.57 2.82-.13 3.78-.13.93 0 2.68-1.12 4.5-.95 1.15.11 2.18.57 2.97 1.43-2.57 1.57-2.15 5.8 1.22 7.6M13 3.5c.87-1.13 1.47-2.65 1.3-4.03-1.27.08-2.82.88-3.72 1.93-.8 1-1.52 2.62-1.32 4.02 1.42.1 2.87-.78 3.74-1.92"/>',
    "windows": '<path d="M0 3.449L9.75 2.1v9.451H0zm10.949-1.323L24 0v11.523h-13.051zm-10.949 9.958H9.75v9.451L0 20.551zm10.949 0H24v11.523L10.949 21.9z"/>',
    "linux": '<path d="M20 19V7H4v12h16m0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16m-7 14v-2h5v2h-5m-3.42-4L5.57 9H8.4l3.3 3.29l-3.3 3.29H5.57l4.01-3.29Z"/>',
}
ICON_NAMES = sorted(set(ICON_BODIES) | set(FILLED_ICON_BODIES))
ICON_MARKER_PREFIX = "ICON:"
ACTIONS_MARKER = "ACTIONSMARKER"
ICON_PARAGRAPH_PATTERN = re.compile(rf"<p>{ICON_MARKER_PREFIX}([a-z-]+)</p>")
CARD_ICON_PATTERN = re.compile(r'<span class="markus-card-icon" aria-hidden="true">svg-([a-z-]+)</span>')
ACTIONS_PATTERN = re.compile(rf"<p>{ACTIONS_MARKER}</p>\s*<p>(.*?)</p>", re.DOTALL)
ANCHOR_PATTERN = re.compile(r"<a ([^>]*)>")


def icon_svg(name):
    if name in ICON_BODIES:
        return f'<svg xmlns="http://www.w3.org/2000/svg" class="tactus-icon-svg" viewBox="0 0 24 24" {STROKE_ATTRIBUTES}>{ICON_BODIES[name]}</svg>'
    if name in FILLED_ICON_BODIES:
        return f'<svg xmlns="http://www.w3.org/2000/svg" class="tactus-icon-svg" viewBox="0 0 24 24" fill="currentColor">{FILLED_ICON_BODIES[name]}</svg>'
    raise ValueError(f"No icon named {name}; known: {', '.join(ICON_NAMES)}")


def place_icons(article_html):
    article_html = ICON_PARAGRAPH_PATTERN.sub(lambda match: f'<p class="tactus-icon" aria-hidden="true">{icon_svg(match.group(1))}</p>', article_html)
    return CARD_ICON_PATTERN.sub(lambda match: f'<span class="markus-card-icon" aria-hidden="true">{icon_svg(match.group(1))}</span>', article_html)


def place_actions(article_html):
    def build(match):
        counter = {"index": 0}

        def style(anchor):
            counter["index"] += 1
            kind = "" if counter["index"] == 1 else " tactus-button-secondary"
            return f'<a class="tactus-button{kind}" {anchor.group(1)}>'

        links = ANCHOR_PATTERN.sub(style, match.group(1))
        links = re.sub(r"</a>\s*·\s*(?=<a )", "</a>", links)
        return f'<div class="tactus-actions">{links}</div>'

    return ACTIONS_PATTERN.sub(build, article_html)
