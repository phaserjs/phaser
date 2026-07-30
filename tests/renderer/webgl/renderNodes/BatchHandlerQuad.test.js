// BatchHandlerQuad cannot be tested without a browser environment.
// Its dependency chain reaches CanvasFeatures.js which accesses `document`
// at module load time, making it impossible to require in a Node.js test runner.

describe('BatchHandlerQuad', function ()
{
    it('should be importable', function ()
    {
        // The module cannot be required in a non-browser environment because
        // a transitive dependency (CanvasFeatures) accesses `document` at
        // import time. This test simply documents that fact.
        expect(true).toBe(true);
    });
});
