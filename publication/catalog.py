import json
import re
from dataclasses import dataclass, field
from pathlib import Path

SITE_NAME = "Tactus"
STDLIB_SOURCE_PATH = "src/data/stdlib.json"
EXAMPLES_SOURCE_PATH = "src/data/examples.json"
STDLIB_SECTION = "stdlib"
CHAPTER_SECTION = "example-chapters"
EXAMPLE_SECTION = "examples"
EXAMPLE_FILE_SEPARATOR = "-"
STDLIB_PATH_INSIDE_TACTUS_REPOSITORY = "tactus/stdlib/tac/tactus"
LEADING_TITLE_PATTERN = re.compile(r"\A\s*# [^\n]*\n+")


@dataclass
class NeighborLink:
    label: str
    title: str
    path: str


@dataclass
class Badge:
    text: str
    warning: bool = False


@dataclass
class Page:
    section: str
    file_slug: str
    destination_segments: tuple
    document_title: str
    heading: str
    description: str
    lede: str
    breadcrumb: list
    badges: list
    markdown_body: str
    kind: str = ""
    previous: NeighborLink = None
    following: NeighborLink = None
    call_to_action: dict = field(default_factory=dict)

    @property
    def href(self):
        return f"{self.section}/{self.file_slug}.html"

    @property
    def path(self):
        return "/" + "/".join(self.destination_segments) + "/"


def fenced_code(code, language):
    longest_backtick_run = max((len(run) for run in re.findall(r"`+", code)), default=0)
    fence = "`" * max(3, longest_backtick_run + 1)
    return f"{fence}{language}\n{code.strip()}\n{fence}"


def read_source(root, relative_path, ingest_command):
    path = Path(root) / relative_path
    if not path.exists():
        raise FileNotFoundError(f"{relative_path} is missing; run `npm run {ingest_command}` first")
    return json.loads(path.read_text(encoding="utf-8"))


def count_label(count, singular, plural):
    return f"{count} {singular if count == 1 else plural}"


def stdlib_module_markdown(module):
    body = LEADING_TITLE_PATTERN.sub("", module["markdown"], count=1).strip()
    sections = [body]
    if module["submodules"]:
        class_lines = [
            f"- [{submodule['name']}]({module['githubUrl']}/{submodule['file']}) (`{submodule['file']}`)"
            for submodule in module["submodules"]
        ]
        sections.append("## Classes\n\n" + "\n".join(class_lines))
    quick_start = [
        "## Quick Start",
        "Load the module:",
        fenced_code(f'local {module["slug"]} = require("tactus.{module["slug"]}")', "lua"),
    ]
    if module["hasSpecs"]:
        quick_start += [
            "Run the specs:",
            fenced_code(f'tactus test {STDLIB_PATH_INSIDE_TACTUS_REPOSITORY}/{module["slug"]}.spec.tac', "bash"),
        ]
    quick_start.append(f"[View source on GitHub →]({module['githubUrl']})")
    sections.append("\n\n".join(quick_start))
    return "\n\n".join(section for section in sections if section)


def load_stdlib_pages(root):
    modules = read_source(root, STDLIB_SOURCE_PATH, "stdlib:ingest")["modules"]
    pages = []
    for index, module in enumerate(modules):
        previous_module = modules[index - 1] if index > 0 else None
        next_module = modules[index + 1] if index < len(modules) - 1 else None
        badges = []
        if module["hasSpecs"]:
            badges.append(Badge(count_label(module["specCount"], "spec", "specs")))
        badges.append(Badge(count_label(len(module["submodules"]), "class", "classes")))
        pages.append(
            Page(
                kind="module",
                section=STDLIB_SECTION,
                file_slug=module["slug"],
                destination_segments=("stdlib", module["slug"]),
                document_title=f"{module['name']} - Standard Library",
                heading=module["name"],
                description=module["description"],
                lede=module["description"],
                breadcrumb=[("Standard Library", "/stdlib/")],
                badges=badges,
                markdown_body=stdlib_module_markdown(module),
                previous=previous_module
                and NeighborLink("← Previous Module", previous_module["name"], f"/stdlib/{previous_module['slug']}/"),
                following=next_module
                and NeighborLink("Next Module →", next_module["name"], f"/stdlib/{next_module['slug']}/"),
                call_to_action={
                    "title": "Explore more modules",
                    "text": "The standard library includes modules for classification, extraction, generation, and more.",
                    "label": "View All Modules",
                    "to": "/stdlib/",
                },
            )
        )
    return pages


