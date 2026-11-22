# DPF Monitor v0.1.11 — Background Autostart and KOMBI Compatibility (pre-release)

## Changes
- Native BMW OAP automatic startup (`mguAppStartType: autostart`), with background monitoring enabled by default.
- New **Start automatically in background** setting. When disabled, background diagnostics pause while the app is not in the foreground.
- DPF regeneration notifications now use Cluster Render **map** target (`0x100`) instead of the full **panel** target (`0x203`), to avoid taking over the KOMBI panel used by the BMW BC menu.
- The notification retains its original centered, lower-KOMBI appearance (400 × 90 px bar or 80 × 80 px compact icon), positioned within the 1088 × 480 map area.
- The notification layer uses nonexclusive overlay mode at z=1000; Waze on Cluster and Cluster Render are not modified.
- One shared read-only diagnostic engine for foreground and background monitoring.
- Adaptive diagnostic retry after DDE timeouts (10/20/60 seconds) and automatic recovery.

## Requirements and testing
- BMW iDrive 7 MGU with MGU Deploy supporting `mguAppStartType`.
- Cluster Render 0.6.9 for KOMBI notifications; compatible configuration intended for Waze on Cluster 0.11.0.
- Read-only UDS service 0x22; no ECU write commands.
- Host-side tests and package checks run before publication. **Vehicle validation is still required** for cold boot, background monitoring, actual overlay placement, preservation of the BC menu, and vehicle standby.
- Map-target notifications may be unavailable when the KOMBI is not displaying its map area.

**Pre-release:** Do not promote to stable until the BC menu and cold-start behavior have been verified in the car.
