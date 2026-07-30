var QuickSet = require('../../../../src/display/align/to/QuickSet');
var ALIGN_CONST = require('../../../../src/display/align/const');

describe('Phaser.Display.Align.To.QuickSet', function ()
{
    var alignTo;
    var child;

    beforeEach(function ()
    {
        // alignTo bounds: left=75, right=125, top=75, bottom=125, centerX=100, centerY=100
        alignTo = { x: 100, y: 100, width: 50, height: 50, originX: 0.5, originY: 0.5 };

        // child with origin 0.5: SetLeft(v)->x=v+10, SetRight(v)->x=v-10
        //                        SetTop(v)->y=v+10, SetBottom(v)->y=v-10
        //                        SetCenterX(v)->x=v, SetCenterY(v)->y=v
        child = { x: 0, y: 0, width: 20, height: 20, originX: 0.5, originY: 0.5 };
    });

    it('should return the child game object', function ()
    {
        var result = QuickSet(child, alignTo, ALIGN_CONST.BOTTOM_CENTER);

        expect(result).toBe(child);
    });

    it('should align to BOTTOM_CENTER: child top flush with alignTo bottom, centered horizontally', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.BOTTOM_CENTER);

        expect(child.x).toBe(100);
        expect(child.y).toBe(135);
    });

    it('should align to BOTTOM_LEFT: child top flush with alignTo bottom, left edges aligned', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.BOTTOM_LEFT);

        expect(child.x).toBe(85);
        expect(child.y).toBe(135);
    });

    it('should align to BOTTOM_RIGHT: child top flush with alignTo bottom, right edges aligned', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.BOTTOM_RIGHT);

        expect(child.x).toBe(115);
        expect(child.y).toBe(135);
    });

    it('should align to LEFT_BOTTOM: child right flush with alignTo left, bottom edges aligned', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.LEFT_BOTTOM);

        expect(child.x).toBe(65);
        expect(child.y).toBe(115);
    });

    it('should align to LEFT_CENTER: child right flush with alignTo left, vertically centered', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.LEFT_CENTER);

        expect(child.x).toBe(65);
        expect(child.y).toBe(100);
    });

    it('should align to LEFT_TOP: child right flush with alignTo left, top edges aligned', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.LEFT_TOP);

        expect(child.x).toBe(65);
        expect(child.y).toBe(85);
    });

    it('should align to RIGHT_BOTTOM: child left flush with alignTo right, bottom edges aligned', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.RIGHT_BOTTOM);

        expect(child.x).toBe(135);
        expect(child.y).toBe(115);
    });

    it('should align to RIGHT_CENTER: child left flush with alignTo right, vertically centered', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.RIGHT_CENTER);

        expect(child.x).toBe(135);
        expect(child.y).toBe(100);
    });

    it('should align to RIGHT_TOP: child left flush with alignTo right, top edges aligned', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.RIGHT_TOP);

        expect(child.x).toBe(135);
        expect(child.y).toBe(85);
    });

    it('should align to TOP_CENTER: child bottom flush with alignTo top, centered horizontally', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.TOP_CENTER);

        expect(child.x).toBe(100);
        expect(child.y).toBe(65);
    });

    it('should align to TOP_LEFT: child bottom flush with alignTo top, left edges aligned', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.TOP_LEFT);

        expect(child.x).toBe(85);
        expect(child.y).toBe(65);
    });

    it('should align to TOP_RIGHT: child bottom flush with alignTo top, right edges aligned', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.TOP_RIGHT);

        expect(child.x).toBe(115);
        expect(child.y).toBe(65);
    });

    it('should apply offsetX to horizontal position for BOTTOM_CENTER', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.BOTTOM_CENTER, 10, 0);

        expect(child.x).toBe(110);
        expect(child.y).toBe(135);
    });

    it('should apply offsetY to vertical position for BOTTOM_CENTER', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.BOTTOM_CENTER, 0, 5);

        expect(child.x).toBe(100);
        expect(child.y).toBe(140);
    });

    it('should apply both offsetX and offsetY for RIGHT_CENTER', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.RIGHT_CENTER, 5, 10);

        expect(child.x).toBe(140);
        expect(child.y).toBe(110);
    });

    it('should apply negative offsets', function ()
    {
        QuickSet(child, alignTo, ALIGN_CONST.BOTTOM_CENTER, -10, -5);

        expect(child.x).toBe(90);
        expect(child.y).toBe(130);
    });

    it('should treat missing offsetX and offsetY as zero', function ()
    {
        var resultWithDefaults = QuickSet(child, alignTo, ALIGN_CONST.TOP_LEFT);
        var xWithDefaults = child.x;
        var yWithDefaults = child.y;

        child.x = 0;
        child.y = 0;

        QuickSet(child, alignTo, ALIGN_CONST.TOP_LEFT, 0, 0);

        expect(child.x).toBe(xWithDefaults);
        expect(child.y).toBe(yWithDefaults);
    });

    it('should work when child and alignTo have zero size', function ()
    {
        child = { x: 0, y: 0, width: 0, height: 0, originX: 0.5, originY: 0.5 };
        alignTo = { x: 50, y: 50, width: 0, height: 0, originX: 0.5, originY: 0.5 };

        var result = QuickSet(child, alignTo, ALIGN_CONST.BOTTOM_CENTER);

        expect(result).toBe(child);
        expect(child.x).toBe(50);
        expect(child.y).toBe(50);
    });

    it('should work when alignTo has origin at top-left (0, 0)', function ()
    {
        // alignTo with originX=0, originY=0: left=100, right=150, top=100, bottom=150
        alignTo = { x: 100, y: 100, width: 50, height: 50, originX: 0, originY: 0 };
        // child with originX=0, originY=0: SetLeft(v)->x=v, SetTop(v)->y=v
        child = { x: 0, y: 0, width: 20, height: 20, originX: 0, originY: 0 };

        QuickSet(child, alignTo, ALIGN_CONST.BOTTOM_LEFT);

        // SetLeft(child, GetLeft(alignTo)) -> child.x = 100 + 0 = 100
        // SetTop(child, GetBottom(alignTo)) -> child.y = 150 + 0 = 150
        expect(child.x).toBe(100);
        expect(child.y).toBe(150);
    });

    it('should work with negative coordinates on alignTo', function ()
    {
        // alignTo: x=-50, y=-50, bounds: left=-75, right=-25, top=-75, bottom=-25
        alignTo = { x: -50, y: -50, width: 50, height: 50, originX: 0.5, originY: 0.5 };

        QuickSet(child, alignTo, ALIGN_CONST.RIGHT_CENTER);

        // SetLeft(child, GetRight(alignTo)) -> GetRight = -50+50 - 25 = -25, child.x = -25+10 = -15
        // SetCenterY(child, GetCenterY(alignTo)) -> GetCenterY = -50-25+25 = -50, child.y = -50
        expect(child.x).toBe(-15);
        expect(child.y).toBe(-50);
    });
});
