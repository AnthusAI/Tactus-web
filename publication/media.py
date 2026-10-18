"""Videos and books for the authored pages, read from the same modules the Gatsby components used."""
import json
import re
from pathlib import Path

VIDEOS_SOURCE_PATH = "src/content/videos.js"
BOOKS_SOURCE_PATH = "src/content/books.js"
AMPLIFY_OUTPUTS_PATH = "amplify_outputs.json"
VIDEOS_BASE_URL_VARIABLE = "GATSBY_VIDEOS_BASE_URL"
BOOK_COVER_DIRECTORY = "src/images/books"
STRING_FIELD_PATTERN = re.compile(r'(\w+):\s*"((?:[^"\\]|\\.)*)"')
IDENTIFIER_FIELD_PATTERN = re.compile(r"(\w+):\s*([A-Za-z_]\w*)\s*,")
OBJECT_PATTERN = re.compile(r"^  \{\n(.*?)^  \},?$", re.DOTALL | re.MULTILINE)
IMPORT_PATTERN = re.compile(r'import (\w+) from "([^"]+)"')


def read_records(source, required_fields, source_path):
    records = []
    for match in OBJECT_PATTERN.finditer(source):
        record = {name: json.loads(f'"{value}"') for name, value in STRING_FIELD_PATTERN.findall(match.group(1))}
        record.update({name: value for name, value in IDENTIFIER_FIELD_PATTERN.findall(match.group(1))})
        missing = [field for field in required_fields if field not in record]
        if missing:
            raise ValueError(f"{source_path}: entry {record.get('id', '?')} lacks {', '.join(missing)}")
        records.append(record)
    if not records:
        raise ValueError(f"{source_path}: no entries found; has the module changed shape?")
    return records


def load_videos(root):
    source = (Path(root) / VIDEOS_SOURCE_PATH).read_text(encoding="utf-8")
    return read_records(source, ("id", "title", "description", "filename"), VIDEOS_SOURCE_PATH)


def load_books(root):
    source = (Path(root) / BOOKS_SOURCE_PATH).read_text(encoding="utf-8")
    imports = {name: Path(path).name for name, path in IMPORT_PATTERN.findall(source)}
    books = read_records(source, ("id", "title", "description", "href", "pdf", "repo", "coverSrc"), BOOKS_SOURCE_PATH)
    for book in books:
        if book["coverSrc"] not in imports:
            raise ValueError(f"{BOOKS_SOURCE_PATH}: {book['id']} has no cover image import named {book['coverSrc']}")
        book["coverFile"] = imports[book["coverSrc"]]
    return books


def videos_base_url(root, environment):
    configured = environment.get(VIDEOS_BASE_URL_VARIABLE)
    if not configured:
        outputs_path = Path(root) / AMPLIFY_OUTPUTS_PATH
        if outputs_path.exists():
            content_delivery_url = json.loads(outputs_path.read_text(encoding="utf-8")).get("custom", {}).get("videosCdnUrl")
            configured = f"{content_delivery_url}/videos" if content_delivery_url else None
    return configured.rstrip("/") if configured else "/videos"


def attribute_text(value):
    return str(value).replace('"', "&quot;")


def video_card(video, link):
    meta = f"*{video['meta']}*\n\n" if video.get("meta") else ""
    return (
        f':::card{{title="{attribute_text(video["title"])}"}}\n'
        f"{meta}{video['description']}\n\n[Watch]({link})\n:::\n"
    )


def featured_videos_markdown(root, environment, featured_ids):
    videos = {video["id"]: video for video in load_videos(root)}
    featured = [videos[video_id] for video_id in featured_ids]
    cards = "\n".join(video_card(video, f"/videos/#{video['id']}") for video in featured)
    remaining = len(videos) - len(featured)
    more = f"\n\nPlus {remaining} more video{'' if remaining == 1 else 's'} on the videos page." if remaining else ""
    return f':::card-grid{{columns=2 label="Featured videos"}}\n{cards}:::{more}'


def all_videos_markdown(root, environment):
    base = videos_base_url(root, environment)
    entries = []
    for video in load_videos(root):
        poster = f' poster="{base}/{video["poster"]}"' if video.get("poster") else ""
        entries.append(
            f"### {video['title']} {{#{video['id']}}}\n\n{video['description']}\n\n"
            f'::video{{src="{base}/{video["filename"]}" title="{attribute_text(video["title"])}"{poster}}}'
        )
    return "\n\n".join(entries)


def video_catalog_markdown(root, environment):
    cards = "\n".join(video_card(video, f"/videos/#{video['id']}") for video in load_videos(root))
    return f':::card-grid{{columns=3 label="Videos"}}\n{cards}:::'


def book_series_markdown(root, environment):
    cards = []
    for book in load_books(root):
        cards.append(
            f':::card{{title="{attribute_text(book["title"])}"}}\n'
            f"![{book['title']} cover](/assets/books/{book['coverFile']})\n\n{book['description']}\n\n"
            f"[Read]({book['href']}) · [PDF]({book['pdf']}) · [Repo]({book['repo']})\n:::\n"
        )
    return ':::card-grid{columns=3 label="Books"}\n' + "\n".join(cards) + ":::"


def book_cover_files(root):
    return [Path(root) / BOOK_COVER_DIRECTORY / book["coverFile"] for book in load_books(root)]


def video_player_markdown(root, environment, video_id):
    video = next(video for video in load_videos(root) if video["id"] == video_id)
    base = videos_base_url(root, environment)
    caption = f"**{video['title']} ({video['meta']})**" if video.get("meta") else f"**{video['title']}**"
    poster = f' poster="{base}/{video["poster"]}"' if video.get("poster") else ""
    return f'{caption}\n\n::video{{src="{base}/{video["filename"]}" title="{attribute_text(video["title"])}"{poster}}}'


def video_embed_markdown(root, environment, video_id):
    video = next(video for video in load_videos(root) if video["id"] == video_id)
    base = videos_base_url(root, environment)
    poster = f' poster="{base}/{video["poster"]}"' if video.get("poster") else ""
    return f'::video{{src="{base}/{video["filename"]}" title="{attribute_text(video["title"])}"{poster}}}'
