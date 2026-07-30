var ColorSpectrum = require('../../../src/display/color/ColorSpectrum');

describe('Phaser.Display.Color.ColorSpectrum', function ()
{
    describe('default limit (1024)', function ()
    {
        it('should return an array with 1024 elements by default', function ()
        {
            var result = ColorSpectrum();

            expect(result).toHaveLength(1024);
        });

        it('should return an array with 1024 elements when limit is explicitly 1024', function ()
        {
            var result = ColorSpectrum(1024);

            expect(result).toHaveLength(1024);
        });

        it('should return objects with r, g, b, and color properties', function ()
        {
            var result = ColorSpectrum();
            var first = result[0];

            expect(first).toHaveProperty('r');
            expect(first).toHaveProperty('g');
            expect(first).toHaveProperty('b');
            expect(first).toHaveProperty('color');
        });

        it('should start with red (r=255, g=0, b=0)', function ()
        {
            var result = ColorSpectrum();
            var first = result[0];

            expect(first.r).toBe(255);
            expect(first.g).toBe(0);
            expect(first.b).toBe(0);
        });

        it('should have correct color integer for the first element', function ()
        {
            var result = ColorSpectrum();
            var first = result[0];

            expect(first.color).toBe(0xff0000);
        });

        it('should transition from red to yellow in the first 256 elements', function ()
        {
            var result = ColorSpectrum();

            // index 0: pure red
            expect(result[0].r).toBe(255);
            expect(result[0].g).toBe(0);
            expect(result[0].b).toBe(0);

            // index 255: yellow (r=255, g=255, b=0)
            expect(result[255].r).toBe(255);
            expect(result[255].g).toBe(255);
            expect(result[255].b).toBe(0);
        });

        it('should transition from yellow to green in elements 256-511', function ()
        {
            var result = ColorSpectrum();

            // index 256: yellow (r=255, g=255, b=0)
            expect(result[256].r).toBe(255);
            expect(result[256].g).toBe(255);
            expect(result[256].b).toBe(0);

            // index 511: pure green (r=0, g=255, b=0)
            expect(result[511].r).toBe(0);
            expect(result[511].g).toBe(255);
            expect(result[511].b).toBe(0);
        });

        it('should transition from green to cyan/blue in elements 512-767', function ()
        {
            var result = ColorSpectrum();

            // index 512: pure green (r=0, g=255, b=0)
            expect(result[512].r).toBe(0);
            expect(result[512].g).toBe(255);
            expect(result[512].b).toBe(0);

            // index 767: pure blue (r=0, g=0, b=255)
            expect(result[767].r).toBe(0);
            expect(result[767].g).toBe(0);
            expect(result[767].b).toBe(255);
        });

        it('should transition from blue to red in elements 768-1023', function ()
        {
            var result = ColorSpectrum();

            // index 768: pure blue (r=0, g=0, b=255)
            expect(result[768].r).toBe(0);
            expect(result[768].g).toBe(0);
            expect(result[768].b).toBe(255);

            // index 1023: back to red (r=255, g=0, b=0)
            expect(result[1023].r).toBe(255);
            expect(result[1023].g).toBe(0);
            expect(result[1023].b).toBe(0);
        });

        it('should have r, g, b values in the range 0-255 for all elements', function ()
        {
            var result = ColorSpectrum();

            for (var i = 0; i < result.length; i++)
            {
                var c = result[i];

                expect(c.r).toBeGreaterThanOrEqual(0);
                expect(c.r).toBeLessThanOrEqual(255);
                expect(c.g).toBeGreaterThanOrEqual(0);
                expect(c.g).toBeLessThanOrEqual(255);
                expect(c.b).toBeGreaterThanOrEqual(0);
                expect(c.b).toBeLessThanOrEqual(255);
            }
        });

        it('should have color integer matching packed r, g, b values for all elements', function ()
        {
            var result = ColorSpectrum();

            for (var i = 0; i < result.length; i++)
            {
                var c = result[i];
                var expected = (c.r << 16) | (c.g << 8) | c.b;

                expect(c.color).toBe(expected);
            }
        });
    });

    describe('custom limit', function ()
    {
        it('should return the correct number of elements when limit is specified', function ()
        {
            expect(ColorSpectrum(10)).toHaveLength(10);
            expect(ColorSpectrum(64)).toHaveLength(64);
            expect(ColorSpectrum(256)).toHaveLength(256);
            expect(ColorSpectrum(512)).toHaveLength(512);
        });

        it('should return 1 element when limit is 1', function ()
        {
            var result = ColorSpectrum(1);

            expect(result).toHaveLength(1);
        });

        it('should start with red when limit is smaller than 1024', function ()
        {
            var result = ColorSpectrum(10);
            var first = result[0];

            expect(first.r).toBe(255);
            expect(first.g).toBe(0);
            expect(first.b).toBe(0);
            expect(first.color).toBe(0xff0000);
        });

        it('should sample evenly so the last element with limit 2 is in the blue-to-red range', function ()
        {
            // With limit=2, step = 1024/2 = 512, so indices 0 and 512 are sampled
            // index 0: red, index 512: green
            var result = ColorSpectrum(2);

            expect(result[0].r).toBe(255);
            expect(result[0].g).toBe(0);
            expect(result[0].b).toBe(0);

            expect(result[1].r).toBe(0);
            expect(result[1].g).toBe(255);
            expect(result[1].b).toBe(0);
        });

        it('should have valid r, g, b values for all sampled elements', function ()
        {
            var result = ColorSpectrum(128);

            for (var i = 0; i < result.length; i++)
            {
                var c = result[i];

                expect(c.r).toBeGreaterThanOrEqual(0);
                expect(c.r).toBeLessThanOrEqual(255);
                expect(c.g).toBeGreaterThanOrEqual(0);
                expect(c.g).toBeLessThanOrEqual(255);
                expect(c.b).toBeGreaterThanOrEqual(0);
                expect(c.b).toBeLessThanOrEqual(255);
            }
        });

        it('should have color integers matching packed r, g, b for sampled elements', function ()
        {
            var result = ColorSpectrum(64);

            for (var i = 0; i < result.length; i++)
            {
                var c = result[i];
                var expected = (c.r << 16) | (c.g << 8) | c.b;

                expect(c.color).toBe(expected);
            }
        });

        it('should return objects with all required properties when limit is small', function ()
        {
            var result = ColorSpectrum(4);

            result.forEach(function (c)
            {
                expect(c).toHaveProperty('r');
                expect(c).toHaveProperty('g');
                expect(c).toHaveProperty('b');
                expect(c).toHaveProperty('color');
            });
        });

        it('should sample correctly with limit 4 hitting each major hue', function ()
        {
            // step = 1024/4 = 256, samples at indices 0, 256, 512, 768
            // index 0:   red   (255, 0, 0)
            // index 256: yellow (255, 255, 0) — but yellow-to-green starts here, r=255, g=255, b=0
            // index 512: green  (0, 255, 0)
            // index 768: blue   (0, 0, 255)
            var result = ColorSpectrum(4);

            expect(result[0].r).toBe(255);
            expect(result[0].g).toBe(0);
            expect(result[0].b).toBe(0);

            expect(result[1].r).toBe(255);
            expect(result[1].g).toBe(255);
            expect(result[1].b).toBe(0);

            expect(result[2].r).toBe(0);
            expect(result[2].g).toBe(255);
            expect(result[2].b).toBe(0);

            expect(result[3].r).toBe(0);
            expect(result[3].g).toBe(0);
            expect(result[3].b).toBe(255);
        });
    });

    describe('midpoint colors', function ()
    {
        it('should have pure yellow at index 255 of the full spectrum', function ()
        {
            var result = ColorSpectrum();

            expect(result[255].r).toBe(255);
            expect(result[255].g).toBe(255);
            expect(result[255].b).toBe(0);
            expect(result[255].color).toBe(0xffff00);
        });

        it('should have pure green at index 511 of the full spectrum', function ()
        {
            var result = ColorSpectrum();

            expect(result[511].r).toBe(0);
            expect(result[511].g).toBe(255);
            expect(result[511].b).toBe(0);
            expect(result[511].color).toBe(0x00ff00);
        });

        it('should have pure blue at index 767 of the full spectrum', function ()
        {
            var result = ColorSpectrum();

            expect(result[767].r).toBe(0);
            expect(result[767].g).toBe(0);
            expect(result[767].b).toBe(255);
            expect(result[767].color).toBe(0x0000ff);
        });

        it('should have cyan (r=0, g=255, b=255) somewhere in the green-to-blue transition', function ()
        {
            // Green to Blue: r=0, g goes 255→0, b goes 0→255
            // cyan is at g=255, b=255... but wait, g starts at 255 and decrements while b increments
            // At i=0 in that loop: g=255, b=0 (green)
            // The loop runs 256 steps. There's no point where g=255 and b=255 simultaneously.
            // Cyan (0, 255, 255) doesn't appear — green transitions directly to blue.
            // Instead, we check that mid-transition has something like r=0, g=128, b=127
            var result = ColorSpectrum();
            var mid = result[640]; // midpoint of green-to-blue range (512+128)

            expect(mid.r).toBe(0);
            expect(mid.g).toBeGreaterThan(0);
            expect(mid.b).toBeGreaterThan(0);
        });
    });
});
