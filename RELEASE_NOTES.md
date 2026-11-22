# DPF Monitor v0.1.13 — KOMBI test toggle (pre-release)

- Replaced timed cluster notification test with a persistent ON/OFF toggle.
- ON keeps the test overlay active; OFF removes it on the next update cycle.
- Test can be activated at any vehicle speed; use only when safe, ideally by a passenger.
- Normal regeneration notification duration and cluster MAP overlay behavior unchanged.
- OAP native autostart and background monitoring behavior retained.

**Validation:** Local syntax, packaging and state-transition tests only. Vehicle display, BC menu and background autostart require in-car verification.