def example_badges(example):
    badges = []
    if example["hasSpecs"]:
        badges.append(Badge("Has Specs"))
    if example["hasEvals"]:
        badges.append(Badge("Has Evals"))
    if example["requiresApiKeys"]:
        badges.append(Badge("Requires API Keys", warning=True))
    return badges


def chapter_markdown(chapter):
    entries = []
    for example in chapter["examples"]:
        flags = "".join(f" · {badge.text}" for badge in example_badges(example))
        entries.append(
            f"### [{example['title']}](/examples/{chapter['slug']}/{example['slug']}/)\n\n"
            f"{example['description']}\n\n*{flags.lstrip(' ·') or 'Example'}*"
        )
    return "## Examples in This Chapter\n\n" + "\n\n".join(entries)


def example_markdown(example):
    sections = [
        "## Source Code\n\n" + fenced_code(example["code"], "lua"),
        "## Quick Start\n\nRun the example:\n\n"
        + fenced_code(f"tactus run {example['tacPath']}", "bash")
        + "\n\nTest with mocks:\n\n"
        + fenced_code(f"tactus test {example['tacPath']} --mock", "bash"),
    ]
    if example["requiresApiKeys"]:
        sections.append(
            "> **Note.** This example requires API keys. Set your `OPENAI_API_KEY` environment variable before running."
        )
    sections.append(f"[View source on GitHub →]({example['githubUrl']})")
    return "\n\n".join(sections)


def load_example_pages(root):
    chapters = read_source(root, EXAMPLES_SOURCE_PATH, "examples:ingest")["chapters"]
    pages = []
    for chapter_index, chapter in enumerate(chapters):
        previous_chapter = chapters[chapter_index - 1] if chapter_index > 0 else None
        next_chapter = chapters[chapter_index + 1] if chapter_index < len(chapters) - 1 else None
        pages.append(
            Page(
                kind="chapter",
                section=CHAPTER_SECTION,
                file_slug=chapter["slug"],
                destination_segments=("examples", chapter["slug"]),
                document_title=f"{chapter['title']} Examples",
                heading=chapter["title"],
                description=chapter["description"],
                lede=chapter["description"],
                breadcrumb=[("Examples", "/examples/")],
                badges=[],
                markdown_body=chapter_markdown(chapter),
                previous=previous_chapter
                and NeighborLink("← Previous Chapter", previous_chapter["title"], f"/examples/{previous_chapter['slug']}/"),
                following=next_chapter
                and NeighborLink("Next Chapter →", next_chapter["title"], f"/examples/{next_chapter['slug']}/"),
                call_to_action={
                    "title": "Want to contribute?",
                    "text": "The examples repository is open source. Add your own examples or improve existing ones.",
                    "label": "View on GitHub",
                    "to": "https://github.com/AnthusAI/Tactus-examples",
                },
            )
        )
        for example_index, example in enumerate(chapter["examples"]):
            previous_example = chapter["examples"][example_index - 1] if example_index > 0 else None
            next_example = (
                chapter["examples"][example_index + 1] if example_index < len(chapter["examples"]) - 1 else None
            )
            pages.append(
                Page(
                    kind="example",
                    section=EXAMPLE_SECTION,
                    file_slug=f"{chapter['slug']}{EXAMPLE_FILE_SEPARATOR}{example['slug']}",
                    destination_segments=("examples", chapter["slug"], example["slug"]),
                    document_title=f"{example['title']} - {chapter['title']} Examples",
                    heading=example["title"],
                    description=example["description"],
                    lede=example["description"],
                    breadcrumb=[("Examples", "/examples/"), (chapter["title"], f"/examples/{chapter['slug']}/")],
                    badges=example_badges(example),
                    markdown_body=example_markdown(example),
                    previous=previous_example
                    and NeighborLink(
                        "← Previous Example", previous_example["title"], f"/examples/{chapter['slug']}/{previous_example['slug']}/"
                    ),
                    following=next_example
                    and NeighborLink(
                        "Next Example →", next_example["title"], f"/examples/{chapter['slug']}/{next_example['slug']}/"
                    ),
                    call_to_action={
                        "title": "Explore more examples",
                        "text": "Learn Tactus through practical, runnable examples organized by topic.",
                        "label": "View All Examples",
                        "to": "/examples/",
                    },
                )
            )
    return pages


def load_pages(root):
    pages = load_stdlib_pages(root) + load_example_pages(root)
    hrefs = [page.href for page in pages]
    duplicates = sorted({href for href in hrefs if hrefs.count(href) > 1})
    if duplicates:
        raise ValueError(f"Pages would collide in the Markus output: {', '.join(duplicates)}")
    return pages
