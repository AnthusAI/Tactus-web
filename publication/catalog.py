import json
import re
from dataclasses import dataclass, field
from pathlib import Path

"""Standard library and example pages: Markus Markdown for Papyrus, from the ingested ``src/data`` files.

``npm run stdlib:ingest`` and ``npm run examples:ingest`` write ``src/data/stdlib.json`` and ``src/data/examples.json``.
Each module, chapter and example becomes one content file with Papyrus page blocks: a heading band, the article on a
muted band, links to the neighbouring pages and a closing call to action.
"""
import json
import re
from dataclasses import dataclass, field
from pathlib import Path

import yaml

STDLIB_SOURCE_PATH = "src/data/stdlib.json"
EXAMPLES_SOURCE_PATH = "src/data/examples.json"
EXAMPLE_PATH_SEPARATOR = "/"
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
    content_path: str
    document_title: str
    heading: str
    description: str
    lede: str
    breadcrumb: list
    badges: list
    markdown_body: str
    previous: NeighborLink = None
    following: NeighborLink = None
    call_to_action: dict = field(default_factory=dict)

    @property
    def path(self):
        return "/" + self.content_path[: -len(".md")] + "/"


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
                content_path=f"stdlib/{module['slug']}.md",
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
                content_path=f"examples/{chapter['slug']}.md",
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
                    content_path=f"examples/{chapter['slug']}/{example['slug']}.md",
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


def reject_colliding_pages(pages, authored_paths=()):
    paths = [page.content_path for page in pages] + list(authored_paths)
    duplicates = sorted({path for path in paths if paths.count(path) > 1})
    if duplicates:
        raise ValueError(f"Pages would collide in the content directory: {', '.join(duplicates)}")


def load_pages(root):
    return load_stdlib_pages(root) + load_example_pages(root)


MARKDOWN_PUNCTUATION_PATTERN = re.compile(r"([\\`*_\[\]<>#|~{}])")


def plain_markdown(text):
    """``text`` as one line that Markus shows literally: whitespace collapsed, markup characters escaped."""
    return MARKDOWN_PUNCTUATION_PATTERN.sub(r"\\\1", " ".join(text.split()))


def link_list(links):
    return "\n".join(f"- {link}" for link in links)


def neighbor_markdown(link):
    return f"[*{link.label}* **{link.title}**]({link.path})"


def page_markdown(page):
    """The whole content file for a generated page: front matter and page blocks."""
    heading = plain_markdown(page.heading)
    breadcrumb = "".join(f"[{label}]({path}) / " for label, path in page.breadcrumb) + heading
    badges = link_list(badge.text if not badge.warning else f"**{badge.text}**" for badge in page.badges)
    blocks = [
        f'::band{{columns="{"document-hero" if page.content_path.startswith("stdlib/") else "document-hero wide"}"}}',
        f"{breadcrumb}\n\n# {heading}" + (f"\n\n{badges}" if badges else "") + f"\n\n{plain_markdown(page.lede)}",
        '::band{tone="muted"' + (' columns="example"' if page.content_path.count("/") == 2 else "") + "}",
        page.markdown_body,
    ]
    if page.previous or page.following:
        previous = neighbor_markdown(page.previous) if page.previous else ""
        following = neighbor_markdown(page.following) if page.following else ""
        blocks += ['::band{columns="neighbors"}', f"- {previous}".rstrip() + (f"\n- {following}" if following else "")]
    action = page.call_to_action
    blocks += [
        '::band{columns="cta"}',
        f"## {action['title']}" + (f"\n\n{action['text']}" if action["text"] else ""),
        f'::button{{href="{action["to"]}" label="{action["label"]}" size="lg"}}',
    ]
    front_matter = yaml.safe_dump(
        {"title": page.document_title, "description": page.description, "type": "page"},
        sort_keys=False,
        allow_unicode=True,
        width=100000,
    )
    return f"---\n{front_matter}---\n" + "\n\n".join(blocks) + "\n"
