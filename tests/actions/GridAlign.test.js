// Mock Zone before requiring GridAlign, as Zone pulls in browser-dependent device code
vi.mock('../../src/gameobjects/zone/Zone', function ()
{
    function MockZone (scene, x, y, width, height)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 1;
        this.height = height || 1;
        this.originX = 0.5;
        this.originY = 0.5;
    }

    MockZone.prototype.setOrigin = function (x, y)
    {
        this.originX = x;
        this.originY = y;

        return this;
    };

    MockZone.prototype.setPosition = function (x, y)
    {
        this.x = x;
        this.y = y;

        return this;
    };

    MockZone.prototype.setSize = function (width, height)
    {
        this.width = width;
        this.height = height;

        return this;
    };

    return MockZone;
});

var GridAlign = require('../../src/actions/GridAlign');

/**
 * Creates a minimal mock item compatible with Phaser's bounds functions.
 * With width=0, height=0 and originX=0, originY=0, TOP_LEFT alignment
 * places the item exactly at tempZone.x, tempZone.y.
 */
function createItem ()
{
    return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        originX: 0,
        originY: 0
    };
}

function createItems (count)
{
    var items = [];

    for (var i = 0; i < count; i++)
    {
        items.push(createItem());
    }

    return items;
}

describe('Phaser.Actions.GridAlign', function ()
{
    it('should return the same array reference that was passed in', function ()
    {
        var items = createItems(3);
        var result = GridAlign(items, { width: 3, cellWidth: 100, cellHeight: 100 });

        expect(result).toBe(items);
    });

    it('should handle an empty items array without error', function ()
    {
        var items = [];
        var result = GridAlign(items, { width: 3, cellWidth: 100, cellHeight: 100 });

        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should use default options when none are provided', function ()
    {
        var items = createItems(3);

        GridAlign(items);

        // Default: no width/height set, cellWidth=1, x=0, y=0
        // Falls into else branch; w = -1 * 1 = -1, cx never equals w
        // Items laid out in a single horizontal row with cellWidth=1
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(1);
        expect(items[1].y).toBe(0);
        expect(items[2].x).toBe(2);
        expect(items[2].y).toBe(0);
    });

    it('should lay out items in a single horizontal row when width is -1', function ()
    {
        var items = createItems(4);

        GridAlign(items, { width: -1, cellWidth: 100, cellHeight: 50, x: 0, y: 0 });

        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(100);
        expect(items[1].y).toBe(0);
        expect(items[2].x).toBe(200);
        expect(items[2].y).toBe(0);
        expect(items[3].x).toBe(300);
        expect(items[3].y).toBe(0);
    });

    it('should lay out items in a single vertical column when height is -1', function ()
    {
        var items = createItems(4);

        GridAlign(items, { height: -1, cellWidth: 50, cellHeight: 100, x: 0, y: 0 });

        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[1].y).toBe(100);
        expect(items[2].x).toBe(0);
        expect(items[2].y).toBe(200);
        expect(items[3].x).toBe(0);
        expect(items[3].y).toBe(300);
    });

    it('should lay out items in rows when only width is specified', function ()
    {
        var items = createItems(6);

        GridAlign(items, { width: 3, cellWidth: 100, cellHeight: 80, x: 0, y: 0 });

        // Row 0
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(100);
        expect(items[1].y).toBe(0);
        expect(items[2].x).toBe(200);
        expect(items[2].y).toBe(0);
        // Row 1
        expect(items[3].x).toBe(0);
        expect(items[3].y).toBe(80);
        expect(items[4].x).toBe(100);
        expect(items[4].y).toBe(80);
        expect(items[5].x).toBe(200);
        expect(items[5].y).toBe(80);
    });

    it('should lay out items column by column when only height is specified', function ()
    {
        var items = createItems(6);

        GridAlign(items, { height: 3, cellWidth: 80, cellHeight: 100, x: 0, y: 0 });

        // Column 0
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[1].y).toBe(100);
        expect(items[2].x).toBe(0);
        expect(items[2].y).toBe(200);
        // Column 1
        expect(items[3].x).toBe(80);
        expect(items[3].y).toBe(0);
        expect(items[4].x).toBe(80);
        expect(items[4].y).toBe(100);
        expect(items[5].x).toBe(80);
        expect(items[5].y).toBe(200);
    });

    it('should stop placing items when the grid is full with both width and height set', function ()
    {
        var items = createItems(8);

        GridAlign(items, { width: 2, height: 2, cellWidth: 100, cellHeight: 100, x: 0, y: 0 });

        // 2x2 grid holds 4 items
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(100);
        expect(items[1].y).toBe(0);
        expect(items[2].x).toBe(0);
        expect(items[2].y).toBe(100);
        expect(items[3].x).toBe(100);
        expect(items[3].y).toBe(100);

        // Items beyond grid capacity remain at their original positions
        expect(items[4].x).toBe(0);
        expect(items[4].y).toBe(0);
    });

    it('should apply custom x and y offsets to all item positions', function ()
    {
        var items = createItems(4);

        GridAlign(items, { width: 2, cellWidth: 100, cellHeight: 100, x: 50, y: 75 });

        expect(items[0].x).toBe(50);
        expect(items[0].y).toBe(75);
        expect(items[1].x).toBe(150);
        expect(items[1].y).toBe(75);
        expect(items[2].x).toBe(50);
        expect(items[2].y).toBe(175);
        expect(items[3].x).toBe(150);
        expect(items[3].y).toBe(175);
    });

    it('should default cellHeight to cellWidth when cellHeight is not provided', function ()
    {
        var items = createItems(4);

        GridAlign(items, { width: 2, cellWidth: 64, x: 0, y: 0 });

        // Row 0
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(64);
        expect(items[1].y).toBe(0);
        // Row 1 — cellHeight defaults to cellWidth = 64
        expect(items[2].x).toBe(0);
        expect(items[2].y).toBe(64);
        expect(items[3].x).toBe(64);
        expect(items[3].y).toBe(64);
    });

    it('should handle a single item', function ()
    {
        var items = createItems(1);

        GridAlign(items, { width: 3, cellWidth: 100, cellHeight: 100, x: 10, y: 20 });

        expect(items[0].x).toBe(10);
        expect(items[0].y).toBe(20);
    });

    it('should handle item count less than width without wrapping', function ()
    {
        var items = createItems(2);

        GridAlign(items, { width: 5, cellWidth: 100, cellHeight: 100, x: 0, y: 0 });

        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(100);
        expect(items[1].y).toBe(0);
    });

    it('should handle negative x and y starting positions', function ()
    {
        var items = createItems(2);

        GridAlign(items, { width: -1, cellWidth: 100, cellHeight: 100, x: -200, y: -50 });

        expect(items[0].x).toBe(-200);
        expect(items[0].y).toBe(-50);
        expect(items[1].x).toBe(-100);
        expect(items[1].y).toBe(-50);
    });

    it('should correctly wrap across multiple rows with a 4-column grid', function ()
    {
        var items = createItems(8);

        GridAlign(items, { width: 4, cellWidth: 50, cellHeight: 50, x: 0, y: 0 });

        // Row 0
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(50);
        expect(items[1].y).toBe(0);
        expect(items[2].x).toBe(100);
        expect(items[2].y).toBe(0);
        expect(items[3].x).toBe(150);
        expect(items[3].y).toBe(0);
        // Row 1
        expect(items[4].x).toBe(0);
        expect(items[4].y).toBe(50);
        expect(items[5].x).toBe(50);
        expect(items[5].y).toBe(50);
        expect(items[6].x).toBe(100);
        expect(items[6].y).toBe(50);
        expect(items[7].x).toBe(150);
        expect(items[7].y).toBe(50);
    });

    it('should lay out a 1-column grid vertically when width is 1', function ()
    {
        var items = createItems(4);

        GridAlign(items, { width: 1, cellWidth: 100, cellHeight: 80, x: 0, y: 0 });

        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[1].y).toBe(80);
        expect(items[2].x).toBe(0);
        expect(items[2].y).toBe(160);
        expect(items[3].x).toBe(0);
        expect(items[3].y).toBe(240);
    });

    it('should advance to next column after filling a height-only row limit', function ()
    {
        var items = createItems(4);

        GridAlign(items, { height: 1, cellWidth: 80, cellHeight: 100, x: 0, y: 0 });

        // height=1 means 1 row per column, so each item gets its own column
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(80);
        expect(items[1].y).toBe(0);
        expect(items[2].x).toBe(160);
        expect(items[2].y).toBe(0);
        expect(items[3].x).toBe(240);
        expect(items[3].y).toBe(0);
    });

    it('should place items at correct positions with non-zero origin and non-zero offset', function ()
    {
        var items = createItems(3);

        GridAlign(items, { height: -1, cellWidth: 100, cellHeight: 100, x: 200, y: 100 });

        expect(items[0].x).toBe(200);
        expect(items[0].y).toBe(100);
        expect(items[1].x).toBe(200);
        expect(items[1].y).toBe(200);
        expect(items[2].x).toBe(200);
        expect(items[2].y).toBe(300);
    });
});
