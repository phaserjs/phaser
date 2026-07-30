var ArcWebGLRenderer = require('../../../../src/gameobjects/shape/arc/ArcWebGLRenderer');

describe('ArcWebGLRenderer', function ()
{
    it('should be importable', function ()
    {
        expect(ArcWebGLRenderer).toBeDefined();
        expect(typeof ArcWebGLRenderer).toBe('function');
    });
});
