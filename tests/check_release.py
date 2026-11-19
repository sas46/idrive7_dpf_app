"""Validate public TGZ layout and absence of bundled OAP SDK."""
import json, sys, tarfile
from pathlib import Path, PurePosixPath
p = Path(sys.argv[1])
with tarfile.open(p, 'r:gz') as t:
    members = t.getmembers()
    names = {m.name for m in members}
    for m in members:
        parts = PurePosixPath(m.name).parts
        assert parts[0] == 'package' and '..' not in parts, m.name
        assert m.isfile() or m.isdir(), m.name
        assert 'oap-sdk' not in parts and 'oap-sdk.zip' not in parts, m.name
    for name in ('package.json', 'javascript/app.js', 'javascript/kit/mgu.js', 'rhmiData/application.json'):
        assert 'package/' + name in names, name
    pkg = json.load(t.extractfile('package/package.json'))
    assert p.name == f"{pkg['name']}@{pkg['version']}.tgz"
    assert b"require('oap-sdk')" in t.extractfile('package/javascript/kit/mgu.js').read()
print('Public TGZ structure and SDK exclusion: OK')
