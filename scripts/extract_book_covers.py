#!/usr/bin/env python3
"""
Download the three Tactus book PDFs and extract a cover image from page 1.

This is intended for generating missing image assets for the Tactus-web landing page.

Dependencies:
  - Ghostscript (`gs`) available on PATH
  - Python 3 with Pillow (PIL) installed (already present on many macOS setups)

Outputs:
  - `src/images/books/learning-tactus.png`
  - `src/images/books/programming-tactus.png`
  - `src/images/books/tactus-in-a-nutshell.png`
"""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
import urllib.request
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageChops


@dataclass(frozen=True)
class Book:
    slug: str
    title: str
    pdf_url: str
    output_filename: str


BOOKS: dict[str, Book] = {
    "learning-tactus": Book(
        slug="learning-tactus",
        title="Learning Tactus",
        pdf_url="https://anthusai.github.io/Learning-Tactus/pdf/Learning-Tactus.pdf",
        output_filename="learning-tactus.png",
    ),
    "programming-tactus": Book(
        slug="programming-tactus",
        title="Programming Tactus",
        pdf_url="https://anthusai.github.io/Programming-Tactus/pdf/Programming-Tactus.pdf",
        output_filename="programming-tactus.png",
    ),
    "tactus-in-a-nutshell": Book(
        slug="tactus-in-a-nutshell",
        title="Tactus in a Nutshell",
        pdf_url="https://anthusai.github.io/Tactus-in-a-Nutshell/pdf/Tactus-in-a-Nutshell.pdf",
        output_filename="tactus-in-a-nutshell.png",
    ),
}


def _require_gs() -> None:
    if not shutil_which("gs"):
        raise RuntimeError(
            "Missing dependency: `gs` (Ghostscript). Install Ghostscript and retry."
        )


def shutil_which(cmd: str) -> str | None:
    paths = os.environ.get("PATH", "").split(os.pathsep)
    extensions = [""]
    if sys.platform.startswith("win"):
        pathext = os.environ.get("PATHEXT", ".EXE;.BAT;.CMD").split(";")
        extensions = list(dict.fromkeys([e.lower() for e in pathext if e]))
    for path in paths:
        candidate = Path(path) / cmd
        for ext in extensions:
            p = Path(str(candidate) + ext)
            if p.is_file() and os.access(p, os.X_OK):
                return str(p)
    return None


def download_pdf(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url) as response:
        data = response.read()
    dest.write_bytes(data)


def render_first_page_to_png(pdf_path: Path, png_path: Path, dpi: int) -> None:
    png_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "gs",
        "-dSAFER",
        "-dBATCH",
        "-dNOPAUSE",
        "-sDEVICE=pngalpha",
        f"-dFirstPage=1",
        f"-dLastPage=1",
        f"-r{dpi}",
        f"-sOutputFile={str(png_path)}",
        str(pdf_path),
    ]
    subprocess.run(cmd, check=True)


def trim_border(img: Image.Image, padding: int = 8) -> Image.Image:
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")

    bg = Image.new(img.mode, img.size, img.getpixel((0, 0)))
    diff = ImageChops.difference(img, bg)

    if diff.mode == "RGBA":
        diff = diff.convert("RGB")

    bbox = diff.getbbox()
    if bbox is None:
        return img

    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(img.width, right + padding)
    bottom = min(img.height, bottom + padding)
    return img.crop((left, top, right, bottom))


def resize_to_width(img: Image.Image, width: int) -> Image.Image:
    if img.width <= width:
        return img
    height = round(img.height * (width / img.width))
    return img.resize((width, height), Image.Resampling.LANCZOS)


def extract_cover(
    *,
    book: Book,
    cache_dir: Path,
    out_dir: Path,
    dpi: int,
    width: int,
    overwrite: bool,
    allow_download: bool,
) -> Path:
    out_path = out_dir / book.output_filename
    if out_path.exists() and not overwrite:
        return out_path

    pdf_path = cache_dir / f"{book.slug}.pdf"
    if not pdf_path.exists():
        if not allow_download:
            raise RuntimeError(f"PDF not found at {pdf_path} and downloads are disabled.")
        download_pdf(book.pdf_url, pdf_path)

    tmp_png = cache_dir / f"{book.slug}.page1.png"
    render_first_page_to_png(pdf_path, tmp_png, dpi=dpi)

    img = Image.open(tmp_png)
    img.load()
    img = trim_border(img)
    img = resize_to_width(img, width=width)

    out_dir.mkdir(parents=True, exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)
    return out_path


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out-dir",
        default="src/images/books",
        help="Where to write PNG cover images (default: src/images/books).",
    )
    parser.add_argument(
        "--cache-dir",
        default=".cache/book-covers",
        help="Where to cache downloaded PDFs and intermediate renders (default: .cache/book-covers).",
    )
    parser.add_argument(
        "--dpi",
        type=int,
        default=250,
        help="Render DPI for PDF -> PNG (default: 250).",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=900,
        help="Max output width in pixels (default: 900).",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing output images.",
    )
    parser.add_argument(
        "--no-download",
        action="store_true",
        help="Do not download PDFs (error if missing from cache).",
    )
    parser.add_argument(
        "--book",
        action="append",
        choices=sorted(BOOKS.keys()),
        help="Only generate specific book(s). Can be passed multiple times.",
    )
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)

    try:
        _require_gs()
    except Exception as e:
        print(f"[error] {e}", file=sys.stderr)
        return 2

    cache_dir = Path(args.cache_dir)
    out_dir = Path(args.out_dir)
    allow_download = not args.no_download

    selected = args.book or list(BOOKS.keys())
    failures: list[str] = []

    for slug in selected:
        book = BOOKS[slug]
        try:
            out_path = extract_cover(
                book=book,
                cache_dir=cache_dir,
                out_dir=out_dir,
                dpi=args.dpi,
                width=args.width,
                overwrite=args.overwrite,
                allow_download=allow_download,
            )
            print(f"[ok] {book.title}: {out_path}")
        except Exception as e:
            failures.append(f"{book.title}: {e}")

    if failures:
        for f in failures:
            print(f"[error] {f}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
