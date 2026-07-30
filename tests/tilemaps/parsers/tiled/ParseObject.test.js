var ParseObject = require('../../../../src/tilemaps/parsers/tiled/ParseObject');

describe('Phaser.Tilemaps.Parsers.Tiled.ParseObject', function ()
{
    var baseTiledObject;

    beforeEach(function ()
    {
        baseTiledObject = {
            id: 1,
            name: 'testObject',
            type: 'npc',
            rotation: 45,
            properties: { speed: 100 },
            visible: true,
            x: 100,
            y: 200,
            width: 32,
            height: 64
        };
    });

    describe('common properties', function ()
    {
        it('should copy all common properties from the tiled object', function ()
        {
            var result = ParseObject(baseTiledObject);

            expect(result.id).toBe(1);
            expect(result.name).toBe('testObject');
            expect(result.type).toBe('npc');
            expect(result.rotation).toBe(45);
            expect(result.properties).toEqual({ speed: 100 });
            expect(result.visible).toBe(true);
            expect(result.width).toBe(32);
            expect(result.height).toBe(64);
        });

        it('should default offsetX and offsetY to 0 when not provided', function ()
        {
            var result = ParseObject(baseTiledObject);

            expect(result.x).toBe(100);
            expect(result.y).toBe(200);
        });

        it('should apply offsetX to the x property', function ()
        {
            var result = ParseObject(baseTiledObject, 50, 0);

            expect(result.x).toBe(150);
            expect(result.y).toBe(200);
        });

        it('should apply offsetY to the y property', function ()
        {
            var result = ParseObject(baseTiledObject, 0, 75);

            expect(result.x).toBe(100);
            expect(result.y).toBe(275);
        });

        it('should apply both offsetX and offsetY', function ()
        {
            var result = ParseObject(baseTiledObject, 10, 20);

            expect(result.x).toBe(110);
            expect(result.y).toBe(220);
        });

        it('should apply negative offsets', function ()
        {
            var result = ParseObject(baseTiledObject, -50, -100);

            expect(result.x).toBe(50);
            expect(result.y).toBe(100);
        });

        it('should not modify the original tiled object x and y', function ()
        {
            ParseObject(baseTiledObject, 10, 20);

            expect(baseTiledObject.x).toBe(100);
            expect(baseTiledObject.y).toBe(200);
        });

        it('should not include extra properties from the tiled object', function ()
        {
            baseTiledObject.extraProp = 'should not appear';

            var result = ParseObject(baseTiledObject);

            expect(result.extraProp).toBeUndefined();
        });
    });

    describe('rectangle objects', function ()
    {
        it('should set rectangle to true when no special type is present', function ()
        {
            var result = ParseObject(baseTiledObject);

            expect(result.rectangle).toBe(true);
        });

        it('should not set other shape flags for a rectangle', function ()
        {
            var result = ParseObject(baseTiledObject);

            expect(result.ellipse).toBeUndefined();
            expect(result.polygon).toBeUndefined();
            expect(result.polyline).toBeUndefined();
            expect(result.point).toBeUndefined();
            expect(result.gid).toBeUndefined();
            expect(result.text).toBeUndefined();
        });
    });

    describe('ellipse objects', function ()
    {
        it('should copy ellipse property when present', function ()
        {
            baseTiledObject.ellipse = true;

            var result = ParseObject(baseTiledObject);

            expect(result.ellipse).toBe(true);
        });

        it('should not set rectangle flag for ellipse objects', function ()
        {
            baseTiledObject.ellipse = true;

            var result = ParseObject(baseTiledObject);

            expect(result.rectangle).toBeUndefined();
        });
    });

    describe('point objects', function ()
    {
        it('should set point to true when point property is present', function ()
        {
            baseTiledObject.point = true;

            var result = ParseObject(baseTiledObject);

            expect(result.point).toBe(true);
        });

        it('should not set rectangle flag for point objects', function ()
        {
            baseTiledObject.point = true;

            var result = ParseObject(baseTiledObject);

            expect(result.rectangle).toBeUndefined();
        });
    });

    describe('text objects', function ()
    {
        it('should copy text object when present', function ()
        {
            baseTiledObject.text = { text: 'Hello World', fontsize: 16 };

            var result = ParseObject(baseTiledObject);

            expect(result.text).toEqual({ text: 'Hello World', fontsize: 16 });
        });

        it('should reference the same text object', function ()
        {
            var textObj = { text: 'Hello', fontsize: 12 };
            baseTiledObject.text = textObj;

            var result = ParseObject(baseTiledObject);

            expect(result.text).toBe(textObj);
        });

        it('should not set rectangle flag for text objects', function ()
        {
            baseTiledObject.text = { text: 'Hello' };

            var result = ParseObject(baseTiledObject);

            expect(result.rectangle).toBeUndefined();
        });
    });

    describe('polyline objects', function ()
    {
        it('should map polyline points when present', function ()
        {
            baseTiledObject.polyline = [
                { x: 0, y: 0 },
                { x: 10, y: 20 },
                { x: 30, y: 40 }
            ];

            var result = ParseObject(baseTiledObject);

            expect(result.polyline).toHaveLength(3);
            expect(result.polyline[0]).toEqual({ x: 0, y: 0 });
            expect(result.polyline[1]).toEqual({ x: 10, y: 20 });
            expect(result.polyline[2]).toEqual({ x: 30, y: 40 });
        });

        it('should create new point objects for polyline (not reference original)', function ()
        {
            var originalPoints = [{ x: 5, y: 10 }];
            baseTiledObject.polyline = originalPoints;

            var result = ParseObject(baseTiledObject);

            expect(result.polyline[0]).not.toBe(originalPoints[0]);
        });

        it('should only copy x and y from polyline points', function ()
        {
            baseTiledObject.polyline = [{ x: 5, y: 10, extra: 'ignored' }];

            var result = ParseObject(baseTiledObject);

            expect(result.polyline[0].x).toBe(5);
            expect(result.polyline[0].y).toBe(10);
            expect(result.polyline[0].extra).toBeUndefined();
        });

        it('should not set rectangle flag for polyline objects', function ()
        {
            baseTiledObject.polyline = [{ x: 0, y: 0 }];

            var result = ParseObject(baseTiledObject);

            expect(result.rectangle).toBeUndefined();
        });

        it('should handle empty polyline array', function ()
        {
            baseTiledObject.polyline = [];

            var result = ParseObject(baseTiledObject);

            expect(result.polyline).toEqual([]);
        });
    });

    describe('polygon objects', function ()
    {
        it('should map polygon points when present', function ()
        {
            baseTiledObject.polygon = [
                { x: 0, y: 0 },
                { x: 16, y: 0 },
                { x: 8, y: 16 }
            ];

            var result = ParseObject(baseTiledObject);

            expect(result.polygon).toHaveLength(3);
            expect(result.polygon[0]).toEqual({ x: 0, y: 0 });
            expect(result.polygon[1]).toEqual({ x: 16, y: 0 });
            expect(result.polygon[2]).toEqual({ x: 8, y: 16 });
        });

        it('should create new point objects for polygon (not reference original)', function ()
        {
            var originalPoints = [{ x: 5, y: 10 }];
            baseTiledObject.polygon = originalPoints;

            var result = ParseObject(baseTiledObject);

            expect(result.polygon[0]).not.toBe(originalPoints[0]);
        });

        it('should only copy x and y from polygon points', function ()
        {
            baseTiledObject.polygon = [{ x: 5, y: 10, extra: 'ignored' }];

            var result = ParseObject(baseTiledObject);

            expect(result.polygon[0].x).toBe(5);
            expect(result.polygon[0].y).toBe(10);
            expect(result.polygon[0].extra).toBeUndefined();
        });

        it('should not set rectangle flag for polygon objects', function ()
        {
            baseTiledObject.polygon = [{ x: 0, y: 0 }];

            var result = ParseObject(baseTiledObject);

            expect(result.rectangle).toBeUndefined();
        });
    });

    describe('gid (tile) objects', function ()
    {
        it('should parse gid and set flip flags from a basic gid', function ()
        {
            // gid with no flip flags — a plain tile id
            baseTiledObject.gid = 5;

            var result = ParseObject(baseTiledObject);

            expect(result.gid).toBe(5);
            expect(result.flippedHorizontal).toBe(false);
            expect(result.flippedVertical).toBe(false);
            expect(result.flippedAntiDiagonal).toBe(false);
        });

        it('should set flippedHorizontal when horizontal flip bit is set', function ()
        {
            // Bit 31 (0x80000000) = horizontal flip
            baseTiledObject.gid = 0x80000000 | 3;

            var result = ParseObject(baseTiledObject);

            expect(result.gid).toBe(3);
            expect(result.flippedHorizontal).toBe(true);
            expect(result.flippedVertical).toBe(false);
        });

        it('should set flippedVertical when vertical flip bit is set', function ()
        {
            // Bit 30 (0x40000000) = vertical flip
            baseTiledObject.gid = 0x40000000 | 3;

            var result = ParseObject(baseTiledObject);

            expect(result.gid).toBe(3);
            expect(result.flippedHorizontal).toBe(false);
            expect(result.flippedVertical).toBe(true);
        });

        it('should not set rectangle flag for gid objects', function ()
        {
            baseTiledObject.gid = 5;

            var result = ParseObject(baseTiledObject);

            expect(result.rectangle).toBeUndefined();
        });
    });

    describe('priority of object types', function ()
    {
        it('gid takes priority over polyline', function ()
        {
            baseTiledObject.gid = 5;
            baseTiledObject.polyline = [{ x: 0, y: 0 }];

            var result = ParseObject(baseTiledObject);

            expect(result.gid).toBe(5);
            expect(result.polyline).toBeUndefined();
        });

        it('polyline takes priority over polygon', function ()
        {
            baseTiledObject.polyline = [{ x: 0, y: 0 }];
            baseTiledObject.polygon = [{ x: 0, y: 0 }];

            var result = ParseObject(baseTiledObject);

            expect(result.polyline).toBeDefined();
            expect(result.polygon).toBeUndefined();
        });
    });

    describe('return value', function ()
    {
        it('should return an object', function ()
        {
            var result = ParseObject(baseTiledObject);

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
        });

        it('should return a new object and not the original', function ()
        {
            var result = ParseObject(baseTiledObject);

            expect(result).not.toBe(baseTiledObject);
        });
    });
});
