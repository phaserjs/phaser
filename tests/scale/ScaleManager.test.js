var ScaleManager = require('../../src/scale/ScaleManager');

describe('Phaser.Scale.ScaleManager', function ()
{
    describe('transformXY', function ()
    {
        var output;

        beforeEach(function ()
        {
            output = { x: 0, y: 0 };
        });

        it('should match the transformX/transformY math when no CSS transform is present', function ()
        {
            var manager = {
                _cssTransformInverse: null,
                canvasBounds: { left: 10, top: 20 },
                displayScale: { x: 2, y: 0.5 }
            };

            ScaleManager.prototype.transformXY.call(manager, 110, 120, output);

            expect(output.x).toBe(ScaleManager.prototype.transformX.call(manager, 110));
            expect(output.y).toBe(ScaleManager.prototype.transformY.call(manager, 120));
            expect(output.x).toBe(200);
            expect(output.y).toBe(50);
        });

        it('should invert a 90 degree CSS rotation', function ()
        {
            //  An 800x600 canvas rotated 90deg has a 600x800 AABB.
            //  The cached inverse is a -90deg rotation: [ 0  1 ]
            //                                           [ -1 0 ]
            var manager = {
                _cssTransformInverse: { a: 0, b: -1, c: 1, d: 0 },
                canvasBounds: { x: 0, y: 0, width: 600, height: 800 },
                canvas: { clientWidth: 800, clientHeight: 600 },
                baseSize: { width: 800, height: 600 }
            };

            //  Canvas-local (0, 0) lands at page (600, 0) after rotation
            ScaleManager.prototype.transformXY.call(manager, 600, 0, output);
            expect(output.x).toBeCloseTo(0);
            expect(output.y).toBeCloseTo(0);

            //  Canvas-local (800, 600) lands at page (0, 800)
            ScaleManager.prototype.transformXY.call(manager, 0, 800, output);
            expect(output.x).toBeCloseTo(800);
            expect(output.y).toBeCloseTo(600);

            //  The center is rotation-invariant
            ScaleManager.prototype.transformXY.call(manager, 300, 400, output);
            expect(output.x).toBeCloseTo(400);
            expect(output.y).toBeCloseTo(300);
        });

        it('should invert a CSS scale and map to game coordinates', function ()
        {
            //  A 400x300 canvas scaled 2x via CSS has an 800x600 AABB at (100, 50).
            //  The game resolution (baseSize) is 800x600.
            var manager = {
                _cssTransformInverse: { a: 0.5, b: 0, c: 0, d: 0.5 },
                canvasBounds: { x: 100, y: 50, width: 800, height: 600 },
                canvas: { clientWidth: 400, clientHeight: 300 },
                baseSize: { width: 800, height: 600 }
            };

            ScaleManager.prototype.transformXY.call(manager, 100, 50, output);
            expect(output.x).toBeCloseTo(0);
            expect(output.y).toBeCloseTo(0);

            ScaleManager.prototype.transformXY.call(manager, 500, 350, output);
            expect(output.x).toBeCloseTo(400);
            expect(output.y).toBeCloseTo(300);

            ScaleManager.prototype.transformXY.call(manager, 900, 650, output);
            expect(output.x).toBeCloseTo(800);
            expect(output.y).toBeCloseTo(600);
        });

        it('should return the output object', function ()
        {
            var manager = {
                _cssTransformInverse: null,
                canvasBounds: { left: 0, top: 0 },
                displayScale: { x: 1, y: 1 }
            };

            var result = ScaleManager.prototype.transformXY.call(manager, 5, 5, output);

            expect(result).toBe(output);
        });
    });

    describe('getInverseCSSTransform', function ()
    {
        it('should return null when DOMMatrix is unavailable or no transforms exist', function ()
        {
            //  jsdom does not implement DOMMatrix, and even if it did, this
            //  detached canvas has no CSS transforms anywhere in its chain.
            var manager = { canvas: document.createElement('canvas') };

            expect(ScaleManager.prototype.getInverseCSSTransform.call(manager)).toBeNull();
        });
    });
});
