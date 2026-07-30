var FitOutside = require('../../../src/geom/rectangle/FitOutside');

describe('Phaser.Geom.Rectangle.FitOutside', function ()
{
    function makeRect(x, y, width, height)
    {
        var rect = {
            x: x,
            y: y,
            width: width,
            height: height,
            get centerX() { return this.x + this.width / 2; },
            get centerY() { return this.y + this.height / 2; },
            setSize: function (w, h)
            {
                this.width = w;
                this.height = h;
                return this;
            },
            setPosition: function (x, y)
            {
                this.x = x;
                this.y = y;
                return this;
            }
        };
        return rect;
    }

    it('should return the target rectangle', function ()
    {
        var target = makeRect(0, 0, 200, 100);
        var source = makeRect(0, 0, 100, 100);
        var result = FitOutside(target, source);
        expect(result).toBe(target);
    });

    it('should fit a wider-than-tall target to cover a square source', function ()
    {
        // target ratio = 200/100 = 2, source ratio = 100/100 = 1
        // target is wider than source, so: width = source.height * ratio = 100 * 2 = 200, height = source.height = 100
        var target = makeRect(0, 0, 200, 100);
        var source = makeRect(0, 0, 100, 100);
        FitOutside(target, source);
        expect(target.width).toBe(200);
        expect(target.height).toBe(100);
    });

    it('should fit a taller-than-wide target to cover a square source', function ()
    {
        // target ratio = 100/200 = 0.5, source ratio = 100/100 = 1
        // target is taller than wide, so: width = source.width = 100, height = source.width / ratio = 100 / 0.5 = 200
        var target = makeRect(0, 0, 100, 200);
        var source = makeRect(0, 0, 100, 100);
        FitOutside(target, source);
        expect(target.width).toBe(100);
        expect(target.height).toBe(200);
    });

    it('should center the target over the source when target is wider', function ()
    {
        // target ratio = 2, source ratio = 1
        // new size: 200 x 100, source center = (50, 50)
        // position: x = 50 - 200/2 = -50, y = 50 - 100/2 = 0
        var target = makeRect(0, 0, 200, 100);
        var source = makeRect(0, 0, 100, 100);
        FitOutside(target, source);
        expect(target.x).toBe(-50);
        expect(target.y).toBe(0);
    });

    it('should center the target over the source when target is taller', function ()
    {
        // target ratio = 0.5, source ratio = 1
        // new size: 100 x 200, source center = (50, 50)
        // position: x = 50 - 100/2 = 0, y = 50 - 200/2 = -50
        var target = makeRect(0, 0, 100, 200);
        var source = makeRect(0, 0, 100, 100);
        FitOutside(target, source);
        expect(target.x).toBe(0);
        expect(target.y).toBe(-50);
    });

    it('should correctly fit target with same aspect ratio as source', function ()
    {
        // ratio equal: target 200x100 = 2, source 400x200 = 2
        // ratio is NOT > source ratio (equal), so goes to taller branch
        // width = source.width = 400, height = source.width / ratio = 400 / 2 = 200
        var target = makeRect(0, 0, 200, 100);
        var source = makeRect(0, 0, 400, 200);
        FitOutside(target, source);
        expect(target.width).toBe(400);
        expect(target.height).toBe(200);
    });

    it('should scale up a small target to cover a large source', function ()
    {
        // target ratio = 4/3, source ratio = 16/9 ≈ 1.78
        // 4/3 ≈ 1.33 < 1.78, so taller branch
        // width = source.width = 1920, height = 1920 / (4/3) = 1440
        var target = makeRect(0, 0, 4, 3);
        var source = makeRect(0, 0, 1920, 1080);
        FitOutside(target, source);
        expect(target.width).toBeCloseTo(1920);
        expect(target.height).toBeCloseTo(1440);
    });

    it('should scale a widescreen target to cover a 4:3 source', function ()
    {
        // target ratio = 16/9 ≈ 1.78, source ratio = 4/3 ≈ 1.33
        // target ratio > source ratio, so wider branch
        // width = source.height * ratio = 768 * (16/9), height = source.height = 768
        var target = makeRect(0, 0, 1280, 720);
        var source = makeRect(0, 0, 1024, 768);
        FitOutside(target, source);
        expect(target.height).toBe(768);
        expect(target.width).toBeCloseTo(768 * (16 / 9));
    });

    it('should center target over a non-origin source', function ()
    {
        // target ratio = 2, source ratio = 1
        // new size: 200 x 100, source center = (150, 150)
        // position: x = 150 - 200/2 = 50, y = 150 - 100/2 = 100
        var target = makeRect(0, 0, 200, 100);
        var source = makeRect(100, 100, 100, 100);
        FitOutside(target, source);
        expect(target.x).toBe(50);
        expect(target.y).toBe(100);
    });

    it('should handle a square target fitting a wider source', function ()
    {
        // target ratio = 1, source ratio = 2 (200x100)
        // target ratio NOT > source ratio, so taller branch
        // width = source.width = 200, height = 200 / 1 = 200
        var target = makeRect(0, 0, 50, 50);
        var source = makeRect(0, 0, 200, 100);
        FitOutside(target, source);
        expect(target.width).toBe(200);
        expect(target.height).toBe(200);
    });

    it('should handle a square target fitting a taller source', function ()
    {
        // target ratio = 1, source ratio = 0.5 (100x200)
        // target ratio > source ratio (1 > 0.5), so wider branch
        // width = source.height * ratio = 200 * 1 = 200, height = source.height = 200
        var target = makeRect(0, 0, 50, 50);
        var source = makeRect(0, 0, 100, 200);
        FitOutside(target, source);
        expect(target.width).toBe(200);
        expect(target.height).toBe(200);
    });

    it('should maintain target aspect ratio after fitting', function ()
    {
        var targetRatio = 16 / 9;
        var target = makeRect(0, 0, 160, 90);
        var source = makeRect(0, 0, 300, 400);
        FitOutside(target, source);
        expect(target.width / target.height).toBeCloseTo(targetRatio);
    });

    it('should ensure fitted target covers the source entirely', function ()
    {
        var target = makeRect(0, 0, 160, 90);
        var source = makeRect(0, 0, 300, 400);
        FitOutside(target, source);
        expect(target.width).toBeGreaterThanOrEqual(source.width);
        expect(target.height).toBeGreaterThanOrEqual(source.height);
    });

    it('should ensure fitted target covers source for wider target ratio', function ()
    {
        var target = makeRect(0, 0, 1920, 100);
        var source = makeRect(0, 0, 300, 400);
        FitOutside(target, source);
        expect(target.width).toBeGreaterThanOrEqual(source.width);
        expect(target.height).toBeGreaterThanOrEqual(source.height);
    });

    it('should work with floating point dimensions', function ()
    {
        var target = makeRect(0, 0, 16.5, 9.5);
        var source = makeRect(0, 0, 100, 100);
        FitOutside(target, source);
        var ratio = 16.5 / 9.5;
        // ratio ≈ 1.737 > 1, so wider branch: width = 100 * ratio, height = 100
        expect(target.height).toBeCloseTo(100);
        expect(target.width).toBeCloseTo(100 * ratio);
    });
});
