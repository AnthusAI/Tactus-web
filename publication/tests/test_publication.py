import json
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

from publication.catalog import fenced_code, load_example_pages, load_pages, load_stdlib_pages, stdlib_module_markdown
from publication.authored import CONTENT_DIRECTORY, build_time_text, fill_placeholders, load_authored_pages, parse_page_file
from publication.chrome import authored_section_list, remove_donor_output, section_html, extract_site_furniture, load_navigation_categories, page_head_extras
from publication.indexes import example_link_markdown, example_snippet_markdown
from publication.islands import extract_islands, place_islands
from publication.media import all_videos_markdown, load_books, load_videos, videos_base_url
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
            donor = Path(directory) / "public" / "publication-donor" / "index.html"
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
            donor = Path(directory) / "public" / "publication-donor" / "index.html"
            donor.parent.mkdir(parents=True)
            donor.write_text("<html><head></head><body></body></html>", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "publication-donor/index.html"):
                extract_site_furniture(directory, Path(directory) / "public")

    def test_removes_the_donor_page_and_its_data_from_the_site(self):
        with tempfile.TemporaryDirectory() as directory:
            site = Path(directory)
            for relative in ("publication-donor/index.html", "page-data/publication-donor/page-data.json", "page-data/other/page-data.json"):
                (site / relative).parent.mkdir(parents=True, exist_ok=True)
                (site / relative).write_text("x", encoding="utf-8")
            remove_donor_output(site)
            self.assertFalse((site / "publication-donor").exists())
            self.assertFalse((site / "page-data" / "publication-donor").exists())
            self.assertTrue((site / "page-data" / "other" / "page-data.json").exists())


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


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
FIXED_TIME = datetime(2026, 10, 18, 17, 46, tzinfo=timezone.utc)


class ExplicitHeadingIdsTest(unittest.TestCase):
    def test_a_trailing_id_becomes_the_heading_id_and_leaves_the_text(self):
        self.assertEqual(add_heading_ids("<h2>All videos {#all}</h2>"), '<h2 id="all">All videos</h2>')

    def test_headings_without_one_keep_the_github_style_id(self):
        self.assertEqual(add_heading_ids("<h2>All videos</h2>"), '<h2 id="all-videos">All videos</h2>')


