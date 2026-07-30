var Center = require('../../../../src/display/align/in/Center');

describe('Phaser.Display.Align.In.Center', function ()
{
    function makeObject(x, y, width, height, originX, originY)
    {
        return { x: x, y: y, width: width, height: height, originX: originX, originY: originY };
    }

    it('should return the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 200, 200, 0, 0);

        var result = Center(gameObject, alignIn);

        expect(result).toBe(gameObject);
    });

    it('should center gameObject within alignIn when both have origin 0', function ()
    {
        // alignIn center: x=100+200*0.5=200, y=200+100*0.5=250
        // gameObject.x = 200 - 50*0.5 = 175, gameObject.y = 250 - 50*0.5 = 225
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 200, 200, 100, 0, 0);

        Center(gameObject, alignIn);

        expect(gameObject.x).toBe(175);
        expect(gameObject.y).toBe(225);
    });

    it('should default offsetX and offsetY to 0 when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 100, 100, 0, 0);

        Center(gameObject, alignIn);

        // alignIn center: 50, 50; gameObject.x = 50 - 25 = 25, gameObject.y = 50 - 25 = 25
        expect(gameObject.x).toBe(25);
        expect(gameObject.y).toBe(25);
    });

    it('should apply positive offsetX and offsetY', function ()
    {
        // alignIn center: 200, 250; target: 210, 270
        // gameObject.x = 210 - 25 = 185, gameObject.y = 270 - 25 = 245
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 200, 200, 100, 0, 0);

        Center(gameObject, alignIn, 10, 20);

        expect(gameObject.x).toBe(185);
        expect(gameObject.y).toBe(245);
    });

    it('should apply negative offsetX and offsetY', function ()
    {
        // alignIn center: 200, 250; target: 190, 230
        // gameObject.x = 190 - 25 = 165, gameObject.y = 230 - 25 = 205
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 200, 200, 100, 0, 0);

        Center(gameObject, alignIn, -10, -20);

        expect(gameObject.x).toBe(165);
        expect(gameObject.y).toBe(205);
    });

    it('should work when alignIn has origin 0.5 (centered origin)', function ()
    {
        // alignIn: x=100, y=200, origin=0.5
        // GetCenterX = 100 - 200*0.5 + 200*0.5 = 100
        // GetCenterY = 200 - 100*0.5 + 100*0.5 = 200
        // gameObject origin=0: x = 100 - 25 = 75, y = 200 - 25 = 175
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 200, 200, 100, 0.5, 0.5);

        Center(gameObject, alignIn);

        expect(gameObject.x).toBe(75);
        expect(gameObject.y).toBe(175);
    });

    it('should work when gameObject has origin 0.5', function ()
    {
        // alignIn center: 200, 250
        // SetCenterX: gameObject.x = 200 + 50*0.5 - 50*0.5 = 200
        // SetCenterY: gameObject.y = 250 + 50*0.5 - 50*0.5 = 250
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);
        var alignIn = makeObject(100, 200, 200, 100, 0, 0);

        Center(gameObject, alignIn);

        expect(gameObject.x).toBe(200);
        expect(gameObject.y).toBe(250);
    });

    it('should center a larger gameObject within a smaller alignIn', function ()
    {
        // alignIn center: 50, 50 (origin 0, x=0, y=0, w=100, h=100)
        // gameObject origin=0, w=200, h=200: x = 50 - 100 = -50, y = 50 - 100 = -50
        var gameObject = makeObject(0, 0, 200, 200, 0, 0);
        var alignIn = makeObject(0, 0, 100, 100, 0, 0);

        Center(gameObject, alignIn);

        expect(gameObject.x).toBe(-50);
        expect(gameObject.y).toBe(-50);
    });

    it('should work when alignIn is positioned at the origin', function ()
    {
        // alignIn: x=0, y=0, w=100, h=100, origin=0 => center=(50,50)
        // gameObject: w=50, h=50, origin=0 => x=50-25=25, y=50-25=25
        var gameObject = makeObject(99, 99, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 100, 100, 0, 0);

        Center(gameObject, alignIn);

        expect(gameObject.x).toBe(25);
        expect(gameObject.y).toBe(25);
    });

    it('should work with floating point dimensions', function ()
    {
        // alignIn: x=0, y=0, w=99, h=101, origin=0 => center=(49.5, 50.5)
        // gameObject: w=50, h=50, origin=0 => x=49.5-25=24.5, y=50.5-25=25.5
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 99, 101, 0, 0);

        Center(gameObject, alignIn);

        expect(gameObject.x).toBeCloseTo(24.5);
        expect(gameObject.y).toBeCloseTo(25.5);
    });

    it('should work with floating point offsets', function ()
    {
        // alignIn center: 50, 50; target: 50.5, 50.7
        // gameObject.x = 50.5 - 25 = 25.5, gameObject.y = 50.7 - 25 = 25.7
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(0, 0, 100, 100, 0, 0);

        Center(gameObject, alignIn, 0.5, 0.7);

        expect(gameObject.x).toBeCloseTo(25.5);
        expect(gameObject.y).toBeCloseTo(25.7);
    });

    it('should only mutate the gameObject, not alignIn', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignIn = makeObject(100, 200, 200, 100, 0, 0);

        Center(gameObject, alignIn);

        expect(alignIn.x).toBe(100);
        expect(alignIn.y).toBe(200);
        expect(alignIn.width).toBe(200);
        expect(alignIn.height).toBe(100);
    });
});
