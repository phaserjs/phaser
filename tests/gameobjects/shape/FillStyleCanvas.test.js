var FillStyleCanvas = require('../../../src/gameobjects/shape/FillStyleCanvas');

describe('FillStyleCanvas', function ()
{
    var ctx;
    var src;

    beforeEach(function ()
    {
        ctx = { fillStyle: '' };
        src = { fillColor: 0x000000, fillAlpha: 1 };
    });

    it('should be importable', function ()
    {
        expect(FillStyleCanvas).toBeDefined();
    });

    it('should set fillStyle on the context', function ()
    {
        src.fillColor = 0xFF0000;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src);

        expect(ctx.fillStyle).toBe('rgba(255,0,0,1)');
    });

    it('should correctly extract red channel from fillColor', function ()
    {
        src.fillColor = 0xFF0000;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src);

        expect(ctx.fillStyle).toBe('rgba(255,0,0,1)');
    });

    it('should correctly extract green channel from fillColor', function ()
    {
        src.fillColor = 0x00FF00;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src);

        expect(ctx.fillStyle).toBe('rgba(0,255,0,1)');
    });

    it('should correctly extract blue channel from fillColor', function ()
    {
        src.fillColor = 0x0000FF;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src);

        expect(ctx.fillStyle).toBe('rgba(0,0,255,1)');
    });

    it('should correctly handle white color', function ()
    {
        src.fillColor = 0xFFFFFF;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src);

        expect(ctx.fillStyle).toBe('rgba(255,255,255,1)');
    });

    it('should correctly handle black color', function ()
    {
        src.fillColor = 0x000000;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src);

        expect(ctx.fillStyle).toBe('rgba(0,0,0,1)');
    });

    it('should use fillAlpha from src', function ()
    {
        src.fillColor = 0xFF0000;
        src.fillAlpha = 0.5;

        FillStyleCanvas(ctx, src);

        expect(ctx.fillStyle).toBe('rgba(255,0,0,0.5)');
    });

    it('should use altColor when provided', function ()
    {
        src.fillColor = 0x000000;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src, 0x00FF00);

        expect(ctx.fillStyle).toBe('rgba(0,255,0,1)');
    });

    it('should use altAlpha when provided', function ()
    {
        src.fillColor = 0xFF0000;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src, 0, 0.25);

        expect(ctx.fillStyle).toBe('rgba(255,0,0,0.25)');
    });

    it('should use altColor and altAlpha together', function ()
    {
        src.fillColor = 0x000000;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src, 0x0000FF, 0.75);

        expect(ctx.fillStyle).toBe('rgba(0,0,255,0.75)');
    });

    it('should fall back to src.fillColor when altColor is zero', function ()
    {
        src.fillColor = 0xFF0000;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src, 0);

        expect(ctx.fillStyle).toBe('rgba(255,0,0,1)');
    });

    it('should fall back to src.fillAlpha when altAlpha is zero', function ()
    {
        src.fillColor = 0xFF0000;
        src.fillAlpha = 0.8;

        FillStyleCanvas(ctx, src, 0, 0);

        expect(ctx.fillStyle).toBe('rgba(255,0,0,0.8)');
    });

    it('should handle a mixed color correctly', function ()
    {
        src.fillColor = 0x336699;
        src.fillAlpha = 1;

        FillStyleCanvas(ctx, src);

        expect(ctx.fillStyle).toBe('rgba(51,102,153,1)');
    });

    it('should handle zero alpha from src', function ()
    {
        src.fillColor = 0xFF0000;
        src.fillAlpha = 0;

        FillStyleCanvas(ctx, src);

        expect(ctx.fillStyle).toBe('rgba(255,0,0,0)');
    });

    it('should handle full white with full alpha via altColor and altAlpha', function ()
    {
        src.fillColor = 0x000000;
        src.fillAlpha = 0;

        FillStyleCanvas(ctx, src, 0xFFFFFF, 1);

        expect(ctx.fillStyle).toBe('rgba(255,255,255,1)');
    });
});