class MediaTest(unittest.TestCase):
    def test_reads_every_video_and_book_the_gatsby_modules_listed(self):
        self.assertEqual([video["id"] for video in load_videos(REPOSITORY_ROOT)], ["intro", "why-new-language", "guardrails"])
        books = load_books(REPOSITORY_ROOT)
        self.assertEqual(len(books), 3)
        self.assertEqual(books[0]["coverFile"], "learning-tactus.png")

    def test_video_base_url_prefers_the_environment_then_the_content_delivery_network_then_local_files(self):
        self.assertEqual(videos_base_url(REPOSITORY_ROOT, {"GATSBY_VIDEOS_BASE_URL": "https://example.test/v/"}), "https://example.test/v")
        self.assertTrue(videos_base_url(REPOSITORY_ROOT, {}).endswith("/videos"))
        with tempfile.TemporaryDirectory() as directory:
            self.assertEqual(videos_base_url(directory, {}), "/videos")

    def test_every_video_keeps_the_anchor_old_links_use(self):
        markdown = all_videos_markdown(REPOSITORY_ROOT, {})
        for video in load_videos(REPOSITORY_ROOT):
            self.assertIn(f"{{#{video['id']}}}", markdown)

    def test_names_the_module_when_it_changes_shape(self):
        with tempfile.TemporaryDirectory() as directory:
            (Path(directory) / "src" / "content").mkdir(parents=True)
            (Path(directory) / "src" / "content" / "videos.js").write_text("export const VIDEOS = []\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "videos.js: no entries"):
                load_videos(directory)


class AuthoredPagesTest(unittest.TestCase):
    def test_every_authored_page_loads_with_its_destination(self):
        pages = {page.path: page for page in load_authored_pages(REPOSITORY_ROOT, {}, FIXED_TIME)}
        self.assertIn("/404/", pages)
        self.assertEqual(pages["/404/"].also_written_to, ("404.html",))
        self.assertEqual(pages["/use-cases/contact-import/"].file_slug, "use-cases-contact-import")
        self.assertEqual(pages["/videos/"].muted_sections, (1,))
        self.assertEqual(pages["/"].file_slug, "index")
        self.assertEqual(pages["/"].destination_segments, ())

    def test_the_build_time_is_filled_in_as_gatsby_printed_it(self):
        self.assertEqual(build_time_text(FIXED_TIME), "2026-10-18 05:46 pm UTC")
        pages = {page.path: page for page in load_authored_pages(REPOSITORY_ROOT, {}, FIXED_TIME)}
        self.assertIn("built on 2026-10-18 05:46 pm UTC", pages["/using-typescript/"].markdown_body)

    def test_refuses_unknown_placeholders(self):
        with self.assertRaisesRegex(ValueError, "unknown placeholder"):
            fill_placeholders("{{nope}}", {"build-time": lambda *arguments: "x"}, "page.md")

    def test_refuses_front_matter_it_does_not_understand(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "bad.md"
            path.write_text("---\npath: /x/\ntitle: X\nheading: X\ndescription: X\nkind: poster\n---\nBody\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "kind must be one of"):
                parse_page_file(path)
            path.write_text("---\npath: /x/\ntitle: X\nsurprise: 1\n---\nBody\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "unknown front matter"):
                parse_page_file(path)

    def test_no_two_authored_pages_share_a_destination(self):
        destinations = [page.destination_segments for page in load_authored_pages(REPOSITORY_ROOT, {}, FIXED_TIME)]
        self.assertEqual(len(destinations), len(set(destinations)))
        self.assertTrue(list(CONTENT_DIRECTORY.glob("*.md")))


class LandingSectionsTest(unittest.TestCase):
    def landing_page(self, muted):
        page = load_authored_pages(REPOSITORY_ROOT, {}, FIXED_TIME)[0]
        page.kind = "landing"
        page.muted_sections = muted
        return page

    def test_splits_on_rules_and_mutes_the_listed_sections(self):
        article = '<article class="markus-document"><h2>One</h2><hr><h2>Two</h2></article>'
        sections = authored_section_list(self.landing_page((2,)), article)
        rendered = "".join(section_html(*item) for item in sections)
        self.assertEqual(rendered.count("<section"), 2)
        self.assertEqual(rendered.count("tactus-section-muted"), 1)
        self.assertNotIn("<hr", rendered)

    def test_names_the_page_when_a_muted_section_does_not_exist(self):
        article = '<article class="markus-document"><h2>One</h2></article>'
        with self.assertRaisesRegex(ValueError, "sections \\[3\\] do not exist"):
            authored_section_list(self.landing_page((3,)), article)


class IslandsTest(unittest.TestCase):
    def test_lifts_island_lines_into_markers_and_keeps_their_props(self):
        markdown, islands = extract_islands('A\n\n{{island AnimatedCodeBlock label="Agent" blockWidth="1400"}}\n\nB', "page.md")
        self.assertIn("ISLANDMARKER0", markdown)
        self.assertEqual(islands, (("AnimatedCodeBlock", {"label": "Agent", "blockWidth": 1400}),))

    def test_mounts_a_code_island_around_the_code_it_precedes(self):
        page = load_authored_pages(REPOSITORY_ROOT, {}, FIXED_TIME)[0]
        page.islands = (("AnimatedCodeBlock", {"label": "X"}), ("EvaluationsDiagram", {}))
        rendered = place_islands(
            page, '<p>ISLANDMARKER0</p>\n<pre><code class="language-lua">x = 1\n</code></pre><p>ISLANDMARKER1</p>'
        )
        self.assertIn('data-island="AnimatedCodeBlock"', rendered)
        self.assertIn('&quot;language&quot;: &quot;lua&quot;', rendered)
        self.assertIn("<pre><code", rendered.split("</div>")[0])
        self.assertIn('data-island="EvaluationsDiagram" data-props="{}"></div>', rendered)

    def test_names_the_page_when_an_island_has_no_mount_point(self):
        page = load_authored_pages(REPOSITORY_ROOT, {}, FIXED_TIME)[0]
        page.islands = (("EvaluationsDiagram", {}),)
        with self.assertRaisesRegex(ValueError, "no mount point"):
            place_islands(page, "<p>Nothing</p>")


class ExampleSnippetsTest(unittest.TestCase):
    def test_takes_the_code_between_the_snippet_markers_and_links_the_source(self):
        with tempfile.TemporaryDirectory() as directory:
            write_sources(directory)
            example = dict(EXAMPLE, code="a\n-- SNIPPET START\nkeep = 1\n-- SNIPPET END\nz")
            data = {"chapters": [dict(CHAPTER, examples=[example])]}
            (Path(directory) / "src" / "data" / "examples.json").write_text(json.dumps(data), encoding="utf-8")
            self.assertEqual(example_snippet_markdown(directory, "hello"), "```lua\nkeep = 1\n```")
            self.assertEqual(example_link_markdown(directory, "hello"), f"[{EXAMPLE['tacPath']}]({EXAMPLE['githubUrl']})")
            with self.assertRaisesRegex(ValueError, "no example with id"):
                example_snippet_markdown(directory, "missing")


class IconsAndActionsTest(unittest.TestCase):
    def test_places_standalone_and_card_icons(self):
        from publication.icons import place_icons

        html = place_icons('<p>ICON:box</p><span class="markus-card-icon" aria-hidden="true">svg-lock</span>')
        self.assertIn('class="tactus-icon"', html)
        self.assertEqual(html.count("<svg"), 2)
        with self.assertRaisesRegex(ValueError, "No icon named"):
            place_icons("<p>ICON:nope</p>")

    def test_places_availability_chips(self):
        from publication.icons import place_availability_chips

        html = place_availability_chips("<p>AVAILABILITYCHIP:beta</p><p>AVAILABILITYCHIP:early-access</p>")
        self.assertIn('<span class="tactus-availability-chip">Beta</span>', html)
        self.assertIn('<span class="tactus-availability-chip">Early access</span>', html)
        with self.assertRaisesRegex(ValueError, "No availability named"):
            place_availability_chips("<p>AVAILABILITYCHIP:nope</p>")

    def test_turns_a_link_paragraph_into_buttons(self):
        from publication.icons import place_actions

        html = place_actions('<p>ACTIONSMARKER</p>\n<p><a href="/a/">A</a> · <a href="/b/">B</a></p>')
        self.assertIn('<div class="tactus-actions"><a class="tactus-button" href="/a/">A</a><a class="tactus-button tactus-button-secondary" href="/b/">B</a></div>', html)

    def test_marks_the_requested_paragraph_with_a_drop_cap(self):
        from publication.chrome import add_drop_cap

        self.assertEqual(add_drop_cap("<p>a</p><p>b</p>", 2), '<p>a</p><p class="drop-cap">b</p>')
