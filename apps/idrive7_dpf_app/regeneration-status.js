'use strict';

// DID 44BB has been observed with both encodings on supported DDEs.
function regenerationState(raw) {
    switch (raw) {
    case 0: return 'idle';
    case 1:
    case 6: return 'requested';
    case 2:
    case 4: return 'running';
    default: return null;
    }
}

module.exports = { regenerationState };
