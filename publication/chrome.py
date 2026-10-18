import html
import json
import re
from dataclasses import dataclass
from pathlib import Path

DONOR_PAGE = "stdlib/index.html"
NAVIGATION_SOURCE_PATH = "src/components/nav-menu.js"
SITE_NAME = "Tactus"

HEAD_FRAGMENT_PATTERNS = (
    re.compile(r"<meta charSet=[^>]*/?>"),
    re.compile(r'<meta name="viewport"[^>]*/?>'),
    re.compile(r'<meta name="theme-color"[^>]*/?>'),
    re.compile(r'<link rel="(?:icon|manifest|apple-touch-icon)"[^>]*/?>'),
    re.compile(r"<style[^>]*>.*?</style>", re.DOTALL),
)
HEADER_PATTERN = re.compile(r'<header class="header-module--header.*?</header>', re.DOTALL)
FOOTER_PATTERN = re.compile(r"<footer style=.*?</footer>", re.DOTALL)
PAGE_CLASS_PATTERN = re.compile(r'<div class="(layout-module--page--[0-9a-f]+)"')
CONTENT_CLASS_PATTERN = re.compile(r"\.(layout-module--contentFull--[0-9a-f]+)")
MENU_TOGGLE_PATTERN = re.compile(r'<button class="header-module--menuToggle[^>]*>')
NAVIGATION_CLASS_NAMES = (
    "navMenu",
    "navMenuInner",
    "navCategories",
    "navCategory",
    "navCategoryLabel",
    "navCategoryItems",
    "navCategoryItem",
)
NAVIGATION_CATEGORY_PATTERN = re.compile(
    r'\{\s*id: "[^"]+",\s*label: "([^"]+)",(?:\s*to: "([^"]+)",)?\s*items: \[(.*?)\],?\s*\}',
    re.DOTALL,
)
NAVIGATION_ITEM_PATTERN = re.compile(r'\{ label: "([^"]+)", to: "([^"]+)" \}')
COMMENT_PATTERN = re.compile(r"/\*.*?\*/|//[^\n]*", re.DOTALL)
FURNITURE_STYLESHEET_PATH = "/assets/tactus-publication.css"
FURNITURE_SCRIPT_PATH = "/assets/site-navigation.js"
ARTICLE_WRAPPER_PATTERN = re.compile(r"^(<article[^>]*>)(.*)(</article>)\s*$", re.DOTALL)
SECTION_SEPARATOR_PATTERN = re.compile(r"<hr\s*/?>")


@dataclass(frozen=True)
class SiteFurniture:
    head_html: str
    page_class: str
    content_class: str
    header_html: str
    footer_html: str
    navigation_html: str


def load_navigation_categories(root):
    source = (Path(root) / NAVIGATION_SOURCE_PATH).read_text(encoding="utf-8")
    configuration = COMMENT_PATTERN.sub("", source[source.index("NAV_CONFIG") : source.index("const NavMenu")])
    categories = []
    for label, destination, items_source in NAVIGATION_CATEGORY_PATTERN.findall(configuration):
        items = NAVIGATION_ITEM_PATTERN.findall(items_source)
        if destination or items:
            categories.append((label, destination, items))
    if not categories:
        raise ValueError(f"{NAVIGATION_SOURCE_PATH}: no navigation categories found; has NAV_CONFIG changed shape?")
    return categories


def navigation_html(root, stylesheet_text):
    class_names = {}
    for name in NAVIGATION_CLASS_NAMES:
        match = re.search(rf"\.(nav-menu-module--{name}--[0-9a-f]+)", stylesheet_text)
        if match is None:
            raise ValueError(f"The exported stylesheet has no nav-menu-module--{name} class to reuse")
        class_names[name] = match.group(1)
    sections = []
    for label, destination, items in load_navigation_categories(root):
        label_html = (
            f'<a href="{html.escape(destination, quote=True)}">{html.escape(label)}</a>' if destination else html.escape(label)
        )
        item_html = "".join(
            f'<li class="{class_names["navCategoryItem"]}">'
            f'<a href="{html.escape(item_destination, quote=True)}">{html.escape(item_label)}</a></li>'
            for item_label, item_destination in items
        )
        sections.append(
            f'<section class="{class_names["navCategory"]}">'
            f'<h2 class="{class_names["navCategoryLabel"]}">{label_html}</h2>'
            f'<ul class="{class_names["navCategoryItems"]}">{item_html}</ul></section>'
        )
    return (
        f'<div class="{class_names["navMenu"]}" id="site-navigation-menu" hidden>'
        f'<div class="{class_names["navMenuInner"]}"><div class="{class_names["navCategories"]}">'
        f'{"".join(sections)}</div></div></div>'
    )


def extract_site_furniture(root, exported_site_directory):
    donor = (Path(exported_site_directory) / DONOR_PAGE).read_text(encoding="utf-8")
    head = donor[: donor.index("</head>")]
    head_fragments = [match.group(0) for pattern in HEAD_FRAGMENT_PATTERNS for match in pattern.finditer(head)]
    header = HEADER_PATTERN.search(donor)
    footer = FOOTER_PATTERN.search(donor)
    page_class = PAGE_CLASS_PATTERN.search(donor)
    stylesheet = re.search(r"<style data-href[^>]*>(.*?)</style>", head, re.DOTALL)
    content_class = CONTENT_CLASS_PATTERN.search(stylesheet.group(1)) if stylesheet else None
    if not (head_fragments and header and footer and page_class and stylesheet and content_class):
        raise ValueError(f"{DONOR_PAGE} no longer carries the header, footer and stylesheet to reuse")
    toggle_with_controls = MENU_TOGGLE_PATTERN.sub(
        lambda match: match.group(0).replace("<button ", '<button aria-controls="site-navigation-menu" ', 1),
        header.group(0),
        count=1,
    )
    return SiteFurniture(
        head_html="".join(head_fragments) + f'<link rel="stylesheet" href="{FURNITURE_STYLESHEET_PATH}">',
        page_class=page_class.group(1),
        content_class=content_class.group(1),
        header_html=toggle_with_controls,
        footer_html=footer.group(0),
        navigation_html=navigation_html(root, stylesheet.group(1)),
    )


