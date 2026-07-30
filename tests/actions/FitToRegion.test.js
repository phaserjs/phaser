var FitToRegion = require('../../src/actions/FitToRegion');

describe('Phaser.Actions.FitToRegion', function ()
{
    var item;
    var region;

    function makeItem (overrides)
    {
        var base = {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            originX: 0.5,
            originY: 0.5,
            scaleX: 1,
            scaleY: 1,
            setScale: function (x, y)
            {
                this.scaleX = x;
                this.scaleY = (y === undefined) ? x : y;
            },
            scene: {
                scale: {
                    width: 800,
                    height: 600
                }
            }
        };

        if (overrides)
        {
            for (var key in overrides)
            {
                base[key] = overrides[key];
            }
        }

        return base;
    }

    beforeEach(function ()
    {
        item = makeItem();
        region = { x: 0, y: 0, width: 400, height: 300 };
    });

    // --- Return value ---

    it('should return the item', function ()
    {
        var result = FitToRegion(item, 0, region);
        expect(result).toBe(item);
    });

    // --- Position (x, y) ---

    it('should position item at region origin with default origin (0.5, 0.5)', function ()
    {
        FitToRegion(item, 0, region);
        expect(item.x).toBe(region.x + region.width * 0.5);
        expect(item.y).toBe(region.y + region.height * 0.5);
    });

    it('should position item using item originX and originY', function ()
    {
        item.originX = 0;
        item.originY = 0;
        FitToRegion(item, 0, region);
        expect(item.x).toBe(region.x);
        expect(item.y).toBe(region.y);
    });

    it('should position item with origin (1, 1) at region far corner', function ()
    {
        item.originX = 1;
        item.originY = 1;
        FitToRegion(item, 0, region);
        expect(item.x).toBe(region.x + region.width);
        expect(item.y).toBe(region.y + region.height);
    });

    it('should account for non-zero region x and y offset', function ()
    {
        var offsetRegion = { x: 50, y: 100, width: 200, height: 150 };
        FitToRegion(item, 0, offsetRegion);
        expect(item.x).toBe(50 + 200 * 0.5);
        expect(item.y).toBe(100 + 150 * 0.5);
    });

    // --- Scale mode 0: independent axes ---

    it('should scale axes independently with scaleMode 0', function ()
    {
        item.width = 200;
        item.height = 100;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, 0, r);
        expect(item.scaleX).toBeCloseTo(2);
        expect(item.scaleY).toBeCloseTo(3);
    });

    it('should default scaleMode to 0 when not provided', function ()
    {
        item.width = 200;
        item.height = 100;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, undefined, r);
        expect(item.scaleX).toBeCloseTo(2);
        expect(item.scaleY).toBeCloseTo(3);
    });

    it('should produce equal scale values when item and region have same aspect ratio in scaleMode 0', function ()
    {
        item.width = 200;
        item.height = 150;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, 0, r);
        expect(item.scaleX).toBeCloseTo(2);
        expect(item.scaleY).toBeCloseTo(2);
    });

    // --- Scale mode -1: fit inside (contain) ---

    it('should use the smaller scale for scaleMode -1 when item is wider than region', function ()
    {
        item.width = 400;
        item.height = 100;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, -1, r);
        // scaleX = 1, scaleY = 3 — min is 1
        expect(item.scaleX).toBeCloseTo(1);
        expect(item.scaleY).toBeCloseTo(1);
    });

    it('should use the smaller scale for scaleMode -1 when item is taller than region', function ()
    {
        item.width = 100;
        item.height = 300;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, -1, r);
        // scaleX = 4, scaleY = 1 — min is 1
        expect(item.scaleX).toBeCloseTo(1);
        expect(item.scaleY).toBeCloseTo(1);
    });

    it('should apply uniform scale for scaleMode -1', function ()
    {
        item.width = 200;
        item.height = 100;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, -1, r);
        // scaleX = 2, scaleY = 3 — min is 2
        expect(item.scaleX).toBeCloseTo(2);
        expect(item.scaleY).toBeCloseTo(2);
    });

    // --- Scale mode 1: fill outside (cover) ---

    it('should use the larger scale for scaleMode 1 when item is wider than region', function ()
    {
        item.width = 400;
        item.height = 100;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, 1, r);
        // scaleX = 1, scaleY = 3 — max is 3
        expect(item.scaleX).toBeCloseTo(3);
        expect(item.scaleY).toBeCloseTo(3);
    });

    it('should use the larger scale for scaleMode 1 when item is taller than region', function ()
    {
        item.width = 100;
        item.height = 300;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, 1, r);
        // scaleX = 4, scaleY = 1 — max is 4
        expect(item.scaleX).toBeCloseTo(4);
        expect(item.scaleY).toBeCloseTo(4);
    });

    it('should apply uniform scale for scaleMode 1', function ()
    {
        item.width = 200;
        item.height = 100;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, 1, r);
        // scaleX = 2, scaleY = 3 — max is 3
        expect(item.scaleX).toBeCloseTo(3);
        expect(item.scaleY).toBeCloseTo(3);
    });

    // --- Region inferred from scene ---

    it('should infer region from item scene scale when region not provided', function ()
    {
        item.scene.scale.width = 800;
        item.scene.scale.height = 600;
        item.width = 100;
        item.height = 100;
        FitToRegion(item, 0);
        expect(item.scaleX).toBeCloseTo(8);
        expect(item.scaleY).toBeCloseTo(6);
    });

    it('should position item using inferred scene region', function ()
    {
        item.scene.scale.width = 800;
        item.scene.scale.height = 600;
        item.originX = 0.5;
        item.originY = 0.5;
        FitToRegion(item, 0);
        expect(item.x).toBe(400);
        expect(item.y).toBe(300);
    });

    // --- itemCoverage overrides ---

    it('should use itemCoverage width and height when provided', function ()
    {
        item.width = 100;
        item.height = 100;
        var coverage = { width: 50, height: 50 };
        var r = { x: 0, y: 0, width: 200, height: 200 };
        FitToRegion(item, 0, r, coverage);
        expect(item.scaleX).toBeCloseTo(4);
        expect(item.scaleY).toBeCloseTo(4);
    });

    it('should use itemCoverage originX and originY when provided', function ()
    {
        var coverage = { originX: 0, originY: 0 };
        var r = { x: 10, y: 20, width: 200, height: 100 };
        FitToRegion(item, 0, r, coverage);
        expect(item.x).toBe(10);
        expect(item.y).toBe(20);
    });

    it('should prefer itemCoverage over item properties', function ()
    {
        item.width = 100;
        item.height = 100;
        item.originX = 0.5;
        item.originY = 0.5;
        var coverage = { width: 200, height: 400, originX: 1, originY: 1 };
        var r = { x: 0, y: 0, width: 400, height: 400 };
        FitToRegion(item, 0, r, coverage);
        // position uses coverage origin
        expect(item.x).toBe(400);
        expect(item.y).toBe(400);
        // scale uses coverage dimensions
        expect(item.scaleX).toBeCloseTo(2);
        expect(item.scaleY).toBeCloseTo(1);
    });

    // --- Default dimensions for items without size ---

    it('should default item width and height to 1 when not present', function ()
    {
        var noSize = makeItem();
        delete noSize.width;
        delete noSize.height;
        var r = { x: 0, y: 0, width: 100, height: 200 };
        FitToRegion(noSize, 0, r);
        expect(noSize.scaleX).toBeCloseTo(100);
        expect(noSize.scaleY).toBeCloseTo(200);
    });

    it('should default item originX and originY to 0.5 when not present', function ()
    {
        var noOrigin = makeItem();
        delete noOrigin.originX;
        delete noOrigin.originY;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(noOrigin, 0, r);
        expect(noOrigin.x).toBe(200);
        expect(noOrigin.y).toBe(150);
    });

    // --- Square region / item ---

    it('should produce scale 1 when item dimensions equal region dimensions', function ()
    {
        item.width = 400;
        item.height = 300;
        var r = { x: 0, y: 0, width: 400, height: 300 };
        FitToRegion(item, 0, r);
        expect(item.scaleX).toBeCloseTo(1);
        expect(item.scaleY).toBeCloseTo(1);
    });

    // --- Floating point dimensions ---

    it('should handle floating point region and item dimensions', function ()
    {
        item.width = 33.3;
        item.height = 66.6;
        var r = { x: 0, y: 0, width: 100, height: 200 };
        FitToRegion(item, 0, r);
        expect(item.scaleX).toBeCloseTo(100 / 33.3);
        expect(item.scaleY).toBeCloseTo(200 / 66.6);
    });
});
