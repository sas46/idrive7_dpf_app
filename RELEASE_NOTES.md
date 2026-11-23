## What's Changed
- Make DPF notifications actively contend for the KOMBI `map` target even when Waze is not running (`contend: true`).
- Move the notification to the lower edge of the map area, keeping it horizontally centered.
- Increase notification height and separate title from TEST indicator to prevent overlap.
- Improve background opacity for legibility.
- Preserve the persistent KOMBI test toggle, background monitoring, and native OAP autostart.

## Validation
- SDK-free package and local unit tests passed.
- **In-vehicle validation required:** independent scene activation, BMW BC menu compatibility, placement and readability.

**Status:** Pre-release.
