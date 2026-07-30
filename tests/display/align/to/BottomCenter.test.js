var BottomCenter = require('../../../../src/display/align/to/BottomCenter');

describe('Phaser.Display.Align.To.BottomCenter', function ()
{
    function makeObject(x, y, width, height, originX, originY)
    {
        return {
            x: x || 0,
            y: y || 0,
            width: width || 100,
            height: height || 100,
            originX: (originX !== undefined) ? originX : 0.5,
            originY: (originY !== undefined) ? originY : 0.5
        };
    }

    it('should return the gameObject', function ()
    {
        var gameObject = makeObject(0, 0, 50, 50);
        var alignTo = makeObject(100, 100, 100, 100);

        var result = BottomCenter(gameObject, alignTo);

        expect(result).toBe(gameObject);
    });

    it('should position gameObject top flush with bottom of alignTo', function ()
    {
        // alignTo: y=100, height=100, originY=0.5 => bottom = (100+100)-(100*0.5) = 150
        var alignTo = makeObject(100, 100, 100, 100, 0.5, 0.5);
        // gameObject: width=50, height=50, originY=0.5
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);

        BottomCenter(gameObject, alignTo);

        // SetTop sets gameObject.y = value + (height * originY) = 150 + (50*0.5) = 175
        expect(gameObject.y).toBe(175);
    });

    it('should center gameObject horizontally on alignTo', function ()
    {
        // alignTo: x=100, width=100, originX=0.5 => centerX = 100-(100*0.5)+(100*0.5) = 100
        var alignTo = makeObject(100, 100, 100, 100, 0.5, 0.5);
        // gameObject: width=50, originX=0.5
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);

        BottomCenter(gameObject, alignTo);

        // SetCenterX: offsetX = 50*0.5=25, gameObject.x = (100+25)-(50*0.5) = 100
        expect(gameObject.x).toBe(100);
    });

    it('should apply horizontal offset', function ()
    {
        var alignTo = makeObject(100, 100, 100, 100, 0.5, 0.5);
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);

        BottomCenter(gameObject, alignTo, 20, 0);

        // centerX of alignTo = 100, + offsetX 20 = 120
        // SetCenterX: offsetX = 50*0.5=25, gameObject.x = (120+25)-(50*0.5) = 120
        expect(gameObject.x).toBe(120);
    });

    it('should apply vertical offset', function ()
    {
        var alignTo = makeObject(100, 100, 100, 100, 0.5, 0.5);
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);

        BottomCenter(gameObject, alignTo, 0, 10);

        // bottom of alignTo = 150, + offsetY 10 = 160
        // SetTop: gameObject.y = 160 + (50*0.5) = 185
        expect(gameObject.y).toBe(185);
    });

    it('should apply both horizontal and vertical offsets together', function ()
    {
        var alignTo = makeObject(100, 100, 100, 100, 0.5, 0.5);
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);

        BottomCenter(gameObject, alignTo, 15, 5);

        // centerX = 100+15 = 115, SetCenterX: gameObject.x = (115+25)-(25) = 115
        expect(gameObject.x).toBe(115);
        // bottom = 150+5 = 155, SetTop: gameObject.y = 155+25 = 180
        expect(gameObject.y).toBe(180);
    });

    it('should default offsetX to 0 when not provided', function ()
    {
        var alignTo = makeObject(200, 0, 100, 100, 0.5, 0.5);
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);

        BottomCenter(gameObject, alignTo);

        // centerX of alignTo = 200-(100*0.5)+(100*0.5) = 200
        // SetCenterX: offsetX=50, gameObject.x = (200+50)-(50) = 200
        expect(gameObject.x).toBe(200);
    });

    it('should default offsetY to 0 when not provided', function ()
    {
        var alignTo = makeObject(0, 50, 100, 100, 0.5, 0.5);
        var gameObject = makeObject(0, 0, 100, 100, 0.5, 0.5);

        BottomCenter(gameObject, alignTo);

        // bottom of alignTo = (50+100)-(100*0.5) = 100
        // SetTop: gameObject.y = 100+(100*0.5) = 150
        expect(gameObject.y).toBe(150);
    });

    it('should work with negative offsets', function ()
    {
        var alignTo = makeObject(100, 100, 100, 100, 0.5, 0.5);
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);

        BottomCenter(gameObject, alignTo, -10, -20);

        // centerX = 100-10 = 90, SetCenterX: (90+25)-25 = 90
        expect(gameObject.x).toBe(90);
        // bottom = 150-20 = 130, SetTop: 130+25 = 155
        expect(gameObject.y).toBe(155);
    });

    it('should work with zero-origin objects', function ()
    {
        // originX=0, originY=0
        var alignTo = makeObject(50, 50, 100, 100, 0, 0);
        var gameObject = makeObject(0, 0, 60, 40, 0, 0);

        BottomCenter(gameObject, alignTo);

        // GetCenterX(alignTo) = 50-(100*0)+50 = 100
        // SetCenterX: offsetX=0, gameObject.x = (100+0)-(60*0.5) = 70
        expect(gameObject.x).toBe(70);

        // GetBottom(alignTo) = (50+100)-(100*0) = 150
        // SetTop: gameObject.y = 150+(40*0) = 150
        expect(gameObject.y).toBe(150);
    });

    it('should work with full-origin (1,1) objects', function ()
    {
        // originX=1, originY=1
        var alignTo = makeObject(200, 200, 100, 100, 1, 1);
        var gameObject = makeObject(0, 0, 80, 60, 1, 1);

        BottomCenter(gameObject, alignTo);

        // GetCenterX(alignTo) = 200-(100*1)+(100*0.5) = 150
        // SetCenterX: offsetX=80*1=80, gameObject.x = (150+80)-(80*0.5) = 190
        expect(gameObject.x).toBe(190);

        // GetBottom(alignTo) = (200+100)-(100*1) = 200
        // SetTop: gameObject.y = 200+(60*1) = 260
        expect(gameObject.y).toBe(260);
    });

    it('should work with floating point positions', function ()
    {
        var alignTo = makeObject(10.5, 20.5, 100, 100, 0.5, 0.5);
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);

        BottomCenter(gameObject, alignTo);

        // GetCenterX(alignTo) = 10.5-50+50 = 10.5
        // SetCenterX: (10.5+25)-25 = 10.5
        expect(gameObject.x).toBeCloseTo(10.5);

        // GetBottom(alignTo) = (20.5+100)-(100*0.5) = 70.5
        // SetTop: 70.5+25 = 95.5
        expect(gameObject.y).toBeCloseTo(95.5);
    });

    it('should work when alignTo is at the origin', function ()
    {
        var alignTo = makeObject(0, 0, 100, 100, 0.5, 0.5);
        var gameObject = makeObject(999, 999, 50, 50, 0.5, 0.5);

        BottomCenter(gameObject, alignTo);

        // GetCenterX(alignTo) = 0-50+50 = 0
        // SetCenterX: (0+25)-25 = 0
        expect(gameObject.x).toBe(0);

        // GetBottom(alignTo) = (0+100)-(100*0.5) = 50
        // SetTop: 50+25 = 75
        expect(gameObject.y).toBe(75);
    });

    it('should not mutate the alignTo object', function ()
    {
        var alignTo = makeObject(100, 100, 100, 100, 0.5, 0.5);
        var gameObject = makeObject(0, 0, 50, 50, 0.5, 0.5);

        var origX = alignTo.x;
        var origY = alignTo.y;

        BottomCenter(gameObject, alignTo, 5, 5);

        expect(alignTo.x).toBe(origX);
        expect(alignTo.y).toBe(origY);
    });
});
