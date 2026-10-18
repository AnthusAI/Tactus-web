"""Islands: React components the page loads from one bundle and mounts where its Markus source asks.

A page's Markus source writes ``{{island Name key="value"}}`` on its own line. For
``AnimatedCodeBlock`` the fenced code block that follows is the code, and stays on the page as the
fallback until the bundle mounts. ``scripts/build-islands.js`` builds the bundle from
``publication/islands/entry.jsx``.
"""
import html
import json
import re

ISLAND_LINE_PATTERN = re.compile(r'^\{\{island ([A-Za-z]+)((?:\s+\w+="[^"]*")*)\}\}$', re.MULTILINE)
ATTRIBUTE_PATTERN = re.compile(r'(\w+)="([^"]*)"')
CODE_ISLAND = "AnimatedCodeBlock"
CODE_ISLAND_DEFAULTS = {
    "showTypewriter": False,
    "typewriterLoop": False,
    "autoHeight": True,
    "width": "100%",
    "autoPlay": False,
    "controls": False,
    "loop": False,
}
CODE_BLOCK_PATTERN = re.compile(r'(<pre><code class="language-([\w-]+)">.*?</code></pre>)', re.DOTALL)
MARKER_PREFIX = "ISLANDMARKER"
ISLAND_SCRIPT_PATH = "/assets/islands.js"
ISLAND_STYLESHEET_PATH = "/assets/islands.css"
HITL_ISLANDS = {"HitlDemo"}
HITL_SCRIPT_PATH = "/assets/hitl/hitl-islands.js"
HITL_STYLESHEET_PATH = "/assets/hitl/hitl-islands.css"


def coerce(value):
    if value.isdigit():
        return int(value)
    return {"true": True, "false": False}.get(value, value)


def extract_islands(markdown, source):
    islands = []

    def replace(match):
        props = {name: coerce(value) for name, value in ATTRIBUTE_PATTERN.findall(match.group(2))}
        islands.append((match.group(1), props))
        return f"{MARKER_PREFIX}{len(islands) - 1}"

    return ISLAND_LINE_PATTERN.sub(replace, markdown), tuple(islands)


def island_html(name, props, following_html):
    code_block = ""
    if name == CODE_ISLAND:
        match = CODE_BLOCK_PATTERN.match(following_html)
        if match is None:
            raise ValueError(f"{CODE_ISLAND} must be followed by a fenced code block")
        code_block = match.group(1)
        props = {**CODE_ISLAND_DEFAULTS, "language": match.group(2), **props}
    data = html.escape(json.dumps(props, sort_keys=True), quote=True)
    return f'<div class="tactus-island" data-island="{name}" data-props="{data}">{code_block}</div>', len(code_block)


def place_islands(page, article_html):
    for index, (name, props) in enumerate(page.islands):
        marker = re.compile(rf"<p>{MARKER_PREFIX}{index}</p>\s*")
        match = marker.search(article_html)
        if match is None:
            raise ValueError(f"{page.href}: island {name} has no mount point in the rendered page")
        island, consumed = island_html(name, props, article_html[match.end() :])
        article_html = article_html[: match.start()] + island + article_html[match.end() + consumed :]
    return article_html


def island_assets_html(page):
    names = {name for name, _ in page.islands}
    assets = ""
    if names - HITL_ISLANDS:
        assets += f'<link rel="stylesheet" href="{ISLAND_STYLESHEET_PATH}"><script defer src="{ISLAND_SCRIPT_PATH}"></script>'
    if names & HITL_ISLANDS:
        assets += (
            f'<link rel="stylesheet" href="{HITL_STYLESHEET_PATH}"><script type="module" src="{HITL_SCRIPT_PATH}"></script>'
        )
    return assets
