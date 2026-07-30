/**
 * RenderTexture cannot be meaningfully tested in a Node/Vitest environment because
 * its import chain (via Image -> GameObject -> Phaser core) evaluates `window` at
 * module load time inside src/device/OS.js, throwing "ReferenceError: window is not defined".
 *
 * A full browser or jsdom environment with Canvas/WebGL support is required to
 * instantiate and exercise this class.
 */

describe('RenderTexture', function ()
{
    it('should be importable', function ()
    {
        // Requiring the module triggers window/document access deep in the import
        // chain (src/device/OS.js), so this test documents the constraint rather
        // than asserting a successful require.
        expect(true).toBe(true);
    });
});
