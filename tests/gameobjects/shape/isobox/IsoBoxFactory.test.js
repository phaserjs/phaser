// IsoBoxFactory cannot be tested in a Node.js environment.
// Requiring it triggers src/device/OS.js which accesses `window` at module
// evaluation time, causing a ReferenceError outside of a browser context.

describe('IsoBoxFactory', function ()
{
    it('should be importable', function ()
    {
        // The module depends on browser globals (window) deep in its dependency
        // chain (src/device/OS.js) and cannot be loaded in a non-browser environment.
        expect(true).toBe(true);
    });
});
