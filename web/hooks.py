"""tactus.anth.us on Papyrus's standard Markus front end.

Settings, URLs, head, sitemap, robots, feeds, the header and the family footer come from ``projection.json`` and
Papyrus core. This module is the site's editorial markup: the icons and availability chips that pages request with
``{{icon name}}`` and ``{{availability-chip kind}}`` (the build leaves marker paragraphs; see ``site_icons.py``).
"""

from site_icons import place_availability_chips, place_icons


def item_decorator(html, summary):
    return place_availability_chips(place_icons(html))
