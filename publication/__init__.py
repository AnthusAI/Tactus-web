"""The Tactus site build. ``web/`` holds the Papyrus site (settings, theme, hooks, assets); its icon module is shared with this package."""
import sys
from pathlib import Path

WEB_DIRECTORY = Path(__file__).resolve().parent.parent / "web"
if str(WEB_DIRECTORY) not in sys.path:
    sys.path.insert(0, str(WEB_DIRECTORY))
