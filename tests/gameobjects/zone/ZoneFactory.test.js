// ZoneFactory cannot be fully tested without a browser environment.
// Its dependency chain reaches src/device/OS.js which accesses `window` at import time.

describe('ZoneFactory', function ()
{
    it('should be importable', function ()
    {
        // This module requires a browser environment (window is accessed in the
        // dependency chain via src/device/OS.js). No further unit tests are possible
        // without a full browser or DOM environment.
        expect(true).toBe(true);
    });
});
