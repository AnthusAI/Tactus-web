"""Videos and books for the content pages, read from ``data/videos.json`` and ``data/books.json``."""
import json
from pathlib import Path

VIDEOS_SOURCE_PATH = "data/videos.json"
BOOKS_SOURCE_PATH = "data/books.json"
AMPLIFY_OUTPUTS_PATH = "amplify_outputs.json"
VIDEOS_BASE_URL_VARIABLE = "VIDEOS_BASE_URL"


def read_records(root, relative_path, required_fields):
    records = json.loads((Path(root) / relative_path).read_text(encoding="utf-8"))
    for record in records:
        missing = [field for field in required_fields if field not in record]
        if missing:
            raise ValueError(f"{relative_path}: entry {record.get('id', '?')} lacks {', '.join(missing)}")
    return records


def load_videos(root):
    return read_records(root, VIDEOS_SOURCE_PATH, ("id", "title", "description", "filename"))


def load_books(root):
    return read_records(root, BOOKS_SOURCE_PATH, ("id", "title", "description", "href", "pdf", "repo", "coverFile"))


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
