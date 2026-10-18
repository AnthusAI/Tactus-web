import json
import tempfile
import unittest
from pathlib import Path

from publication.catalog import fenced_code, load_example_pages, load_pages, load_stdlib_pages, stdlib_module_markdown
from publication.chrome import extract_site_furniture, load_navigation_categories, page_head_extras
from publication.build import staged_markdown
from publication.headings import add_heading_ids

STDLIB_MODULE = {
    "id": "generate",
    "name": "Generate Module",
    "slug": "generate",
    "description": "Flexible text generation.",
    "markdown": "# Generate Module\n\nFlexible text generation.\n\n## Overview\n\nBody text.\n",
    "hasSpecs": True,
    "specCount": 1,
    "submodules": [{"name": "Raw", "file": "raw.tac"}],
    "githubUrl": "https://github.com/AnthusAI/Tactus/tree/main/tactus/stdlib/tac/tactus/generate",
}
SECOND_STDLIB_MODULE = dict(STDLIB_MODULE, id="web", name="Web Research", slug="web", hasSpecs=False, specCount=0, submodules=[])
EXAMPLE = {
    "id": "hello",
    "title": "Hello World",
    "slug": "hello-world",
    "description": "Says hello.",
    "code": 'Procedure { output = "hi" }\n```nested```',
    "tacPath": "examples/01-getting-started/01-hello-world.tac",
    "githubUrl": "https://github.com/AnthusAI/Tactus-examples/blob/main/hello.tac",
    "hasSpecs": True,
    "hasEvals": False,
    "requiresApiKeys": True,
}
CHAPTER = {
    "id": "getting-started",
    "title": "Getting Started",
    "slug": "getting-started",
    "description": "First steps.",
    "examples": [EXAMPLE, dict(EXAMPLE, id="again", title="Hello Again", slug="hello-again", requiresApiKeys=False)],
}
OTHER_CHAPTER = dict(CHAPTER, id="agents", title="Agents", slug="agents", examples=[])
NAVIGATION_SOURCE = """
export const NAV_CONFIG = {
  categories: [
    {
      id: "learn-more",
      label: "Learn More",
      to: "/learn-more/",
      items: [
        { label: "Features", to: "/features/" },
      ],
    },
    {
      id: "concepts",
      label: "Concepts",
      // No top-level link
      items: [{ label: "Guiding Principles", to: "/guiding-principles/" }],
    },
    /*
    {
      id: "hidden",
      label: "Hidden",
      items: [{ label: "Nope", to: "/nope/" }],
    },
    */
  ],
}
const NavMenu = () => null
"""


def write_sources(directory):
    data_directory = Path(directory) / "src" / "data"
    data_directory.mkdir(parents=True)
    (data_directory / "stdlib.json").write_text(json.dumps({"modules": [STDLIB_MODULE, SECOND_STDLIB_MODULE]}), encoding="utf-8")
    (data_directory / "examples.json").write_text(json.dumps({"chapters": [CHAPTER, OTHER_CHAPTER]}), encoding="utf-8")


class StdlibPagesTest(unittest.TestCase):
    def test_module_page_keeps_the_ingested_markdown_and_adds_classes_and_quick_start(self):
        body = stdlib_module_markdown(STDLIB_MODULE)
        self.assertNotIn("# Generate Module\n", body.split("## Overview")[0])
        self.assertIn("## Overview", body)
        self.assertIn("- [Raw](https://github.com/AnthusAI/Tactus/tree/main/tactus/stdlib/tac/tactus/generate/raw.tac) (`raw.tac`)", body)
        self.assertIn('local generate = require("tactus.generate")', body)
        self.assertIn("tactus test tactus/stdlib/tac/tactus/generate.spec.tac", body)

    def test_module_without_specs_or_classes_leaves_those_sections_out(self):
        body = stdlib_module_markdown(SECOND_STDLIB_MODULE)
        self.assertNotIn("## Classes", body)
        self.assertNotIn("Run the specs", body)

    def test_pages_link_to_their_neighbors_and_keep_the_old_title(self):
        with tempfile.TemporaryDirectory() as directory:
            write_sources(directory)
            first, second = load_stdlib_pages(directory)
        self.assertEqual(first.document_title, "Generate Module - Standard Library")
        self.assertEqual(first.path, "/stdlib/generate/")
        self.assertIsNone(first.previous)
        self.assertEqual(first.following.path, "/stdlib/web/")
        self.assertEqual(second.previous.title, "Generate Module")
        self.assertEqual([badge.text for badge in first.badges], ["1 spec", "1 class"])


