var RightBottom = require('../../../../src/display/align/to/RightBottom');

describe('Phaser.Display.Align.To.RightBottom', function ()
{
    function makeObject(x, y, width, height, originX, originY)
    {
        return {
            x: x || 0,
            y: y || 0,
            width: width || 0,
            height: height || 0,
            originX: originX !== undefined ? originX : 0,
            originY: originY !== undefined ? originY : 0
        };
    }

    it('should return the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignTo = makeObject(100, 100, 80, 80);
        var result = RightBottom(gameObject, alignTo);
        expect(result).toBe(gameObject);
    });

    it('should position gameObject left edge at alignTo right edge with zero-origin objects', function ()
    {
        // alignTo: x=100, width=80, originX=0 => right = 100+80 - 80*0 = 180
        // gameObject: width=50, originX=0 => x = 180 + 0*50 = 180
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.x).toBe(180);
    });

    it('should position gameObject bottom edge at alignTo bottom edge with zero-origin objects', function ()
    {
        // alignTo: y=100, height=80, originY=0 => bottom = 100+80 - 80*0 = 180
        // gameObject: y = (180 - 50) + 50*0 = 130
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.y).toBe(130);
    });

    it('should apply offsetX to horizontal position', function ()
    {
        // alignTo right = 180, offsetX=10 => gameObject.x = 180+10 = 190
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo, 10, 0);
        expect(gameObject.x).toBe(190);
    });

    it('should apply offsetY to vertical position', function ()
    {
        // alignTo bottom = 180, offsetY=20 => gameObject.y = (180+20-50) + 0 = 150
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo, 0, 20);
        expect(gameObject.y).toBe(150);
    });

    it('should apply both offsetX and offsetY', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo, 10, 20);
        expect(gameObject.x).toBe(190);
        expect(gameObject.y).toBe(150);
    });

    it('should default offsetX to 0 when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.x).toBe(180);
    });

    it('should default offsetY to 0 when not provided', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.y).toBe(130);
    });

    it('should handle negative offsets', function ()
    {
        // alignTo right = 180, offsetX=-10 => x = 180-10 = 170
        // alignTo bottom = 180, offsetY=-20 => y = (180-20-50)+0 = 110
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo, -10, -20);
        expect(gameObject.x).toBe(170);
        expect(gameObject.y).toBe(110);
    });

    it('should account for gameObject originX when setting x position', function ()
    {
        // alignTo right = 180, gameObject width=50, originX=0.5
        // x = 180 + 50*0.5 = 205
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.x).toBe(205);
    });

    it('should account for gameObject originY when setting y position', function ()
    {
        // alignTo bottom = 180, gameObject height=50, originY=0.5
        // y = (180 - 50) + 50*0.5 = 130 + 25 = 155
        var gameObject = makeObject(0, 0, 50, 50, 0, 0.5);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.y).toBe(155);
    });

    it('should account for alignTo originX when computing right edge', function ()
    {
        // alignTo: x=100, width=80, originX=0.5 => right = 100+80 - 80*0.5 = 140
        // gameObject: width=50, originX=0 => x = 140
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0.5, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.x).toBe(140);
    });

    it('should account for alignTo originY when computing bottom edge', function ()
    {
        // alignTo: y=100, height=80, originY=0.5 => bottom = 100+80 - 80*0.5 = 140
        // gameObject: y = (140 - 50) + 0 = 90
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0.5);
        RightBottom(gameObject, alignTo);
        expect(gameObject.y).toBe(90);
    });

    it('should handle objects at negative coordinates', function ()
    {
        // alignTo: x=-200, width=80, originX=0 => right = -200+80 = -120
        // alignTo: y=-200, height=80, originY=0 => bottom = -200+80 = -120
        // gameObject: x = -120, y = (-120-50) = -170
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(-200, -200, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.x).toBe(-120);
        expect(gameObject.y).toBe(-170);
    });

    it('should handle zero-size gameObject', function ()
    {
        // alignTo right = 180, gameObject width=0, originX=0 => x = 180
        // alignTo bottom = 180, gameObject height=0, originY=0 => y = 180
        var gameObject = makeObject(0, 0, 0, 0, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.x).toBe(180);
        expect(gameObject.y).toBe(180);
    });

    it('should handle zero-size alignTo object', function ()
    {
        // alignTo: x=100, width=0, originX=0 => right = 100
        // alignTo: y=100, height=0, originY=0 => bottom = 100
        // gameObject: x = 100, y = (100-50)+0 = 50
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 0, 0, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.x).toBe(100);
        expect(gameObject.y).toBe(50);
    });

    it('should handle floating point dimensions', function ()
    {
        // alignTo: x=10.5, width=20.5, originX=0 => right = 31
        // alignTo: y=10.5, height=20.5, originY=0 => bottom = 31
        // gameObject: width=15.5, originX=0 => x = 31
        // gameObject: height=15.5, originY=0 => y = 31-15.5 = 15.5
        var gameObject = makeObject(0, 0, 15.5, 15.5, 0, 0);
        var alignTo = makeObject(10.5, 10.5, 20.5, 20.5, 0, 0);
        RightBottom(gameObject, alignTo);
        expect(gameObject.x).toBeCloseTo(31, 5);
        expect(gameObject.y).toBeCloseTo(15.5, 5);
    });

    it('should not modify alignTo object', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50, 0, 0);
        var alignTo = makeObject(100, 100, 80, 80, 0, 0);
        var originalX = alignTo.x;
        var originalY = alignTo.y;
        RightBottom(gameObject, alignTo);
        expect(alignTo.x).toBe(originalX);
        expect(alignTo.y).toBe(originalY);
    });
});
