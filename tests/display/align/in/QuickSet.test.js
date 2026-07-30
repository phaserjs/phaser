var ALIGN_CONST = require('../../../../src/display/align/const');
var QuickSet = require('../../../../src/display/align/in/QuickSet');

describe('Phaser.Display.Align.In.QuickSet', function ()
{
    var child;
    var alignIn;

    // Helper: create a plain game object with origin at top-left (0, 0)
    // so bounds math is trivial:
    //   left   = x,             right  = x + width
    //   top    = y,             bottom = y + height
    //   centerX = x + width/2,  centerY = y + height/2
    function makeObject(x, y, width, height)
    {
        return { x: x, y: y, width: width, height: height, originX: 0, originY: 0 };
    }

    beforeEach(function ()
    {
        // alignIn: a 200x200 box at (0, 0) → left=0 right=200 top=0 bottom=200 center=(100,100)
        alignIn = makeObject(0, 0, 200, 200);
        // child: a 50x50 box placed far away so we can verify it gets moved
        child = makeObject(999, 999, 50, 50);
    });

    // -------------------------------------------------------------------------
    // Return value
    // -------------------------------------------------------------------------

    it('should return the child Game Object', function ()
    {
        var result = QuickSet(child, alignIn, ALIGN_CONST.CENTER);

        expect(result).toBe(child);
    });

    // -------------------------------------------------------------------------
    // CENTER (6)
    // -------------------------------------------------------------------------

    it('should center the child inside alignIn when position is CENTER', function ()
    {
        // centerX of alignIn = 100, centerY = 100
        // SetCenterX: child.x = centerX - width/2 = 100 - 25 = 75
        // SetCenterY: child.y = centerY - height/2 = 100 - 25 = 75
        QuickSet(child, alignIn, ALIGN_CONST.CENTER);

        expect(child.x).toBe(75);
        expect(child.y).toBe(75);
    });

    it('should apply offsetX and offsetY when centering', function ()
    {
        QuickSet(child, alignIn, ALIGN_CONST.CENTER, 10, -5);

        // center + offset fed into SetCenterX/SetCenterY:
        // SetCenterX(child, 100 + 10) → child.x = 110 - 25 = 85
        // SetCenterY(child, 100 + (-5)) → child.y = 95 - 25 = 70
        expect(child.x).toBe(85);
        expect(child.y).toBe(70);
    });

    // -------------------------------------------------------------------------
    // TOP_LEFT (0)
    // -------------------------------------------------------------------------

    it('should align child to the top-left corner of alignIn', function ()
    {
        // SetLeft(child, left=0) → child.x = 0
        // SetTop(child, top=0) → child.y = 0
        QuickSet(child, alignIn, ALIGN_CONST.TOP_LEFT);

        expect(child.x).toBe(0);
        expect(child.y).toBe(0);
    });

    it('should apply offsets when aligning to TOP_LEFT', function ()
    {
        // SetLeft(child, 0 - offsetX=5) → child.x = -5
        // SetTop(child, 0 - offsetY=10) → child.y = -10
        QuickSet(child, alignIn, ALIGN_CONST.TOP_LEFT, 5, 10);

        expect(child.x).toBe(-5);
        expect(child.y).toBe(-10);
    });

    // -------------------------------------------------------------------------
    // TOP_CENTER (1)
    // -------------------------------------------------------------------------

    it('should align child to the top-center of alignIn', function ()
    {
        // SetCenterX(child, centerX=100) → child.x = 100 - 25 = 75
        // SetTop(child, top=0) → child.y = 0
        QuickSet(child, alignIn, ALIGN_CONST.TOP_CENTER);

        expect(child.x).toBe(75);
        expect(child.y).toBe(0);
    });

    // -------------------------------------------------------------------------
    // TOP_RIGHT (2)
    // -------------------------------------------------------------------------

    it('should align child to the top-right corner of alignIn', function ()
    {
        // SetRight(child, right=200) → child.x = 200 - 50 = 150
        // SetTop(child, top=0) → child.y = 0
        QuickSet(child, alignIn, ALIGN_CONST.TOP_RIGHT);

        expect(child.x).toBe(150);
        expect(child.y).toBe(0);
    });

    // -------------------------------------------------------------------------
    // LEFT_CENTER (4)
    // -------------------------------------------------------------------------

    it('should align child to the left-center of alignIn', function ()
    {
        // SetLeft(child, left=0) → child.x = 0
        // SetCenterY(child, centerY=100) → child.y = 100 - 25 = 75
        QuickSet(child, alignIn, ALIGN_CONST.LEFT_CENTER);

        expect(child.x).toBe(0);
        expect(child.y).toBe(75);
    });

    // -------------------------------------------------------------------------
    // RIGHT_CENTER (8)
    // -------------------------------------------------------------------------

    it('should align child to the right-center of alignIn', function ()
    {
        // SetRight(child, right=200) → child.x = 200 - 50 = 150
        // SetCenterY(child, centerY=100) → child.y = 100 - 25 = 75
        QuickSet(child, alignIn, ALIGN_CONST.RIGHT_CENTER);

        expect(child.x).toBe(150);
        expect(child.y).toBe(75);
    });

    // -------------------------------------------------------------------------
    // BOTTOM_LEFT (10)
    // -------------------------------------------------------------------------

    it('should align child to the bottom-left corner of alignIn', function ()
    {
        // SetLeft(child, left=0) → child.x = 0
        // SetBottom(child, bottom=200) → child.y = 200 - 50 = 150
        QuickSet(child, alignIn, ALIGN_CONST.BOTTOM_LEFT);

        expect(child.x).toBe(0);
        expect(child.y).toBe(150);
    });

    // -------------------------------------------------------------------------
    // BOTTOM_CENTER (11)
    // -------------------------------------------------------------------------

    it('should align child to the bottom-center of alignIn', function ()
    {
        // SetCenterX(child, centerX=100) → child.x = 100 - 25 = 75
        // SetBottom(child, bottom=200) → child.y = 200 - 50 = 150
        QuickSet(child, alignIn, ALIGN_CONST.BOTTOM_CENTER);

        expect(child.x).toBe(75);
        expect(child.y).toBe(150);
    });

    // -------------------------------------------------------------------------
    // BOTTOM_RIGHT (12)
    // -------------------------------------------------------------------------

    it('should align child to the bottom-right corner of alignIn', function ()
    {
        // SetRight(child, right=200) → child.x = 200 - 50 = 150
        // SetBottom(child, bottom=200) → child.y = 200 - 50 = 150
        QuickSet(child, alignIn, ALIGN_CONST.BOTTOM_RIGHT);

        expect(child.x).toBe(150);
        expect(child.y).toBe(150);
    });

    it('should apply offsets when aligning to BOTTOM_RIGHT', function ()
    {
        // SetRight(child, 200 + offsetX=10) → child.x = 210 - 50 = 160
        // SetBottom(child, 200 + offsetY=20) → child.y = 220 - 50 = 170
        QuickSet(child, alignIn, ALIGN_CONST.BOTTOM_RIGHT, 10, 20);

        expect(child.x).toBe(160);
        expect(child.y).toBe(170);
    });

    // -------------------------------------------------------------------------
    // Alias constants: LEFT_TOP == TOP_LEFT
    // -------------------------------------------------------------------------

    it('should treat LEFT_TOP as an alias for TOP_LEFT', function ()
    {
        var childA = makeObject(999, 999, 50, 50);
        var childB = makeObject(999, 999, 50, 50);

        QuickSet(childA, alignIn, ALIGN_CONST.LEFT_TOP);
        QuickSet(childB, alignIn, ALIGN_CONST.TOP_LEFT);

        expect(childA.x).toBe(childB.x);
        expect(childA.y).toBe(childB.y);
    });

    // -------------------------------------------------------------------------
    // Alias constants: LEFT_BOTTOM == BOTTOM_LEFT
    // -------------------------------------------------------------------------

    it('should treat LEFT_BOTTOM as an alias for BOTTOM_LEFT', function ()
    {
        var childA = makeObject(999, 999, 50, 50);
        var childB = makeObject(999, 999, 50, 50);

        QuickSet(childA, alignIn, ALIGN_CONST.LEFT_BOTTOM);
        QuickSet(childB, alignIn, ALIGN_CONST.BOTTOM_LEFT);

        expect(childA.x).toBe(childB.x);
        expect(childA.y).toBe(childB.y);
    });

    // -------------------------------------------------------------------------
    // Alias constants: RIGHT_TOP == TOP_RIGHT
    // -------------------------------------------------------------------------

    it('should treat RIGHT_TOP as an alias for TOP_RIGHT', function ()
    {
        var childA = makeObject(999, 999, 50, 50);
        var childB = makeObject(999, 999, 50, 50);

        QuickSet(childA, alignIn, ALIGN_CONST.RIGHT_TOP);
        QuickSet(childB, alignIn, ALIGN_CONST.TOP_RIGHT);

        expect(childA.x).toBe(childB.x);
        expect(childA.y).toBe(childB.y);
    });

    // -------------------------------------------------------------------------
    // Alias constants: RIGHT_BOTTOM == BOTTOM_RIGHT
    // -------------------------------------------------------------------------

    it('should treat RIGHT_BOTTOM as an alias for BOTTOM_RIGHT', function ()
    {
        var childA = makeObject(999, 999, 50, 50);
        var childB = makeObject(999, 999, 50, 50);

        QuickSet(childA, alignIn, ALIGN_CONST.RIGHT_BOTTOM);
        QuickSet(childB, alignIn, ALIGN_CONST.BOTTOM_RIGHT);

        expect(childA.x).toBe(childB.x);
        expect(childA.y).toBe(childB.y);
    });

    // -------------------------------------------------------------------------
    // Default offset behaviour (zero offsets)
    // -------------------------------------------------------------------------

    it('should default offsetX and offsetY to zero when not provided', function ()
    {
        var childWithOffset = makeObject(999, 999, 50, 50);
        var childNoOffset = makeObject(999, 999, 50, 50);

        QuickSet(childWithOffset, alignIn, ALIGN_CONST.CENTER, 0, 0);
        QuickSet(childNoOffset, alignIn, ALIGN_CONST.CENTER);

        expect(childWithOffset.x).toBe(childNoOffset.x);
        expect(childWithOffset.y).toBe(childNoOffset.y);
    });

    // -------------------------------------------------------------------------
    // Non-zero-origin child — verify offset interaction
    // -------------------------------------------------------------------------

    it('should correctly position a child with non-zero origin at CENTER', function ()
    {
        // child with originX=0.5, originY=0.5 (classic centered origin)
        var centeredChild = { x: 999, y: 999, width: 50, height: 50, originX: 0.5, originY: 0.5 };

        QuickSet(centeredChild, alignIn, ALIGN_CONST.CENTER);

        // SetCenterX(centeredChild, 100):
        //   centeredChild.x = (100 + 50*0.5) - 50*0.5 = (100 + 25) - 25 = 100
        // SetCenterY(centeredChild, 100):
        //   centeredChild.y = (100 + 50*0.5) - 50*0.5 = 100
        expect(centeredChild.x).toBe(100);
        expect(centeredChild.y).toBe(100);
    });

    // -------------------------------------------------------------------------
    // Non-default alignIn position
    // -------------------------------------------------------------------------

    it('should align relative to an alignIn object not at the origin', function ()
    {
        // alignIn at (100, 50), 200x100 → left=100 right=300 top=50 bottom=150
        var offsetAlignIn = makeObject(100, 50, 200, 100);

        QuickSet(child, offsetAlignIn, ALIGN_CONST.TOP_LEFT);

        expect(child.x).toBe(100);
        expect(child.y).toBe(50);
    });

    it('should align to bottom-right of a non-origin alignIn', function ()
    {
        // alignIn at (100, 50), 200x100 → right=300 bottom=150
        var offsetAlignIn = makeObject(100, 50, 200, 100);

        QuickSet(child, offsetAlignIn, ALIGN_CONST.BOTTOM_RIGHT);

        // SetRight(child, 300) → child.x = 300 - 50 = 250
        // SetBottom(child, 150) → child.y = 150 - 50 = 100
        expect(child.x).toBe(250);
        expect(child.y).toBe(100);
    });
});
