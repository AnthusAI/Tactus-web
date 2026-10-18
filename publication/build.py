"""Tactus stdlib and examples pages: Anthus-flavored Markdown through Papyrus and Markus.

Runs after ``gatsby build``. The standard library module pages, example chapter pages and
example pages are written as Markdown from the ingested ``src/data`` files, built with Papyrus
``build_markus_site`` using the header, footer and stylesheet Gatsby exported for the
standard library index, and laid into ``public/`` at their existing URLs.
"""
import argparse
import html
import re
import shutil
import sys
from pathlib import Path

from papyrus_content.markus_renderer.build import build_markus_site
from papyrus_content.markus_renderer.shell import SiteChrome
from papyrus_content.markus_renderer.transforms import FragmentTransform

from publication.authored import load_authored_pages
from publication.catalog import (
    AUTHORED_SECTION,
    CHAPTER_SECTION,
    EXAMPLE_SECTION,
    STDLIB_SECTION,
    load_pages,
    reject_colliding_pages,
)
from publication.chrome import extract_site_furniture, page_frame_html, page_head_extras
from publication.headings import add_heading_ids
from publication.media import book_cover_files

ROOT = Path(__file__).resolve().parent.parent
STAGING_DIRECTORY = ROOT / ".build" / "publication-content"
MARKUS_OUTPUT_DIRECTORY = ROOT / ".build" / "publication-site"
STATIC_DIRECTORY = Path(__file__).resolve().parent / "static"
LEADING_HEADING_PATTERN = re.compile(r"^<h1[^>]*>.*?</h1>\s*", re.DOTALL)
ARTICLE_WRAPPER_PATTERN = re.compile(r"^(<article[^>]*>)(.*)(</article>)\s*$", re.DOTALL)
SITE_URL_PATTERN = re.compile(r"siteUrl: `([^`]+)`")
PLACEHOLDER_ARTICLE_SLUG = "placeholder"
SECTIONS = (STDLIB_SECTION, CHAPTER_SECTION, EXAMPLE_SECTION, AUTHORED_SECTION)


def site_origin(root):
    match = SITE_URL_PATTERN.search((root / "gatsby-config.js").read_text(encoding="utf-8"))
    if match is None:
        raise ValueError("gatsby-config.js: no siteUrl in siteMetadata")
    return match.group(1).rstrip("/")


def staged_markdown(title, body):
    if '"' in title or "\\" in title:
        raise ValueError(f"Titles with quotes or backslashes cannot be staged for Papyrus: {title}")
    return f'---\ntitle: "{title}"\n---\n\n# {title}\n\n{body}\n'


def all_pages(root):
    pages = load_pages(root) + load_authored_pages(root)
    reject_colliding_pages(pages)
    return pages


def stage_content(pages, root):
    shutil.rmtree(STAGING_DIRECTORY, ignore_errors=True)
    (STAGING_DIRECTORY / "articles").mkdir(parents=True)
    (STAGING_DIRECTORY / "articles" / f"{PLACEHOLDER_ARTICLE_SLUG}.md").write_text(
        "# Placeholder\n\nPapyrus requires one article; the publication discards it.\n", encoding="utf-8"
    )
    for section in SECTIONS:
        (STAGING_DIRECTORY / section).mkdir()
    for page in pages:
        (STAGING_DIRECTORY / page.section / f"{page.file_slug}.md").write_text(
            staged_markdown(page.document_title, page.markdown_body), encoding="utf-8"
        )
    shutil.copytree(STATIC_DIRECTORY / "js", STAGING_DIRECTORY / "assets")
    shutil.copy(STATIC_DIRECTORY / "css" / "tactus-publication.css", STAGING_DIRECTORY / "assets")
    shutil.copytree(STATIC_DIRECTORY / "images", STAGING_DIRECTORY / "assets", dirs_exist_ok=True)
    (STAGING_DIRECTORY / "assets" / "books").mkdir()
    for cover in book_cover_files(root):
        shutil.copy(cover, STAGING_DIRECTORY / "assets" / "books")


def build_chrome(furniture, pages_by_href):
    def render_body(context, parts):
        page = pages_by_href.get(context.active_href)
        if page is None:
            return parts.main
        wrapper = ARTICLE_WRAPPER_PATTERN.match(context.fragment.strip())
        if wrapper is None:
            raise ValueError(f"{context.active_href}: Markus did not return one article element")
        open_tag, inner, close_tag = wrapper.groups()
        article_html = open_tag + add_heading_ids(LEADING_HEADING_PATTERN.sub("", inner, count=1)) + close_tag
        return (
            '<div id="___gatsby"><div id="gatsby-focus-wrapper">'
            f'<div class="{furniture.page_class}">{furniture.header_html}{furniture.navigation_html}'
            f'<div class="{furniture.content_class}"><main>{page_frame_html(page, article_html)}</main></div>'
            f"{furniture.footer_html}</div></div></div>{parts.scripts}"
        )

    return SiteChrome(
        site_name="Tactus",
        body_class="tactus-publication-page",
        stylesheets=(),
        scripts=("assets/site-navigation.js",),
        head_html=furniture.head_html,
        title_template="{title} | Tactus",
        same_title_template="{title} | Tactus",
        asset_root="/",
        render_body=render_body,
    )


def destination_for(page, site_directory):
    return Path(site_directory).joinpath(*page.destination_segments, "index.html")


def lay_pages_into_site(pages, origin, site_directory):
    for page in pages:
        built = MARKUS_OUTPUT_DIRECTORY / page.section / f"{page.file_slug}.html"
        destination = destination_for(page, site_directory)
        destination.parent.mkdir(parents=True, exist_ok=True)
        finished = built.read_text(encoding="utf-8").replace("</head>", page_head_extras(page, origin) + "</head>", 1)
        destination.write_text(finished, encoding="utf-8")
        for extra in page.also_written_to:
            (Path(site_directory) / extra).write_text(finished, encoding="utf-8")
    shutil.copytree(MARKUS_OUTPUT_DIRECTORY / "assets", Path(site_directory) / "assets", dirs_exist_ok=True)


def render_publication(root, site_directory):
    pages = all_pages(root)
    pages_by_href = {page.href: page for page in pages}
    furniture = extract_site_furniture(root, site_directory)
    stage_content(pages, root)
    build_markus_site(
        content_dir=STAGING_DIRECTORY,
        out_dir=MARKUS_OUTPUT_DIRECTORY,
        theme=None,
        chrome=build_chrome(furniture, pages_by_href),
        sections=SECTIONS,
        vendor_css=False,
        transform=FragmentTransform(strip_header=True, class_map={"markus-document": "markus-document tactus-article"}),
    )
    lay_pages_into_site(pages, site_origin(root), site_directory)
    return len(pages)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site-directory", type=Path, default=ROOT / "public")
    arguments = parser.parse_args(argv)
    print(f"Rendered {render_publication(ROOT, arguments.site_directory)} pages through Papyrus and Markus")
    return 0


if __name__ == "__main__":
    sys.exit(main())
