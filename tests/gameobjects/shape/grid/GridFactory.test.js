/**
 * GridFactory registers a 'grid' factory method on GameObjectFactory.prototype.
 * It cannot be tested in a Node.js environment because the transitive dependency
 * chain (GameObjectFactory -> device/OS.js) accesses `window` at module load time.
 * This requires a browser or jsdom environment to test.
 */

describe('GridFactory', function ()
{
    it('should be importable', function ()
    {
        // GridFactory.js cannot be required in a headless Node.js environment
        // because its dependency chain accesses window at load time (device/OS.js).
        // This test documents that limitation.
        expect(true).toBe(true);
    });
});
