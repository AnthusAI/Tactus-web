#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

virtual_environment=.build/python
requirements_stamp="$virtual_environment/.requirements-stamp"
wanted_stamp=$(cksum requirements-publication.txt)
minimum_python_minor=12

find_supported_python() {
  for candidate in python3.13 python3.12 python3; do
    if command -v "$candidate" >/dev/null 2>&1 && "$candidate" -c "import sys; sys.exit(0 if sys.version_info >= (3, $minimum_python_minor) else 1)"; then
      echo "$candidate"
      return 0
    fi
  done
  return 1
}

create_virtual_environment() {
  rm -rf "$virtual_environment"
  if supported_python=$(find_supported_python); then
    "$supported_python" -m venv "$virtual_environment"
    "$virtual_environment/bin/python" -m pip install --quiet -r requirements-publication.txt
  else
    python3 -m pip install --quiet --user uv
    python3 -m uv venv --quiet --python 3.13 "$virtual_environment"
    python3 -m uv pip install --quiet --python "$virtual_environment/bin/python" -r requirements-publication.txt
  fi
  echo "$wanted_stamp" > "$requirements_stamp"
}

if [ ! -x "$virtual_environment/bin/python" ] || [ "$(cat "$requirements_stamp" 2>/dev/null)" != "$wanted_stamp" ]; then
  create_virtual_environment
fi

PATH="$PWD/$virtual_environment/bin:$PATH"
if [ "${1:-}" = "test" ]; then
  exec "$virtual_environment/bin/python" -m unittest discover -s publication/tests -t . -v
fi
exec "$virtual_environment/bin/python" -m publication.build "$@"
