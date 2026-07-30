var LineStyleCanvas = require('../../../src/gameobjects/shape/LineStyleCanvas');

describe('LineStyleCanvas', function ()
{
    var ctx;
    var src;

    beforeEach(function ()
    {
        ctx = {
            strokeStyle: '',
            lineWidth: 0
        };

        src = {
            strokeColor: 0x000000,
            strokeAlpha: 1,
            lineWidth: 1
        };
    });

    it('should set strokeStyle from src.strokeColor when no altColor provided', function ()
    {
        src.strokeColor = 0xFF0000;
        src.strokeAlpha = 1;

        LineStyleCanvas(ctx, src);

        expect(ctx.strokeStyle).toBe('rgba(255,0,0,1)');
    });

    it('should set strokeStyle using altColor when provided', function ()
    {
        src.strokeColor = 0xFF0000;
        src.strokeAlpha = 1;

        LineStyleCanvas(ctx, src, 0x00FF00, 1);

        expect(ctx.strokeStyle).toBe('rgba(0,255,0,1)');
    });

    it('should set strokeStyle using altAlpha when provided', function ()
    {
        src.strokeColor = 0xFFFFFF;
        src.strokeAlpha = 1;

        LineStyleCanvas(ctx, src, 0xFFFFFF, 0.5);

        expect(ctx.strokeStyle).toBe('rgba(255,255,255,0.5)');
    });

    it('should use src.strokeAlpha when no altAlpha provided', function ()
    {
        src.strokeColor = 0xFFFFFF;
        src.strokeAlpha = 0.75;

        LineStyleCanvas(ctx, src);

        expect(ctx.strokeStyle).toBe('rgba(255,255,255,0.75)');
    });

    it('should set lineWidth from src.lineWidth', function ()
    {
        src.lineWidth = 4;

        LineStyleCanvas(ctx, src);

        expect(ctx.lineWidth).toBe(4);
    });

    it('should correctly extract red channel from color', function ()
    {
        src.strokeColor = 0xAB0000;

        LineStyleCanvas(ctx, src);

        expect(ctx.strokeStyle).toBe('rgba(171,0,0,1)');
    });

    it('should correctly extract green channel from color', function ()
    {
        src.strokeColor = 0x00CD00;

        LineStyleCanvas(ctx, src);

        expect(ctx.strokeStyle).toBe('rgba(0,205,0,1)');
    });

    it('should correctly extract blue channel from color', function ()
    {
        src.strokeColor = 0x0000EF;

        LineStyleCanvas(ctx, src);

        expect(ctx.strokeStyle).toBe('rgba(0,0,239,1)');
    });

    it('should handle black color', function ()
    {
        src.strokeColor = 0x000000;
        src.strokeAlpha = 1;

        LineStyleCanvas(ctx, src);

        expect(ctx.strokeStyle).toBe('rgba(0,0,0,1)');
    });

    it('should handle white color', function ()
    {
        src.strokeColor = 0xFFFFFF;
        src.strokeAlpha = 1;

        LineStyleCanvas(ctx, src);

        expect(ctx.strokeStyle).toBe('rgba(255,255,255,1)');
    });

    it('should handle zero alpha', function ()
    {
        src.strokeColor = 0xFF0000;
        src.strokeAlpha = 0;

        LineStyleCanvas(ctx, src);

        expect(ctx.strokeStyle).toBe('rgba(255,0,0,0)');
    });

    it('should use altColor and altAlpha together when both provided', function ()
    {
        src.strokeColor = 0x000000;
        src.strokeAlpha = 0;

        LineStyleCanvas(ctx, src, 0x1020FF, 0.3);

        expect(ctx.strokeStyle).toBe('rgba(16,32,255,0.3)');
    });

    it('should use src values when altColor is 0 (falsy)', function ()
    {
        src.strokeColor = 0xFF0000;
        src.strokeAlpha = 1;

        LineStyleCanvas(ctx, src, 0, 1);

        expect(ctx.strokeStyle).toBe('rgba(255,0,0,1)');
    });

    it('should use src.strokeAlpha when altAlpha is 0 (falsy)', function ()
    {
        src.strokeColor = 0xFFFFFF;
        src.strokeAlpha = 0.9;

        LineStyleCanvas(ctx, src, 0xFFFFFF, 0);

        expect(ctx.strokeStyle).toBe('rgba(255,255,255,0.9)');
    });

    it('should set lineWidth to zero when src.lineWidth is 0', function ()
    {
        src.lineWidth = 0;

        LineStyleCanvas(ctx, src);

        expect(ctx.lineWidth).toBe(0);
    });

    it('should set lineWidth to fractional values', function ()
    {
        src.lineWidth = 1.5;

        LineStyleCanvas(ctx, src);

        expect(ctx.lineWidth).toBe(1.5);
    });
});
