import html
import re

HEADING_PATTERN = re.compile(r"<h([1-6])([^>]*)>(.*?)</h\1>", re.DOTALL | re.IGNORECASE)
TAG_PATTERN = re.compile(r"<[^>]+>")
DISALLOWED_ID_CHARACTERS = re.compile(r"[^\w\s-]", re.UNICODE)


def github_style_heading_id(inner_html):
    text = html.unescape(TAG_PATTERN.sub("", inner_html)).strip().lower()
    text = DISALLOWED_ID_CHARACTERS.sub("", text)
    return re.sub(r"[-\s]+", "-", text).strip("-")


def add_heading_ids(fragment_html):
    seen_counts = {}

    def add_id(match):
        level, attributes, inner = match.groups()
        if re.search(r"\sid=", attributes, re.IGNORECASE):
            return match.group(0)
        slug = github_style_heading_id(inner)
        if slug in seen_counts:
            seen_counts[slug] += 1
            slug = f"{slug}-{seen_counts[slug]}"
        else:
            seen_counts[slug] = 0
        return f'<h{level}{attributes} id="{slug}">{inner}</h{level}>'

    return HEADING_PATTERN.sub(add_id, fragment_html)
