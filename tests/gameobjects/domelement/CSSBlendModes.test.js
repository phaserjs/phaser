var CSSBlendModes = require('../../../src/gameobjects/domelement/CSSBlendModes');

describe('CSSBlendModes', function ()
{
    it('should be an array', function ()
    {
        expect(Array.isArray(CSSBlendModes)).toBe(true);
    });

    it('should contain 17 entries', function ()
    {
        expect(CSSBlendModes.length).toBe(17);
    });

    it('should have normal at index 0', function ()
    {
        expect(CSSBlendModes[0]).toBe('normal');
    });

    it('should have multiply at index 1', function ()
    {
        expect(CSSBlendModes[1]).toBe('multiply');
    });

    it('should have multiply at index 2', function ()
    {
        expect(CSSBlendModes[2]).toBe('multiply');
    });

    it('should have screen at index 3', function ()
    {
        expect(CSSBlendModes[3]).toBe('screen');
    });

    it('should have overlay at index 4', function ()
    {
        expect(CSSBlendModes[4]).toBe('overlay');
    });

    it('should have darken at index 5', function ()
    {
        expect(CSSBlendModes[5]).toBe('darken');
    });

    it('should have lighten at index 6', function ()
    {
        expect(CSSBlendModes[6]).toBe('lighten');
    });

    it('should have color-dodge at index 7', function ()
    {
        expect(CSSBlendModes[7]).toBe('color-dodge');
    });

    it('should have color-burn at index 8', function ()
    {
        expect(CSSBlendModes[8]).toBe('color-burn');
    });

    it('should have hard-light at index 9', function ()
    {
        expect(CSSBlendModes[9]).toBe('hard-light');
    });

    it('should have soft-light at index 10', function ()
    {
        expect(CSSBlendModes[10]).toBe('soft-light');
    });

    it('should have difference at index 11', function ()
    {
        expect(CSSBlendModes[11]).toBe('difference');
    });

    it('should have exclusion at index 12', function ()
    {
        expect(CSSBlendModes[12]).toBe('exclusion');
    });

    it('should have hue at index 13', function ()
    {
        expect(CSSBlendModes[13]).toBe('hue');
    });

    it('should have saturation at index 14', function ()
    {
        expect(CSSBlendModes[14]).toBe('saturation');
    });

    it('should have color at index 15', function ()
    {
        expect(CSSBlendModes[15]).toBe('color');
    });

    it('should have luminosity at index 16', function ()
    {
        expect(CSSBlendModes[16]).toBe('luminosity');
    });

    it('should contain only string values', function ()
    {
        for (var i = 0; i < CSSBlendModes.length; i++)
        {
            expect(typeof CSSBlendModes[i]).toBe('string');
        }
    });

    it('should return undefined for out-of-bounds index', function ()
    {
        expect(CSSBlendModes[17]).toBeUndefined();
    });
});