def page_head_extras(page, site_origin):
    title = html.escape(f"{page.document_title} | {SITE_NAME}", quote=True)
    description = html.escape(page.description, quote=True)
    return (
        f'<meta name="description" content="{description}">'
        f'<meta property="og:title" content="{title}">'
        f'<meta property="og:description" content="{description}">'
        '<meta property="og:type" content="website">'
        f'<meta property="og:image" content="{site_origin}/og/icon.png">'
        '<meta name="twitter:card" content="summary">'
        '<meta name="twitter:creator" content="@AnthusAI">'
        f'<meta name="twitter:title" content="{title}">'
        f'<meta name="twitter:description" content="{description}">'
        f'<meta name="twitter:image" content="{site_origin}/og/icon.png">'
    )


def badges_html(badges):
    if not badges:
        return ""
    items = "".join(
        f'<span class="tactus-badge{" tactus-badge-warning" if badge.warning else ""}">{html.escape(badge.text)}</span>'
        for badge in badges
    )
    return f'<div class="tactus-badges">{items}</div>'


def breadcrumb_html(page):
    links = "".join(f'<a href="{html.escape(path, quote=True)}">{html.escape(label)}</a> / ' for label, path in page.breadcrumb)
    return f'<p class="tactus-eyebrow">{links}{html.escape(page.heading)}</p>'


def neighbor_html(link, extra_class=""):
    return (
        f'<a class="tactus-neighbor{extra_class}" href="{html.escape(link.path, quote=True)}">'
        f'<span class="tactus-neighbor-label">{html.escape(link.label)}</span>'
        f'<span class="tactus-neighbor-title">{html.escape(link.title)}</span></a>'
    )


def neighbors_html(page):
    if not (page.previous or page.following):
        return ""
    previous = neighbor_html(page.previous) if page.previous else "<div></div>"
    following = neighbor_html(page.following, " tactus-neighbor-next") if page.following else ""
    return f'<section class="tactus-section"><div class="tactus-container"><div class="tactus-neighbors">{previous}{following}</div></div></section>'


def call_to_action_html(page):
    action = page.call_to_action
    return (
        '<section class="tactus-section"><div class="tactus-container"><div class="tactus-call-to-action">'
        f'<h2>{html.escape(action["title"])}</h2><p>{html.escape(action["text"])}</p>'
        f'<a class="tactus-button" href="{html.escape(action["to"], quote=True)}">{html.escape(action["label"])}</a>'
        "</div></div></section>"
    )


def authored_hero_html(page):
    eyebrow = f'<p class="tactus-eyebrow">{html.escape(page.eyebrow)}</p>' if page.eyebrow else ""
    lede = f'<p class="tactus-lede">{html.escape(page.lede)}</p>' if page.lede else ""
    return (
        '<section class="tactus-section"><div class="tactus-container"><div class="tactus-hero">'
        f"{eyebrow}<h1>{html.escape(page.heading)}</h1>{lede}</div></div></section>"
    )


def authored_sections_html(page, article_html):
    wrapper = ARTICLE_WRAPPER_PATTERN.match(article_html.strip())
    if wrapper is None:
        raise ValueError(f"{page.href}: expected one article element")
    open_tag, inner, close_tag = wrapper.groups()
    parts = SECTION_SEPARATOR_PATTERN.split(inner) if page.kind == "landing" else [inner]
    out_of_range = [number for number in page.muted_sections if not 1 <= number <= len(parts)]
    if out_of_range:
        raise ValueError(f"{page.href}: muted sections {out_of_range} do not exist; the page has {len(parts)} sections")
    sections = []
    for number, part in enumerate(parts, start=1):
        muted = " tactus-section-muted" if number in page.muted_sections else ""
        sections.append(
            f'<section class="tactus-section{muted}"><div class="tactus-container">{open_tag}{part}{close_tag}</div></section>'
        )
    return "".join(sections)


def authored_frame_html(page, article_html):
    action = call_to_action_html(page) if page.call_to_action else ""
    return (
        f'<div class="tactus-publication tactus-kind-{page.kind}">'
        f"{authored_hero_html(page)}{authored_sections_html(page, article_html)}{action}</div>"
    )


def page_frame_html(page, article_html):
    if page.kind in ("landing", "prose"):
        return authored_frame_html(page, article_html)
    return (
        f'<div class="tactus-publication tactus-kind-{page.kind}">'
        '<section class="tactus-section"><div class="tactus-container"><div class="tactus-hero">'
        f'{breadcrumb_html(page)}<h1>{html.escape(page.heading)}</h1>{badges_html(page.badges)}'
        f'<p class="tactus-lede">{html.escape(page.lede)}</p></div></div></section>'
        f'<section class="tactus-section tactus-section-muted"><div class="tactus-container">{article_html}</div></section>'
        f"{neighbors_html(page)}{call_to_action_html(page)}</div>"
    )
