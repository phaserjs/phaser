var GetBounds = require('../../../src/gameobjects/components/GetBounds');

function createGameObject (props)
{
    var defaults = {
        x: 0,
        y: 0,
        displayWidth: 100,
        displayHeight: 100,
        originX: 0.5,
        originY: 0.5,
        rotation: 0,
        parentContainer: null
    };

    var obj = Object.assign({}, defaults, props);

    obj.getTopLeft = function (output, includeParent) { return GetBounds.getTopLeft.call(this, output, includeParent); };
    obj.getTopRight = function (output, includeParent) { return GetBounds.getTopRight.call(this, output, includeParent); };
    obj.getBottomLeft = function (output, includeParent) { return GetBounds.getBottomLeft.call(this, output, includeParent); };
    obj.getBottomRight = function (output, includeParent) { return GetBounds.getBottomRight.call(this, output, includeParent); };
    obj.prepareBoundsOutput = function (output, includeParent) { return GetBounds.prepareBoundsOutput.call(this, output, includeParent); };

    return obj;
}

describe('GetBounds', function ()
{
    describe('getCenter', function ()
    {
        it('should return the center of a game object with default origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getCenter.call(go);

            expect(result.x).toBe(100);
            expect(result.y).toBe(100);
        });

        it('should return the center when origin is (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getCenter.call(go);

            expect(result.x).toBe(200);
            expect(result.y).toBe(150);
        });

        it('should return the center when origin is (1, 1)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 1, originY: 1 });
            var result = GetBounds.getCenter.call(go);

            expect(result.x).toBe(0);
            expect(result.y).toBe(50);
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 0, y: 0, displayWidth: 100, displayHeight: 100 });
            var output = { x: 0, y: 0 };
            var result = GetBounds.getCenter.call(go, output);

            expect(result).toBe(output);
            expect(output.x).toBe(0);
            expect(output.y).toBe(0);
        });

        it('should create a new Vector2 when no output is provided', function ()
        {
            var go = createGameObject({ x: 50, y: 50, displayWidth: 100, displayHeight: 100 });
            var result = GetBounds.getCenter.call(go);

            expect(result).toBeDefined();
            expect(typeof result.x).toBe('number');
            expect(typeof result.y).toBe('number');
        });

        it('should account for rotation', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 100, displayHeight: 100, rotation: Math.PI / 2 });
            var result = GetBounds.getCenter.call(go);

            // Center with origin 0.5 is at the same position as x,y, rotation around itself = same point
            expect(result.x).toBeCloseTo(100);
            expect(result.y).toBeCloseTo(100);
        });
    });

    describe('getTopLeft', function ()
    {
        it('should return the top-left corner with origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getTopLeft.call(go);

            expect(result.x).toBe(0);
            expect(result.y).toBe(50);
        });

        it('should return the top-left corner with origin (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getTopLeft.call(go);

            expect(result.x).toBe(100);
            expect(result.y).toBe(100);
        });

        it('should return the top-left corner with origin (1, 1)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 1, originY: 1 });
            var result = GetBounds.getTopLeft.call(go);

            expect(result.x).toBe(-100);
            expect(result.y).toBe(0);
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var output = { x: 0, y: 0 };
            var result = GetBounds.getTopLeft.call(go, output);

            expect(result).toBe(output);
            expect(output.x).toBe(0);
            expect(output.y).toBe(50);
        });

        it('should apply rotation around the game object position', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 100, displayHeight: 100, rotation: Math.PI });
            var result = GetBounds.getTopLeft.call(go);

            // Top-left before rotation: x=50, y=50. Rotated 180deg around (100,100) => x=150, y=150
            expect(result.x).toBeCloseTo(150);
            expect(result.y).toBeCloseTo(150);
        });
    });

    describe('getTopCenter', function ()
    {
        it('should return the top-center edge midpoint with origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getTopCenter.call(go);

            expect(result.x).toBe(100);
            expect(result.y).toBe(50);
        });

        it('should return the top-center edge midpoint with origin (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getTopCenter.call(go);

            expect(result.x).toBe(200);
            expect(result.y).toBe(100);
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var output = { x: 0, y: 0 };
            var result = GetBounds.getTopCenter.call(go, output);

            expect(result).toBe(output);
            expect(output.x).toBe(100);
            expect(output.y).toBe(50);
        });
    });

    describe('getTopRight', function ()
    {
        it('should return the top-right corner with origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getTopRight.call(go);

            expect(result.x).toBe(200);
            expect(result.y).toBe(50);
        });

        it('should return the top-right corner with origin (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getTopRight.call(go);

            expect(result.x).toBe(300);
            expect(result.y).toBe(100);
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var output = { x: 0, y: 0 };
            var result = GetBounds.getTopRight.call(go, output);

            expect(result).toBe(output);
            expect(output.x).toBe(200);
            expect(output.y).toBe(50);
        });

        it('should apply rotation around the game object position', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 100, displayHeight: 100, rotation: Math.PI });
            var result = GetBounds.getTopRight.call(go);

            // Top-right before rotation: x=150, y=50. Rotated 180deg around (100,100) => x=50, y=150
            expect(result.x).toBeCloseTo(50);
            expect(result.y).toBeCloseTo(150);
        });
    });

    describe('getLeftCenter', function ()
    {
        it('should return the left-center edge midpoint with origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getLeftCenter.call(go);

            expect(result.x).toBe(0);
            expect(result.y).toBe(100);
        });

        it('should return the left-center edge midpoint with origin (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getLeftCenter.call(go);

            expect(result.x).toBe(100);
            expect(result.y).toBe(150);
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var output = { x: 0, y: 0 };
            var result = GetBounds.getLeftCenter.call(go, output);

            expect(result).toBe(output);
            expect(output.x).toBe(0);
            expect(output.y).toBe(100);
        });
    });

    describe('getRightCenter', function ()
    {
        it('should return the right-center edge midpoint with origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getRightCenter.call(go);

            expect(result.x).toBe(200);
            expect(result.y).toBe(100);
        });

        it('should return the right-center edge midpoint with origin (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getRightCenter.call(go);

            expect(result.x).toBe(300);
            expect(result.y).toBe(150);
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var output = { x: 0, y: 0 };
            var result = GetBounds.getRightCenter.call(go, output);

            expect(result).toBe(output);
            expect(output.x).toBe(200);
            expect(output.y).toBe(100);
        });
    });

    describe('getBottomLeft', function ()
    {
        it('should return the bottom-left corner with origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getBottomLeft.call(go);

            expect(result.x).toBe(0);
            expect(result.y).toBe(150);
        });

        it('should return the bottom-left corner with origin (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getBottomLeft.call(go);

            expect(result.x).toBe(100);
            expect(result.y).toBe(200);
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var output = { x: 0, y: 0 };
            var result = GetBounds.getBottomLeft.call(go, output);

            expect(result).toBe(output);
            expect(output.x).toBe(0);
            expect(output.y).toBe(150);
        });

        it('should apply rotation around the game object position', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 100, displayHeight: 100, rotation: Math.PI });
            var result = GetBounds.getBottomLeft.call(go);

            // Bottom-left before rotation: x=50, y=150. Rotated 180deg around (100,100) => x=150, y=50
            expect(result.x).toBeCloseTo(150);
            expect(result.y).toBeCloseTo(50);
        });
    });

    describe('getBottomCenter', function ()
    {
        it('should return the bottom-center edge midpoint with origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getBottomCenter.call(go);

            expect(result.x).toBe(100);
            expect(result.y).toBe(150);
        });

        it('should return the bottom-center edge midpoint with origin (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getBottomCenter.call(go);

            expect(result.x).toBe(200);
            expect(result.y).toBe(200);
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var output = { x: 0, y: 0 };
            var result = GetBounds.getBottomCenter.call(go, output);

            expect(result).toBe(output);
            expect(output.x).toBe(100);
            expect(output.y).toBe(150);
        });
    });

    describe('getBottomRight', function ()
    {
        it('should return the bottom-right corner with origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getBottomRight.call(go);

            expect(result.x).toBe(200);
            expect(result.y).toBe(150);
        });

        it('should return the bottom-right corner with origin (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getBottomRight.call(go);

            expect(result.x).toBe(300);
            expect(result.y).toBe(200);
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var output = { x: 0, y: 0 };
            var result = GetBounds.getBottomRight.call(go, output);

            expect(result).toBe(output);
            expect(output.x).toBe(200);
            expect(output.y).toBe(150);
        });

        it('should apply rotation around the game object position', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 100, displayHeight: 100, rotation: Math.PI });
            var result = GetBounds.getBottomRight.call(go);

            // Bottom-right before rotation: x=150, y=150. Rotated 180deg around (100,100) => x=50, y=50
            expect(result.x).toBeCloseTo(50);
            expect(result.y).toBeCloseTo(50);
        });
    });

    describe('getBounds', function ()
    {
        it('should return correct bounds for an unrotated game object with origin (0.5, 0.5)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var result = GetBounds.getBounds.call(go);

            expect(result.x).toBe(0);
            expect(result.y).toBe(50);
            expect(result.width).toBe(200);
            expect(result.height).toBe(100);
        });

        it('should return correct bounds for an unrotated game object with origin (0, 0)', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, originX: 0, originY: 0 });
            var result = GetBounds.getBounds.call(go);

            expect(result.x).toBe(100);
            expect(result.y).toBe(100);
            expect(result.width).toBe(200);
            expect(result.height).toBe(100);
        });

        it('should create a new Rectangle when no output is provided', function ()
        {
            var go = createGameObject({ x: 0, y: 0, displayWidth: 100, displayHeight: 100 });
            var result = GetBounds.getBounds.call(go);

            expect(result).toBeDefined();
            expect(typeof result.x).toBe('number');
            expect(typeof result.y).toBe('number');
            expect(typeof result.width).toBe('number');
            expect(typeof result.height).toBe('number');
        });

        it('should write into a provided output object', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var output = { x: 0, y: 0, width: 0, height: 0 };
            var result = GetBounds.getBounds.call(go, output);

            expect(result).toBe(output);
        });

        it('should return a larger bounding box when the object is rotated 45 degrees', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 100, displayHeight: 100, rotation: Math.PI / 4 });
            var result = GetBounds.getBounds.call(go);

            // A 100x100 square rotated 45deg has a bounding box of ~141 x 141
            expect(result.width).toBeCloseTo(Math.SQRT2 * 100, 0);
            expect(result.height).toBeCloseTo(Math.SQRT2 * 100, 0);
        });

        it('should return the same bounding box for 0 and 2*PI rotation', function ()
        {
            var go0 = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, rotation: 0 });
            var go2pi = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, rotation: Math.PI * 2 });

            var result0 = GetBounds.getBounds.call(go0);
            var result2pi = GetBounds.getBounds.call(go2pi);

            expect(result0.x).toBeCloseTo(result2pi.x);
            expect(result0.y).toBeCloseTo(result2pi.y);
            expect(result0.width).toBeCloseTo(result2pi.width);
            expect(result0.height).toBeCloseTo(result2pi.height);
        });

        it('should handle a game object at the origin with zero position', function ()
        {
            var go = createGameObject({ x: 0, y: 0, displayWidth: 100, displayHeight: 50, originX: 0, originY: 0 });
            var result = GetBounds.getBounds.call(go);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
            expect(result.width).toBe(100);
            expect(result.height).toBe(50);
        });

        it('should return consistent width and height for a 90 degree rotation of a square', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 100, displayHeight: 100, rotation: Math.PI / 2 });
            var result = GetBounds.getBounds.call(go);

            // Rotating a square 90deg yields the same bounding dimensions
            expect(result.width).toBeCloseTo(100);
            expect(result.height).toBeCloseTo(100);
        });

        it('should swap width and height bounds for a non-square rotated 90 degrees', function ()
        {
            var go0 = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, rotation: 0 });
            var go90 = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100, rotation: Math.PI / 2 });

            var bounds0 = GetBounds.getBounds.call(go0);
            var bounds90 = GetBounds.getBounds.call(go90);

            expect(bounds0.width).toBeCloseTo(bounds90.height, 0);
            expect(bounds0.height).toBeCloseTo(bounds90.width, 0);
        });
    });

    describe('corner consistency', function ()
    {
        it('getTopLeft x should equal getBottomLeft x', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var tl = GetBounds.getTopLeft.call(go);
            var bl = GetBounds.getBottomLeft.call(go);

            expect(tl.x).toBe(bl.x);
        });

        it('getTopRight x should equal getBottomRight x', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var tr = GetBounds.getTopRight.call(go);
            var br = GetBounds.getBottomRight.call(go);

            expect(tr.x).toBe(br.x);
        });

        it('getTopLeft y should equal getTopRight y', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var tl = GetBounds.getTopLeft.call(go);
            var tr = GetBounds.getTopRight.call(go);

            expect(tl.y).toBe(tr.y);
        });

        it('getBottomLeft y should equal getBottomRight y', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var bl = GetBounds.getBottomLeft.call(go);
            var br = GetBounds.getBottomRight.call(go);

            expect(bl.y).toBe(br.y);
        });

        it('getTopCenter x should be midpoint between getTopLeft and getTopRight', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var tl = GetBounds.getTopLeft.call(go);
            var tr = GetBounds.getTopRight.call(go);
            var tc = GetBounds.getTopCenter.call(go);

            expect(tc.x).toBeCloseTo((tl.x + tr.x) / 2);
        });

        it('getBottomCenter x should be midpoint between getBottomLeft and getBottomRight', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var bl = GetBounds.getBottomLeft.call(go);
            var br = GetBounds.getBottomRight.call(go);
            var bc = GetBounds.getBottomCenter.call(go);

            expect(bc.x).toBeCloseTo((bl.x + br.x) / 2);
        });

        it('getLeftCenter y should be midpoint between getTopLeft and getBottomLeft', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var tl = GetBounds.getTopLeft.call(go);
            var bl = GetBounds.getBottomLeft.call(go);
            var lc = GetBounds.getLeftCenter.call(go);

            expect(lc.y).toBeCloseTo((tl.y + bl.y) / 2);
        });

        it('getRightCenter y should be midpoint between getTopRight and getBottomRight', function ()
        {
            var go = createGameObject({ x: 100, y: 100, displayWidth: 200, displayHeight: 100 });
            var tr = GetBounds.getTopRight.call(go);
            var br = GetBounds.getBottomRight.call(go);
            var rc = GetBounds.getRightCenter.call(go);

            expect(rc.y).toBeCloseTo((tr.y + br.y) / 2);
        });
    });
});
