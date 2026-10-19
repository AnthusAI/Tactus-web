"""Authored pages: Markus files under publication/content/pages with front matter.

A landing page is a hero followed by sections separated by a line of three dashes; front matter
lists which sections sit on the muted background and may add a closing call to action. A prose
page is a heading followed by one article. Placeholders such as ``{{videos-all}}`` stand for
blocks generated from the site's data.
"""
import os
import re
from datetime import datetime, timezone
from pathlib import Path

import yaml

from publication.catalog import AUTHORED_SECTION, Page
from publication.icons import ACTIONS_MARKER, AVAILABILITY_CHIP_MARKER_PREFIX, ICON_MARKER_PREFIX
from publication.islands import extract_islands
from publication.indexes import (
    example_chapters_markdown,
    example_code_markdown,
    example_link_markdown,
    example_snippet_markdown,
    stdlib_modules_markdown,
)
from publication.media import (
    all_videos_markdown,
    book_series_markdown,
    featured_videos_markdown,
    video_catalog_markdown,
    video_embed_markdown,
    video_player_markdown,
)

CONTENT_DIRECTORY = Path(__file__).resolve().parent / "content" / "pages"
FRONT_MATTER_PATTERN = re.compile(r"\A---\n(.*?)\n---\n(.*)\Z", re.DOTALL)
PLACEHOLDER_PATTERN = re.compile(r"\{\{([a-z0-9-]+)((?: [a-z0-9-]+)*)\}\}")
REQUIRED_FIELDS = ("path", "title", "heading", "description", "kind")
OPTIONAL_FIELDS = ("eyebrow", "lede", "muted", "call_to_action", "also_written_to", "hero_split", "drop_caps")
KINDS = ("landing", "prose")
CALL_TO_ACTION_FIELDS = ("title", "text", "label", "to")
FEATURED_VIDEO_IDS = ("why-new-language", "guardrails")


def build_time_text(now):
    return now.astimezone(timezone.utc).strftime("%Y-%m-%d %I:%M %p %Z").replace("AM", "am").replace("PM", "pm")


def placeholder_values(root, environment, now):
    return {
        "build-time": lambda: build_time_text(now),
        "videos-featured": lambda *ids: featured_videos_markdown(root, environment, ids or FEATURED_VIDEO_IDS),
        "video-embed": lambda video_id: video_embed_markdown(root, environment, video_id),
        "video-player": lambda video_id: video_player_markdown(root, environment, video_id),
        "videos-all": lambda: all_videos_markdown(root, environment),
        "videos-catalog": lambda: video_catalog_markdown(root, environment),
        "example-code": lambda example_id: example_code_markdown(root, example_id),
        "example-snippet": lambda example_id: example_snippet_markdown(root, example_id),
        "example-link": lambda example_id: example_link_markdown(root, example_id),
        "icon": lambda name: f"{ICON_MARKER_PREFIX}{name}",
        "actions": lambda: ACTIONS_MARKER,
        "availability-chip": lambda availability: f"{AVAILABILITY_CHIP_MARKER_PREFIX}{availability}",
        "stdlib-modules": lambda: stdlib_modules_markdown(root),
        "example-chapters": lambda: example_chapters_markdown(root),
        "books": lambda: book_series_markdown(root, environment),
    }


def fill_placeholders(body, values, source):
    def replace(match):
        name = match.group(1)
        if name == "island":
            return match.group(0)
        if name not in values:
            raise ValueError(f"{source}: unknown placeholder {{{{{name}}}}}; known: {', '.join(sorted(values))}")
        return values[name](*match.group(2).split())

    return PLACEHOLDER_PATTERN.sub(replace, body)


def parse_page_file(path):
    match = FRONT_MATTER_PATTERN.match(path.read_text(encoding="utf-8"))
    if match is None:
        raise ValueError(f"{path.name}: expected front matter between two lines of three dashes")
    front_matter = yaml.safe_load(match.group(1)) or {}
    unknown = sorted(set(front_matter) - set(REQUIRED_FIELDS) - set(OPTIONAL_FIELDS))
    missing = [field for field in REQUIRED_FIELDS if field not in front_matter]
    if unknown or missing:
        raise ValueError(f"{path.name}: unknown front matter {unknown or 'none'}, missing {missing or 'none'}")
    if front_matter["kind"] not in KINDS:
        raise ValueError(f"{path.name}: kind must be one of {', '.join(KINDS)}")
    call_to_action = front_matter.get("call_to_action") or {}
    if call_to_action and sorted(call_to_action) != sorted(CALL_TO_ACTION_FIELDS):
        raise ValueError(f"{path.name}: call_to_action needs exactly {', '.join(CALL_TO_ACTION_FIELDS)}")
    return front_matter, match.group(2).strip()


def page_from_file(path, root, environment, now):
    front_matter, body = parse_page_file(path)
    segments = tuple(segment for segment in front_matter["path"].strip("/").split("/") if segment)
    markdown, islands = extract_islands(
        fill_placeholders(body, placeholder_values(root, environment, now), path.name), path.name
    )
    return Page(
        kind=front_matter["kind"],
        section=AUTHORED_SECTION,
        file_slug="-".join(segments) or "index",
        destination_segments=segments,
        document_title=front_matter["title"],
        heading=front_matter["heading"],
        description=front_matter["description"],
        lede=front_matter.get("lede", ""),
        breadcrumb=[],
        badges=[],
        markdown_body=markdown,
        islands=islands,
        hero_split=bool(front_matter.get("hero_split", False)),
        drop_caps=tuple(str(item) for item in front_matter.get("drop_caps", ())),
        eyebrow=front_matter.get("eyebrow", ""),
        muted_sections=tuple(front_matter.get("muted", ())),
        also_written_to=tuple(front_matter.get("also_written_to", ())),
        call_to_action=front_matter.get("call_to_action") or {},
    )


def load_authored_pages(root, environment=None, now=None):
    environment = os.environ if environment is None else environment
    now = now or datetime.now().astimezone()
    return [page_from_file(path, root, environment, now) for path in sorted(CONTENT_DIRECTORY.glob("*.md"))]
