"""Authored pages: Markus files under ``content/`` that use Papyrus page blocks.

Placeholders such as ``{{videos-all}}`` stand for blocks generated from the site's data (``data/``, the ingested
standard library and examples). The build replaces them before Papyrus sees the page, and writes the result to the
staging content directory.
"""
import os
import re
from datetime import datetime, timezone
from pathlib import Path

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
from site_icons import AVAILABILITY_CHIP_MARKER_PREFIX, ICON_MARKER_PREFIX

CONTENT_DIRECTORY = "content"
PLACEHOLDER_PATTERN = re.compile(r"\{\{([a-z0-9-]+)((?: [a-z0-9-]+)*)\}\}")
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
        "availability-chip": lambda availability: f"{AVAILABILITY_CHIP_MARKER_PREFIX}{availability}",
        "stdlib-modules": lambda: stdlib_modules_markdown(root),
        "example-chapters": lambda: example_chapters_markdown(root),
        "books": lambda: book_series_markdown(root, environment),
    }


def fill_placeholders(body, values, source):
    def replace(match):
        name = match.group(1)
        if name not in values:
            raise ValueError(f"{source}: unknown placeholder {{{{{name}}}}}; known: {', '.join(sorted(values))}")
        return values[name](*match.group(2).split())

    return PLACEHOLDER_PATTERN.sub(replace, body)


def authored_files(root):
    directory = Path(root) / CONTENT_DIRECTORY
    return sorted(path for path in directory.rglob("*.md") if not any(part.startswith(".") for part in path.relative_to(directory).parts))


def stage_authored(root, staging_directory, environment=None, now=None):
    """Write every authored page, placeholders filled, under ``staging_directory`` at its content path."""
    environment = os.environ if environment is None else environment
    now = now or datetime.now().astimezone()
    values = placeholder_values(root, environment, now)
    directory = Path(root) / CONTENT_DIRECTORY
    staged = []
    for path in authored_files(root):
        relative = path.relative_to(directory)
        destination = Path(staging_directory) / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(fill_placeholders(path.read_text(encoding="utf-8"), values, relative.as_posix()), encoding="utf-8")
        staged.append(relative.as_posix())
    return staged
