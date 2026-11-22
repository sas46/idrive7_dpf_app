## v0.1.11

- Native OAP autostart and a default-on background monitoring switch.
- Single diagnostic engine independent of RHMI; timeout backoff 10/20/60 seconds and automatic recovery.
- Preserve v0.1.10 cluster positioning and read-only diagnostics.
- Host tests passed; cold boot, foreground access and vehicle sleep require in-car validation.

## v0.1.10

- Lower cluster notifications and align bar and compact icon bottoms.
- Center icon and label as a group using measured text width.
- v0.1.9 overlay visibility confirmed in car; new placement confirmed in car.

## v0.1.9

- Fix rejected cluster overlay Z-order: 10000 -> 1000.
- Add Z-order regression assertions.
- In-car validation pending.

## v0.1.9

- Fix rejected cluster overlay Z-order: 10000 -> 1000.
- Add Z-order regression assertions to mock and socket tests.
- In-car validation pending.

## v0.1.8

- Wait for Cluster Render handshake before creating the overlay.
- Log layer creation, pixel submission, refusal and layer state.
- Test the actual client over a simulated Unix socket.
- In-car validation pending.

# Changelog
## 0.1.7
- Optional cluster notifications (enabled by default), persistent bar or compact icon, 70% black background. Requires Cluster Render 0.6.9. In-car validation pending.


## 0.1.6
- Added SDK-free TGZ packaging for MGU Deploy local SDK linking.
- Added automated GitHub Release packaging.
- No changes to diagnostics or UI.

## 0.1.5
- Fixed the default screen layout on fresh installations: Full screen instead of iDrive.
- Existing saved layout preferences are preserved.

## 0.1.4
- Replaced the application icon with the selected DPF/HUD artwork.

## 0.1.3
- Added an optional experimental Regeneration information page and disabled action placeholder.
- Added coolant temperature and reference conditions.
- Updated application icon.

## 0.1.2
- Removed duplicated bottom navigation in GPU mode.

## 0.1.1
- Updated graphics runtime to address automatic refresh.
- Distinguished observed regeneration request (44BB = 6) from running (44BB = 4).

## 0.1.0
- Initial standalone read-only DPF monitor, live data, history and demo mode.
