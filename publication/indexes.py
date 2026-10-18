"""Card grids for the standard library and examples index pages, from the ingested data files."""
from publication.catalog import EXAMPLES_SOURCE_PATH, STDLIB_SOURCE_PATH, count_label, fenced_code, read_source
from publication.media import attribute_text


def stdlib_modules_markdown(root, environment=None):
    modules = read_source(root, STDLIB_SOURCE_PATH, "stdlib:ingest")["modules"]
    cards = []
    for module in modules:
        facts = []
        if module["hasSpecs"]:
            facts.append(count_label(module["specCount"], "spec", "specs"))
        facts.append(count_label(len(module["submodules"]), "class", "classes"))
        cards.append(
            f':::card{{title="{attribute_text(module["name"])}"}}\n{module["description"]}\n\n'
            f'*{" · ".join(facts)}*\n\n[View module →](/stdlib/{module["slug"]}/)\n:::\n'
        )
    return ':::card-grid{columns=3 label="Standard library modules"}\n' + "\n".join(cards) + ":::"


def example_chapters_markdown(root, environment=None):
    chapters = read_source(root, EXAMPLES_SOURCE_PATH, "examples:ingest")["chapters"]
    cards = []
    for chapter in chapters:
        cards.append(
            f':::card{{title="{attribute_text(chapter["title"])}"}}\n{chapter["description"]}\n\n'
            f'*{count_label(len(chapter["examples"]), "example", "examples")}*\n\n'
            f'[Browse chapter →](/examples/{chapter["slug"]}/)\n:::\n'
        )
    return ':::card-grid{columns=3 label="Example chapters"}\n' + "\n".join(cards) + ":::"


SNIPPET_START = "-- SNIPPET START"
SNIPPET_END = "-- SNIPPET END"


def find_example(root, example_id):
    for chapter in read_source(root, EXAMPLES_SOURCE_PATH, "examples:ingest")["chapters"]:
        for example in chapter["examples"]:
            if example["id"] == example_id:
                return example
    raise ValueError(f"{EXAMPLES_SOURCE_PATH}: no example with id {example_id}")


def example_snippet_markdown(root, example_id):
    code = find_example(root, example_id)["code"]
    start, end = code.find(SNIPPET_START), code.find(SNIPPET_END)
    if start == -1 or end <= start:
        raise ValueError(f"Example {example_id} has no {SNIPPET_START} / {SNIPPET_END} markers")
    return fenced_code(code[start + len(SNIPPET_START) : end].strip(), "lua")


def example_link_markdown(root, example_id):
    example = find_example(root, example_id)
    return f"[{example['tacPath']}]({example['githubUrl']})"
