var DefaultGraphicsNodes = require('../../../../../src/renderer/webgl/renderNodes/defaults/DefaultGraphicsNodes');

describe('DefaultGraphicsNodes', function ()
{
    it('should be a Phaser Map instance', function ()
    {
        expect(DefaultGraphicsNodes).toBeDefined();
        expect(typeof DefaultGraphicsNodes).toBe('object');
    });

    it('should have a get method', function ()
    {
        expect(typeof DefaultGraphicsNodes.get).toBe('function');
    });

    it('should contain the Submitter entry mapped to BatchHandlerTriFlat', function ()
    {
        expect(DefaultGraphicsNodes.get('Submitter')).toBe('BatchHandlerTriFlat');
    });

    it('should contain the FillPath entry mapped to FillPath', function ()
    {
        expect(DefaultGraphicsNodes.get('FillPath')).toBe('FillPath');
    });

    it('should contain the FillRect entry mapped to FillRect', function ()
    {
        expect(DefaultGraphicsNodes.get('FillRect')).toBe('FillRect');
    });

    it('should contain the FillTri entry mapped to FillTri', function ()
    {
        expect(DefaultGraphicsNodes.get('FillTri')).toBe('FillTri');
    });

    it('should contain the StrokePath entry mapped to StrokePath', function ()
    {
        expect(DefaultGraphicsNodes.get('StrokePath')).toBe('StrokePath');
    });

    it('should return undefined for unknown keys', function ()
    {
        expect(DefaultGraphicsNodes.get('NonExistent')).toBeUndefined();
    });

    it('should have a size of 5', function ()
    {
        expect(DefaultGraphicsNodes.size).toBe(5);
    });

    it('should contain all expected keys', function ()
    {
        var keys = DefaultGraphicsNodes.keys();
        expect(keys).toContain('Submitter');
        expect(keys).toContain('FillPath');
        expect(keys).toContain('FillRect');
        expect(keys).toContain('FillTri');
        expect(keys).toContain('StrokePath');
    });

    it('should contain all expected values', function ()
    {
        var values = DefaultGraphicsNodes.values();
        expect(values).toContain('BatchHandlerTriFlat');
        expect(values).toContain('FillPath');
        expect(values).toContain('FillRect');
        expect(values).toContain('FillTri');
        expect(values).toContain('StrokePath');
    });

    it('should report has() as true for known keys', function ()
    {
        expect(DefaultGraphicsNodes.has('Submitter')).toBe(true);
        expect(DefaultGraphicsNodes.has('FillPath')).toBe(true);
        expect(DefaultGraphicsNodes.has('FillRect')).toBe(true);
        expect(DefaultGraphicsNodes.has('FillTri')).toBe(true);
        expect(DefaultGraphicsNodes.has('StrokePath')).toBe(true);
    });

    it('should report has() as false for unknown keys', function ()
    {
        expect(DefaultGraphicsNodes.has('NonExistent')).toBe(false);
        expect(DefaultGraphicsNodes.has('')).toBe(false);
    });
});
