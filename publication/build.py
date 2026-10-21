"""Build tactus.anth.us: content files for Papyrus, then ``papyrus ops content project``.

1. The authored pages in ``content/`` get their placeholders filled and are staged under ``.build/content``.
2. The standard library, example chapters and examples are written there as Markdown from ``src/data``.
3. Papyrus renders ``.build/content`` with the site settings, theme and hooks in ``web/`` into ``public/``.
4. ``static/`` (the manifest, icons, share images, ``llms.txt``, redirect stubs) is laid over the site root,
   because Papyrus publishes only ``assets/`` and ``css/`` from ``web/`` at fixed places.

``npm run build`` runs the islands bundle first (``scripts/build-islands.js`` writes it into ``web/assets``).
"""
import argparse
import os
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STAGING_DIRECTORY = ROOT / ".build" / "content"
WEB_DIRECTORY = ROOT / "web"
STATIC_DIRECTORY = ROOT / "static"
PRODUCTION_URL = "https://tactus.anth.us"
BUNDLE_PATH = WEB_DIRECTORY / "assets" / "islands.js"

from publication.authored import authored_files, stage_authored  # noqa: E402
from publication.catalog import load_pages, page_markdown, reject_colliding_pages  # noqa: E402


def public_url(environment):
    """The origin this build will be served from: production unless Amplify builds a preview branch."""
    if environment.get("PAPYRUS_SITE_PUBLIC_URL") is not None:
        return environment["PAPYRUS_SITE_PUBLIC_URL"]
    branch, app = environment.get("AWS_BRANCH"), environment.get("AWS_APP_ID")
    if branch and app and branch != "main":
        return f"https://{branch.replace('/', '-')}.{app}.amplifyapp.com"
    return PRODUCTION_URL


def stage_content(root, staging_directory):
    pages = load_pages(root)
    authored = [path.relative_to(root / "content").as_posix() for path in authored_files(root)]
    reject_colliding_pages(pages, authored)
    shutil.rmtree(staging_directory, ignore_errors=True)
    staged = stage_authored(root, staging_directory)
    for page in pages:
        destination = staging_directory / page.content_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(page_markdown(page), encoding="utf-8")
    return len(staged), len(pages)


def render_site(root, output_directory):
    from papyrus_content.project_commands import content_project

    if not BUNDLE_PATH.exists():
        raise FileNotFoundError("web/assets/islands.js is missing; run `node scripts/build-islands.js`")
    authored, generated = stage_content(root, STAGING_DIRECTORY)
    shutil.rmtree(output_directory, ignore_errors=True)
    os.environ["PAPYRUS_SITE_PUBLIC_URL"] = public_url(os.environ)
    content_project(["--all", "--from-dir", str(STAGING_DIRECTORY), "--static-dir", str(WEB_DIRECTORY), "--out", str(output_directory)])
    shutil.copytree(STATIC_DIRECTORY, output_directory, dirs_exist_ok=True)
    return authored, generated


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=ROOT / "public")
    arguments = parser.parse_args(argv)
    authored, generated = render_site(ROOT, arguments.out)
    print(f"Rendered {authored} authored and {generated} generated pages through Papyrus into {arguments.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
