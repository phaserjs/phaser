var BatchChar = require('../../../src/gameobjects/bitmaptext/BatchChar');

describe('BatchChar', function ()
{
    var drawingContext;
    var submitterNode;
    var src;
    var char;
    var glyph;
    var calcMatrix;
    var tintData;
    var capturedArgs;

    beforeEach(function ()
    {
        capturedArgs = null;

        drawingContext = {};

        submitterNode = {
            run: vi.fn(function (dc, s, u, n, td, trd, tint)
            {
                capturedArgs = {
                    drawingContext: dc,
                    src: s,
                    third: u,
                    fourth: n,
                    textureData: td,
                    transformData: trd,
                    tintData: tint
                };
            })
        };

        src = {
            frame: { key: 'testFrame' },
            displayOriginX: 0,
            displayOriginY: 0
        };

        char = {
            x: 10,
            y: 20,
            w: 16,
            h: 24
        };

        glyph = { x: 0, y: 0, w: 16, h: 24 };

        calcMatrix = {
            a: 1, b: 0,
            c: 0, d: 1,
            e: 0, f: 0
        };

        tintData = { tintFill: false, tintTL: 0xffffff, tintTR: 0xffffff, tintBL: 0xffffff, tintBR: 0xffffff };
    });

    it('should be importable', function ()
    {
        expect(BatchChar).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof BatchChar).toBe('function');
    });

    it('should call submitterNode.run once', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(submitterNode.run).toHaveBeenCalledTimes(1);
    });

    it('should pass drawingContext as first argument to submitterNode.run', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(capturedArgs.drawingContext).toBe(drawingContext);
    });

    it('should pass src as second argument to submitterNode.run', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(capturedArgs.src).toBe(src);
    });

    it('should pass undefined as third argument to submitterNode.run', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(capturedArgs.third).toBeUndefined();
    });

    it('should pass zero as fourth argument to submitterNode.run', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(capturedArgs.fourth).toBe(0);
    });

    it('should pass tintData as last argument to submitterNode.run', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(capturedArgs.tintData).toBe(tintData);
    });

    it('should set textureData frame to src.frame', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(capturedArgs.textureData.frame).toBe(src.frame);
    });

    it('should set textureData uvSource to glyph', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(capturedArgs.textureData.uvSource).toBe(glyph);
    });

    it('should compute identity matrix quad correctly with no offsets', function ()
    {
        // identity matrix: a=1 b=0 c=0 d=1 e=0 f=0
        // char.x=10 char.y=20 char.w=16 char.h=24 displayOriginX=0 displayOriginY=0
        // x=10 y=20 xw=26 yh=44
        // tx0=10 ty0=20, tx1=10 ty1=44, tx2=26 ty2=44, tx3=26 ty3=20
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(10);
        expect(quad[1]).toBeCloseTo(20);
        expect(quad[2]).toBeCloseTo(10);
        expect(quad[3]).toBeCloseTo(44);
        expect(quad[4]).toBeCloseTo(26);
        expect(quad[5]).toBeCloseTo(44);
        expect(quad[6]).toBeCloseTo(26);
        expect(quad[7]).toBeCloseTo(20);
    });

    it('should apply offsetX and offsetY to quad positions', function ()
    {
        // offsetX=5 offsetY=10 => x=15 y=30 xw=31 yh=54
        BatchChar(drawingContext, submitterNode, src, char, glyph, 5, 10, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(15);
        expect(quad[1]).toBeCloseTo(30);
        expect(quad[2]).toBeCloseTo(15);
        expect(quad[3]).toBeCloseTo(54);
        expect(quad[4]).toBeCloseTo(31);
        expect(quad[5]).toBeCloseTo(54);
        expect(quad[6]).toBeCloseTo(31);
        expect(quad[7]).toBeCloseTo(30);
    });

    it('should subtract displayOriginX and displayOriginY from position', function ()
    {
        src.displayOriginX = 4;
        src.displayOriginY = 8;
        // x = (10-4)+0 = 6, y = (20-8)+0 = 12, xw=22 yh=36

        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(6);
        expect(quad[1]).toBeCloseTo(12);
        expect(quad[2]).toBeCloseTo(6);
        expect(quad[3]).toBeCloseTo(36);
        expect(quad[4]).toBeCloseTo(22);
        expect(quad[5]).toBeCloseTo(36);
        expect(quad[6]).toBeCloseTo(22);
        expect(quad[7]).toBeCloseTo(12);
    });

    it('should apply matrix translation (e and f)', function ()
    {
        calcMatrix.e = 100;
        calcMatrix.f = 200;
        // identity + translation: tx0=10+100=110, ty0=20+200=220

        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(110);
        expect(quad[1]).toBeCloseTo(220);
        expect(quad[4]).toBeCloseTo(126);
        expect(quad[5]).toBeCloseTo(244);
    });

    it('should apply matrix scaling via a and d', function ()
    {
        calcMatrix.a = 2;
        calcMatrix.d = 3;
        // x=10 y=20 xw=26 yh=44
        // tx0 = 10*2 + 20*0 + 0 = 20
        // ty0 = 10*0 + 20*3 + 0 = 60
        // tx2 = 26*2 + 44*0 + 0 = 52
        // ty2 = 26*0 + 44*3 + 0 = 132

        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(20);
        expect(quad[1]).toBeCloseTo(60);
        expect(quad[4]).toBeCloseTo(52);
        expect(quad[5]).toBeCloseTo(132);
    });

    it('should apply matrix rotation via b and c', function ()
    {
        // 90 degree rotation: a=0 b=1 c=-1 d=0
        calcMatrix.a = 0;
        calcMatrix.b = 1;
        calcMatrix.c = -1;
        calcMatrix.d = 0;
        // x=10 y=20 xw=26 yh=44
        // tx0 = 10*0 + 20*(-1) + 0 = -20
        // ty0 = 10*1 + 20*0   + 0 =  10
        // tx2 = 26*0 + 44*(-1) + 0 = -44
        // ty2 = 26*1 + 44*0   + 0 =  26

        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(-20);
        expect(quad[1]).toBeCloseTo(10);
        expect(quad[4]).toBeCloseTo(-44);
        expect(quad[5]).toBeCloseTo(26);
    });

    it('should handle zero-size character', function ()
    {
        char.w = 0;
        char.h = 0;
        // x=10 y=20 xw=10 yh=20 — all corners collapse to same point

        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(10);
        expect(quad[1]).toBeCloseTo(20);
        expect(quad[2]).toBeCloseTo(10);
        expect(quad[3]).toBeCloseTo(20);
        expect(quad[4]).toBeCloseTo(10);
        expect(quad[5]).toBeCloseTo(20);
        expect(quad[6]).toBeCloseTo(10);
        expect(quad[7]).toBeCloseTo(20);
    });

    it('should handle negative char coordinates', function ()
    {
        char.x = -5;
        char.y = -10;
        // x=-5 y=-10 xw=11 yh=14 (identity matrix)

        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(-5);
        expect(quad[1]).toBeCloseTo(-10);
        expect(quad[4]).toBeCloseTo(11);
        expect(quad[5]).toBeCloseTo(14);
    });

    it('should handle negative offsets', function ()
    {
        // x = (10-0) + (-3) = 7, y = (20-0) + (-5) = 15

        BatchChar(drawingContext, submitterNode, src, char, glyph, -3, -5, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(7);
        expect(quad[1]).toBeCloseTo(15);
    });

    it('should update textureData frame when src.frame changes', function ()
    {
        var frameA = { key: 'frameA' };
        var frameB = { key: 'frameB' };

        src.frame = frameA;
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);
        expect(capturedArgs.textureData.frame).toBe(frameA);

        src.frame = frameB;
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);
        expect(capturedArgs.textureData.frame).toBe(frameB);
    });

    it('should update textureData uvSource when glyph changes', function ()
    {
        var glyphA = { x: 0 };
        var glyphB = { x: 16 };

        BatchChar(drawingContext, submitterNode, src, char, glyphA, 0, 0, calcMatrix, tintData);
        expect(capturedArgs.textureData.uvSource).toBe(glyphA);

        BatchChar(drawingContext, submitterNode, src, char, glyphB, 0, 0, calcMatrix, tintData);
        expect(capturedArgs.textureData.uvSource).toBe(glyphB);
    });

    it('should pass a Float32Array as the quad in transformData', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(capturedArgs.transformData.quad).toBeInstanceOf(Float32Array);
    });

    it('should pass transformData with exactly 8 quad values', function ()
    {
        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        expect(capturedArgs.transformData.quad.length).toBe(8);
    });

    it('should work with floating point matrix values', function ()
    {
        calcMatrix.a = 0.5;
        calcMatrix.b = 0.25;
        calcMatrix.c = -0.25;
        calcMatrix.d = 0.5;
        // x=10 y=20 xw=26 yh=44
        // tx0 = 10*0.5 + 20*(-0.25) + 0 = 5 - 5 = 0
        // ty0 = 10*0.25 + 20*0.5   + 0 = 2.5 + 10 = 12.5

        BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tintData);

        var quad = capturedArgs.transformData.quad;

        expect(quad[0]).toBeCloseTo(0);
        expect(quad[1]).toBeCloseTo(12.5);
    });
});