class ExamplePagesTest(unittest.TestCase):
    def test_chapter_and_example_pages_keep_their_urls_and_titles(self):
        with tempfile.TemporaryDirectory() as directory:
            write_sources(directory)
            pages = {page.path: page for page in load_example_pages(directory)}
        self.assertEqual(
            sorted(pages),
            [
                "/examples/agents/",
                "/examples/getting-started/",
                "/examples/getting-started/hello-again/",
                "/examples/getting-started/hello-world/",
            ],
        )
        example = pages["/examples/getting-started/hello-world/"]
        self.assertEqual(example.document_title, "Hello World - Getting Started Examples")
        self.assertEqual(example.following.path, "/examples/getting-started/hello-again/")
        self.assertEqual([badge.text for badge in example.badges], ["Has Specs", "Requires API Keys"])
        self.assertIn("OPENAI_API_KEY", example.markdown_body)
        self.assertEqual(pages["/examples/getting-started/"].document_title, "Getting Started Examples")

    def test_source_code_fence_is_longer_than_any_backtick_run_inside_it(self):
        fenced = fenced_code("a ```b``` c", "lua")
        self.assertTrue(fenced.startswith("````lua\n"))
        self.assertTrue(fenced.endswith("\n````"))

    def test_refuses_pages_that_would_collide_in_the_markus_output(self):
        colliding_chapters = [
            dict(CHAPTER, slug="a", examples=[dict(EXAMPLE, slug="b-c")]),
            dict(CHAPTER, slug="a-b", examples=[dict(EXAMPLE, slug="c")]),
        ]
        with tempfile.TemporaryDirectory() as directory:
            write_sources(directory)
            (Path(directory) / "src" / "data" / "examples.json").write_text(json.dumps({"chapters": colliding_chapters}), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "collide"):
                load_pages(directory)

    def test_names_the_ingest_command_when_a_data_file_is_missing(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(FileNotFoundError, "stdlib:ingest"):
                load_stdlib_pages(directory)


class StagedMarkdownTest(unittest.TestCase):
    def test_carries_the_title_papyrus_reads_for_the_page_title(self):
        self.assertEqual(staged_markdown("Hello", "Body."), '---\ntitle: "Hello"\n---\n\n# Hello\n\nBody.\n')

    def test_refuses_titles_papyrus_would_misread(self):
        with self.assertRaisesRegex(ValueError, "quotes or backslashes"):
            staged_markdown('Say "hi"', "Body.")


class HeadingIdsTest(unittest.TestCase):
    def test_numbers_repeated_headings_like_github(self):
        self.assertEqual(
            add_heading_ids("<h2>Run it</h2><h2>Run it</h2>"),
            '<h2 id="run-it">Run it</h2><h2 id="run-it-1">Run it</h2>',
        )


class NavigationTest(unittest.TestCase):
    def test_reads_categories_and_skips_commented_out_ones(self):
        with tempfile.TemporaryDirectory() as directory:
            source_directory = Path(directory) / "src" / "components"
            source_directory.mkdir(parents=True)
            (source_directory / "nav-menu.js").write_text(NAVIGATION_SOURCE, encoding="utf-8")
            categories = load_navigation_categories(directory)
        self.assertEqual(
            categories,
            [
                ("Learn More", "/learn-more/", [("Features", "/features/")]),
                ("Concepts", "", [("Guiding Principles", "/guiding-principles/")]),
            ],
        )


DONOR_HTML = (
    '<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/>'
    '<meta name="viewport" content="width=device-width"/><meta name="theme-color" content="#c7007e"/>'
    '<style data-href="/styles.css" data-identity="gatsby-global-css">'
    ".layout-module--contentFull--f8f12{margin:0}"
    ".nav-menu-module--navMenu--c15df{x:1}.nav-menu-module--navMenuInner--20f5b{x:1}"
    ".nav-menu-module--navCategories--7388c{x:1}.nav-menu-module--navCategory--a759d{x:1}"
    ".nav-menu-module--navCategoryLabel--8fde5{x:1}.nav-menu-module--navCategoryItems--0aa39{x:1}"
    ".nav-menu-module--navCategoryItem--3007b{x:1}</style>"
    '<link rel="icon" href="/favicon.png"/></head><body><div id="___gatsby"><div id="gatsby-focus-wrapper">'
    '<div class="layout-module--page--8d91a"><header class="header-module--header--666b3">'
    '<button class="header-module--menuToggle--b0496" aria-label="Toggle navigation menu" aria-expanded="false">m</button>'
    '</header><main>x</main><footer style="width:100%">Footer</footer></div></div></div></body></html>'
)


class SiteFurnitureTest(unittest.TestCase):
    def test_reuses_the_header_footer_and_stylesheet_gatsby_exported(self):
        with tempfile.TemporaryDirectory() as directory:
            source_directory = Path(directory) / "src" / "components"
            source_directory.mkdir(parents=True)
            (source_directory / "nav-menu.js").write_text(NAVIGATION_SOURCE, encoding="utf-8")
            donor = Path(directory) / "public" / "stdlib" / "index.html"
            donor.parent.mkdir(parents=True)
            donor.write_text(DONOR_HTML, encoding="utf-8")
            furniture = extract_site_furniture(directory, Path(directory) / "public")
        self.assertEqual(furniture.page_class, "layout-module--page--8d91a")
        self.assertEqual(furniture.content_class, "layout-module--contentFull--f8f12")
        self.assertIn('aria-controls="site-navigation-menu"', furniture.header_html)
        self.assertIn("Footer", furniture.footer_html)
        self.assertIn("nav-menu-module--navMenu--c15df", furniture.navigation_html)
        self.assertIn('href="/features/"', furniture.navigation_html)
        self.assertIn("/assets/tactus-publication.css", furniture.head_html)

    def test_names_the_donor_page_when_it_stops_carrying_what_the_pages_reuse(self):
        with tempfile.TemporaryDirectory() as directory:
            donor = Path(directory) / "public" / "stdlib" / "index.html"
            donor.parent.mkdir(parents=True)
            donor.write_text("<html><head></head><body></body></html>", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "stdlib/index.html"):
                extract_site_furniture(directory, Path(directory) / "public")


class PageHeadTest(unittest.TestCase):
    def test_social_tags_carry_the_site_suffixed_title_and_description(self):
        with tempfile.TemporaryDirectory() as directory:
            write_sources(directory)
            page = load_stdlib_pages(directory)[0]
        head = page_head_extras(page, "https://example.test")
        self.assertIn('property="og:title" content="Generate Module - Standard Library | Tactus"', head)
        self.assertIn('name="description" content="Flexible text generation."', head)
        self.assertIn("https://example.test/og/icon.png", head)


if __name__ == "__main__":
    unittest.main()
