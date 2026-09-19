"""Check the complete app is present before publishing the static site."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]


class Assets(HTMLParser):
    paths = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        key = 'src' if tag == 'script' else 'href' if tag == 'link' else None
        if key and attrs.get(key):
            self.paths.append(attrs[key])


parser = Assets()
parser.feed((ROOT / 'index.html').read_text())
shell = re.search(r'const SHELL = \[(.*?)\];', (ROOT / 'sw.js').read_text(), re.S)
assert shell, 'Service worker must declare its offline shell'
paths = parser.paths + re.findall(r"'([^']+)'", shell.group(1))
manifest = json.loads((ROOT / 'manifest.webmanifest').read_text())
paths += [manifest['start_url']] + [icon['src'] for icon in manifest['icons']]
for path in paths:
    if '://' not in path:
        target = ROOT / path
        assert target.exists(), f'Missing app asset: {path}'
        assert target.is_dir() or target.stat().st_size > 0, f'Empty app asset: {path}'
print(f'All {len(set(paths))} app assets are present.')
