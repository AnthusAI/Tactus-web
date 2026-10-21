import json
import os
import re
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

import shutil

from publication.authored import authored_files, build_time_text, fill_placeholders
from publication.build import public_url, stage_content
from publication.catalog import (
    fenced_code,
    load_example_pages,
    load_pages,
    load_stdlib_pages,
    page_markdown,
    plain_markdown,
    reject_colliding_pages,
    stdlib_module_markdown,
)
from publication.indexes import example_link_markdown, example_snippet_markdown
from publication.media import all_videos_markdown, load_books, load_videos, videos_base_url

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
FIXED_TIME = datetime(2026, 10, 18, 17, 46, tzinfo=timezone.utc)

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

    def test_refuses_pages_that_would_collide_in_the_content_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            write_sources(directory)
            pages = load_pages(directory)
            with self.assertRaisesRegex(ValueError, "collide"):
                reject_colliding_pages(pages, ["stdlib/web.md"])

    def test_names_the_ingest_command_when_a_data_file_is_missing(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(FileNotFoundError, "stdlib:ingest"):
                load_stdlib_pages(directory)



class PageMarkdownTest(unittest.TestCase):
    def pages(self):
        with tempfile.TemporaryDirectory() as directory:
            write_sources(directory)
            return {page.path: page for page in load_pages(directory)}

    def test_a_module_page_is_blocks_for_papyrus(self):
        text = page_markdown(self.pages()["/stdlib/generate/"])
        front_matter, body = text.split("\n---\n", 1)
        self.assertIn("title: Generate Module - Standard Library", front_matter)
        self.assertIn("type: page", front_matter)
        self.assertTrue(body.startswith('::band{columns="document-hero"}\n\n[Standard Library](/stdlib/) / Generate Module\n\n# Generate Module\n\n- 1 spec\n- 1 class'))
        self.assertIn('::band{tone="muted"}\n', body)
        self.assertIn('::band{columns="neighbors"}\n\n-\n- [*Next Module →* **Web Research**](/stdlib/web/)', body)
        self.assertIn('::button{href="/stdlib/" label="View All Modules" size="lg"}', body)

    def test_an_example_page_gets_the_example_layout_and_warns_about_keys(self):
        text = page_markdown(self.pages()["/examples/getting-started/hello-world/"])
        self.assertIn('::band{columns="document-hero wide"}', text)
        self.assertIn('::band{tone="muted" columns="example"}', text)
        self.assertIn("- **Requires API Keys**", text)

    def test_the_first_page_of_a_series_has_an_empty_previous_slot(self):
        text = page_markdown(self.pages()["/stdlib/generate/"])
        self.assertIn("-\n- [*Next Module", text)

    def test_ledes_show_literally_in_one_line(self):
        self.assertEqual(plain_markdown("Shows:\n- a `x` and *y*"), "Shows: - a \\`x\\` and \\*y\\*")

    def test_titles_with_quotes_are_safe_front_matter(self):
        page = self.pages()["/stdlib/web/"]
        page.document_title = 'Say "hi": now'
        self.assertIn('title: \'Say "hi": now\'', page_markdown(page))


class StagingTest(unittest.TestCase):
    def prepare(self, directory):
        root = Path(directory)
        write_sources(root)
        (root / "content").mkdir()
        (root / "content" / "about.md").write_text("---\ntitle: About\ntype: page\n---\n::band\n# About {{build-time}}\n", encoding="utf-8")
        (root / "content" / "stdlib.md").write_text("---\ntitle: Std\ntype: page\n---\n::band\n{{stdlib-modules}}\n", encoding="utf-8")
        (root / "data").mkdir()
        (root / "data" / "videos.json").write_text("[]", encoding="utf-8")
        return root

    def test_stages_authored_pages_with_placeholders_filled_and_generated_pages_beside_them(self):
        with tempfile.TemporaryDirectory() as directory:
            root = self.prepare(directory)
            staging = root / "staging"
            counts = stage_content(root, staging)
            self.assertEqual(counts, (2, 6))
            self.assertIn("# About 20", (staging / "about.md").read_text(encoding="utf-8"))
            self.assertIn(':::card{title="Generate Module"}', (staging / "stdlib.md").read_text(encoding="utf-8"))
            self.assertTrue((staging / "examples" / "getting-started" / "hello-world.md").is_file())
            self.assertTrue((staging / "stdlib" / "web.md").is_file())

    def test_refuses_an_authored_page_where_a_generated_page_goes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = self.prepare(directory)
            (root / "content" / "stdlib").mkdir()
            (root / "content" / "stdlib" / "web.md").write_text("---\ntitle: X\n---\nX\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "collide"):
                stage_content(root, root / "staging")

    def test_production_is_the_default_origin_and_previews_get_their_own(self):
        self.assertEqual(public_url({}), "https://tactus.anth.us")
        self.assertEqual(public_url({"AWS_BRANCH": "main", "AWS_APP_ID": "abc"}), "https://tactus.anth.us")
        self.assertEqual(public_url({"AWS_BRANCH": "feature/x", "AWS_APP_ID": "abc"}), "https://feature-x.abc.amplifyapp.com")
        self.assertEqual(public_url({"PAPYRUS_SITE_PUBLIC_URL": "http://localhost:8000"}), "http://localhost:8000")


class AuthoredContentTest(unittest.TestCase):
    def test_every_authored_page_has_front_matter_and_starts_with_a_band(self):
        files = authored_files(REPOSITORY_ROOT)
        self.assertGreater(len(files), 30)
        for path in files:
            text = path.read_text(encoding="utf-8")
            self.assertTrue(text.startswith("---\n"), path.name)
            front_matter, body = text[4:].split("\n---\n", 1)
            self.assertIn("title:", front_matter, path.name)
            self.assertIn("type: page", front_matter, path.name)
            self.assertTrue(body.startswith("::band"), f"{path.name} must start with a ::band line")

    def test_no_page_still_uses_the_pre_papyrus_syntax(self):
        for path in authored_files(REPOSITORY_ROOT):
            text = path.read_text(encoding="utf-8")
            self.assertNotIn("{{island", text, path.name)
            self.assertNotIn("{{actions}}", text, path.name)

    def test_every_placeholder_is_known(self):
        known = {"build-time", "videos-featured", "video-embed", "video-player", "videos-all", "videos-catalog", "example-code", "example-snippet", "example-link", "icon", "availability-chip", "stdlib-modules", "example-chapters", "books"}
        for path in authored_files(REPOSITORY_ROOT):
            for name in re.findall(r"\{\{([a-z0-9-]+)", path.read_text(encoding="utf-8")):
                self.assertIn(name, known, path.name)

    def test_refuses_unknown_placeholders(self):
        with self.assertRaisesRegex(ValueError, "unknown placeholder"):
            fill_placeholders("{{nope}}", {"build-time": lambda *arguments: "x"}, "page.md")

    def test_the_build_time_is_printed_as_before(self):
        self.assertEqual(build_time_text(FIXED_TIME), "2026-10-18 05:46 pm UTC")


class MediaTest(unittest.TestCase):
    def test_reads_every_video_and_book(self):
        self.assertEqual([video["id"] for video in load_videos(REPOSITORY_ROOT)], ["intro", "why-new-language", "guardrails"])
        books = load_books(REPOSITORY_ROOT)
        self.assertEqual(len(books), 3)
        self.assertEqual(books[0]["coverFile"], "learning-tactus.png")
        for book in books:
            self.assertTrue((REPOSITORY_ROOT / "web" / "assets" / "books" / book["coverFile"]).is_file())

    def test_video_base_url_prefers_the_environment_then_the_content_delivery_network_then_local_files(self):
        self.assertEqual(videos_base_url(REPOSITORY_ROOT, {"VIDEOS_BASE_URL": "https://example.test/v/"}), "https://example.test/v")
        self.assertTrue(videos_base_url(REPOSITORY_ROOT, {}).endswith("/videos"))
        with tempfile.TemporaryDirectory() as directory:
            self.assertEqual(videos_base_url(directory, {}), "/videos")

    def test_every_video_keeps_the_anchor_old_links_use(self):
        markdown = all_videos_markdown(REPOSITORY_ROOT, {})
        for video in load_videos(REPOSITORY_ROOT):
            self.assertIn(f"{{#{video['id']}}}", markdown)

    def test_names_the_file_when_it_changes_shape(self):
        with tempfile.TemporaryDirectory() as directory:
            (Path(directory) / "data").mkdir()
            (Path(directory) / "data" / "videos.json").write_text('[{"id": "x"}]', encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "videos.json: entry x lacks"):
                load_videos(directory)


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


class IconsTest(unittest.TestCase):
    def setUp(self):
        sys.path.insert(0, str(REPOSITORY_ROOT / "web"))
        self.addCleanup(sys.path.remove, str(REPOSITORY_ROOT / "web"))

    def test_places_standalone_and_card_icons(self):
        from site_icons import place_icons

        html = place_icons('<p>ICON:box</p><span class="markus-card-icon" aria-hidden="true">svg-lock</span>')
        self.assertIn('class="tactus-icon"', html)
        self.assertEqual(html.count("<svg"), 2)
        with self.assertRaisesRegex(ValueError, "No icon named"):
            place_icons("<p>ICON:nope</p>")

    def test_places_availability_chips(self):
        from site_icons import place_availability_chips

        html = place_availability_chips("<p>AVAILABILITYCHIP:beta</p><p>AVAILABILITYCHIP:early-access</p>")
        self.assertIn('<span class="tactus-availability-chip">Beta</span>', html)
        self.assertIn('<span class="tactus-availability-chip">Early access</span>', html)
        with self.assertRaisesRegex(ValueError, "No availability named"):
            place_availability_chips("<p>AVAILABILITYCHIP:nope</p>")


class RenderedSiteTest(unittest.TestCase):
    """The staged content goes through Papyrus with the site's own settings, theme and hooks."""

    def test_pages_render_with_blocks_islands_the_family_footer_and_the_hook(self):
        from papyrus_content.project_commands import content_project

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            write_sources(root)
            (root / "data").mkdir()
            (root / "data" / "videos.json").write_text("[]", encoding="utf-8")
            (root / "content").mkdir()
            (root / "content" / "index.md").write_text(
                "---\ntitle: Home\ndescription: Home page.\ntype: page\n---\n::band\n# Home\n\n{{icon box}}\n\n"
                '::island{name="InstallCommand"}\n\n::button{href="/stdlib/" label="Go"}\n',
                encoding="utf-8",
            )
            stage_content(root, root / "staging")
            web = root / "web"
            shutil.copytree(REPOSITORY_ROOT / "web", web, ignore=shutil.ignore_patterns("books", "animals", "logos", "chunks"))
            (web / "assets").mkdir(exist_ok=True)
            (web / "assets" / "islands.js").write_text("window.papyrusIslands = {}\n", encoding="utf-8")
            (web / "assets" / "islands.css").write_text("\n", encoding="utf-8")
            output = root / "out"
            os.environ["PAPYRUS_SITE_PUBLIC_URL"] = "https://tactus.anth.us"
            content_project(["--all", "--from-dir", str(root / "staging"), "--static-dir", str(web), "--out", str(output)])
            home = (output / "index.html").read_text(encoding="utf-8")
            self.assertIn("<title>Home | Tactus</title>", home)
            self.assertIn('class="tactus-icon"', home)
            self.assertIn('data-island="InstallCommand"', home)
            self.assertIn('class="markus-button"', home)
            self.assertIn("papyrus-family-footer", home)
            self.assertIn('rel="canonical" href="https://tactus.anth.us/"', home)
            page = (output / "examples" / "getting-started" / "hello-world" / "index.html").read_text(encoding="utf-8")
            self.assertIn("<title>Hello World - Getting Started Examples | Tactus</title>", page)
            self.assertIn('data-layout="document-hero wide"', page)
            sitemap = (output / "sitemap.xml").read_text(encoding="utf-8")
            self.assertIn("https://tactus.anth.us/stdlib/web/", sitemap)
            self.assertIn("https://tactus.anth.us/examples/getting-started/hello-world/", sitemap)


if __name__ == "__main__":
    unittest.main()
