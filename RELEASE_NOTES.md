# DPF Monitor v0.1.16

- Recognize both observed DDE encodings of DID `44BB`. Values `1` and `6` mean **Regeneration requested**, and `2` and `4` mean **Regeneration running**. The mapping also applies to KOMBI notifications.
- Show readable regeneration states in Live Data and retain the original DDE value in Raw view.
- Show distances between regenerations in History and skip intervals with missing or out-of-order readings.
- Add an experimental two-step **FORCE REGEN** preview. It sends no command to the DDE.

The SDK-free package was verified and all four local tests passed. On-vehicle validation on the reported G21 320d is pending.
