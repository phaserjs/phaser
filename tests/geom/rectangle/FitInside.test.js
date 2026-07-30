var FitInside = require('../../../src/geom/rectangle/FitInside');

function makeRect(x, y, width, height)
{
    var r = { x: x, y: y, width: width, height: height };

    r.centerX = x + width / 2;
    r.centerY = y + height / 2;

    r.setSize = function (w, h)
    {
        r.width = w;
        r.height = h;
        return r;
    };

    r.setPosition = function (px, py)
    {
        r.x = px;
        r.y = py;
        return r;
    };

    return r;
}

describe('Phaser.Geom.Rectangle.FitInside', function ()
{
    it('should return the target rectangle', function ()
    {
        var target = makeRect(0, 0, 100, 50);
        var source = makeRect(0, 0, 200, 200);
        var result = FitInside(target, source);

        expect(result).toBe(target);
    });

    it('should fit a wider-than-tall target inside a square source by width', function ()
    {
        // target ratio 2:1 > source ratio 1:1, so fit by width
        var target = makeRect(0, 0, 200, 100);
        var source = makeRect(0, 0, 100, 100);

        FitInside(target, source);

        expect(target.width).toBe(100);
        expect(target.height).toBeCloseTo(50);
    });

    it('should fit a taller-than-wide target inside a square source by height', function ()
    {
        // target ratio 1:2 < source ratio 1:1, so fit by height
        var target = makeRect(0, 0, 50, 100);
        var source = makeRect(0, 0, 100, 100);

        FitInside(target, source);

        expect(target.height).toBe(100);
        expect(target.width).toBeCloseTo(50);
    });

    it('should center the target within the source after fitting (wider target, square source)', function ()
    {
        var target = makeRect(0, 0, 200, 100);
        var source = makeRect(0, 0, 100, 100);

        FitInside(target, source);

        // source centerX = 50, source centerY = 50
        // target width = 100, height = 50
        expect(target.x).toBeCloseTo(0);   // 50 - 100/2
        expect(target.y).toBeCloseTo(25);  // 50 - 50/2
    });

    it('should center the target within the source after fitting (taller target, square source)', function ()
    {
        var target = makeRect(0, 0, 50, 100);
        var source = makeRect(0, 0, 100, 100);

        FitInside(target, source);

        // target height = 100, width = 50
        expect(target.x).toBeCloseTo(25);  // 50 - 50/2
        expect(target.y).toBeCloseTo(0);   // 50 - 100/2
    });

    it('should fit a square target inside a wider source by height', function ()
    {
        // target ratio 1:1, source ratio 2:1 => target ratio < source ratio => fit by height
        var target = makeRect(0, 0, 100, 100);
        var source = makeRect(0, 0, 200, 100);

        FitInside(target, source);

        expect(target.height).toBe(100);
        expect(target.width).toBeCloseTo(100);
    });

    it('should fit a square target inside a taller source by width', function ()
    {
        // target ratio 1:1, source ratio 0.5 => target ratio > source ratio => fit by width
        var target = makeRect(0, 0, 100, 100);
        var source = makeRect(0, 0, 100, 200);

        FitInside(target, source);

        expect(target.width).toBe(100);
        expect(target.height).toBeCloseTo(100);
    });

    it('should handle a non-zero source position when centering', function ()
    {
        var target = makeRect(0, 0, 200, 100);
        var source = makeRect(100, 50, 100, 100);

        FitInside(target, source);

        // source centerX = 150, source centerY = 100
        // target width = 100, height = 50
        expect(target.x).toBeCloseTo(100);   // 150 - 100/2
        expect(target.y).toBeCloseTo(75);    // 100 - 50/2
    });

    it('should preserve aspect ratio when fitting a wide target into a narrow tall source', function ()
    {
        // target 4:1 ratio, source 1:4 ratio => target ratio > source ratio => fit by width
        var target = makeRect(0, 0, 400, 100);
        var source = makeRect(0, 0, 50, 200);

        FitInside(target, source);

        var resultRatio = target.width / target.height;

        expect(resultRatio).toBeCloseTo(4);
        expect(target.width).toBeCloseTo(50);
        expect(target.height).toBeCloseTo(12.5);
    });

    it('should preserve aspect ratio when fitting a tall target into a wide short source', function ()
    {
        // target 1:4 ratio, source 4:1 ratio => target ratio < source ratio => fit by height
        var target = makeRect(0, 0, 50, 200);
        var source = makeRect(0, 0, 400, 100);

        FitInside(target, source);

        var resultRatio = target.width / target.height;

        expect(resultRatio).toBeCloseTo(0.25);
        expect(target.height).toBeCloseTo(100);
        expect(target.width).toBeCloseTo(25);
    });

    it('should fit correctly when target and source have equal aspect ratios', function ()
    {
        // equal ratios => goes to else branch (fit by width)
        var target = makeRect(0, 0, 200, 100);
        var source = makeRect(0, 0, 100, 50);

        FitInside(target, source);

        expect(target.width).toBeCloseTo(100);
        expect(target.height).toBeCloseTo(50);
    });

    it('should handle floating point dimensions', function ()
    {
        var target = makeRect(0, 0, 16, 9);
        var source = makeRect(0, 0, 800, 600);

        FitInside(target, source);

        var resultRatio = target.width / target.height;

        expect(resultRatio).toBeCloseTo(16 / 9);
    });

    it('should handle small source rectangles', function ()
    {
        var target = makeRect(0, 0, 100, 50);
        var source = makeRect(0, 0, 10, 10);

        FitInside(target, source);

        expect(target.width).toBe(10);
        expect(target.height).toBeCloseTo(5);
    });
});
