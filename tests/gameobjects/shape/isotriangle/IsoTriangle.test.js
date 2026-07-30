var IsoTriangle = require('../../../../src/gameobjects/shape/isotriangle/IsoTriangle');

describe('IsoTriangle', function ()
{
    it('should be importable', function ()
    {
        expect(IsoTriangle).toBeDefined();
    });

    it('should be a constructor function', function ()
    {
        expect(typeof IsoTriangle).toBe('function');
    });

    describe('setProjection', function ()
    {
        it('should set the projection property', function ()
        {
            var obj = { projection: 4 };
            IsoTriangle.prototype.setProjection.call(obj, 8);
            expect(obj.projection).toBe(8);
        });

        it('should return the instance for chaining', function ()
        {
            var obj = { projection: 4 };
            var result = IsoTriangle.prototype.setProjection.call(obj, 2);
            expect(result).toBe(obj);
        });

        it('should accept zero as projection value', function ()
        {
            var obj = { projection: 4 };
            IsoTriangle.prototype.setProjection.call(obj, 0);
            expect(obj.projection).toBe(0);
        });

        it('should accept negative projection values', function ()
        {
            var obj = { projection: 4 };
            IsoTriangle.prototype.setProjection.call(obj, -3);
            expect(obj.projection).toBe(-3);
        });

        it('should accept floating point projection values', function ()
        {
            var obj = { projection: 4 };
            IsoTriangle.prototype.setProjection.call(obj, 2.5);
            expect(obj.projection).toBeCloseTo(2.5);
        });
    });

    describe('setReversed', function ()
    {
        it('should set isReversed to true', function ()
        {
            var obj = { isReversed: false };
            IsoTriangle.prototype.setReversed.call(obj, true);
            expect(obj.isReversed).toBe(true);
        });

        it('should set isReversed to false', function ()
        {
            var obj = { isReversed: true };
            IsoTriangle.prototype.setReversed.call(obj, false);
            expect(obj.isReversed).toBe(false);
        });

        it('should return the instance for chaining', function ()
        {
            var obj = { isReversed: false };
            var result = IsoTriangle.prototype.setReversed.call(obj, true);
            expect(result).toBe(obj);
        });
    });

    describe('setFaces', function ()
    {
        it('should set all three face visibility flags', function ()
        {
            var obj = { showTop: true, showLeft: true, showRight: true };
            IsoTriangle.prototype.setFaces.call(obj, false, false, false);
            expect(obj.showTop).toBe(false);
            expect(obj.showLeft).toBe(false);
            expect(obj.showRight).toBe(false);
        });

        it('should default all faces to true when called with no arguments', function ()
        {
            var obj = { showTop: false, showLeft: false, showRight: false };
            IsoTriangle.prototype.setFaces.call(obj);
            expect(obj.showTop).toBe(true);
            expect(obj.showLeft).toBe(true);
            expect(obj.showRight).toBe(true);
        });

        it('should default undefined arguments to true', function ()
        {
            var obj = { showTop: false, showLeft: false, showRight: false };
            IsoTriangle.prototype.setFaces.call(obj, undefined, undefined, undefined);
            expect(obj.showTop).toBe(true);
            expect(obj.showLeft).toBe(true);
            expect(obj.showRight).toBe(true);
        });

        it('should allow mixed face visibility', function ()
        {
            var obj = { showTop: true, showLeft: true, showRight: true };
            IsoTriangle.prototype.setFaces.call(obj, false, true, false);
            expect(obj.showTop).toBe(false);
            expect(obj.showLeft).toBe(true);
            expect(obj.showRight).toBe(false);
        });

        it('should return the instance for chaining', function ()
        {
            var obj = { showTop: true, showLeft: true, showRight: true };
            var result = IsoTriangle.prototype.setFaces.call(obj, false, false, false);
            expect(result).toBe(obj);
        });
    });

    describe('setFillStyle', function ()
    {
        it('should set fillTop, fillLeft, and fillRight colors', function ()
        {
            var obj = { fillTop: 0, fillLeft: 0, fillRight: 0, isFilled: false };
            IsoTriangle.prototype.setFillStyle.call(obj, 0xeeeeee, 0x999999, 0xcccccc);
            expect(obj.fillTop).toBe(0xeeeeee);
            expect(obj.fillLeft).toBe(0x999999);
            expect(obj.fillRight).toBe(0xcccccc);
        });

        it('should set isFilled to true', function ()
        {
            var obj = { fillTop: 0, fillLeft: 0, fillRight: 0, isFilled: false };
            IsoTriangle.prototype.setFillStyle.call(obj, 0xff0000, 0x00ff00, 0x0000ff);
            expect(obj.isFilled).toBe(true);
        });

        it('should return the instance for chaining', function ()
        {
            var obj = { fillTop: 0, fillLeft: 0, fillRight: 0, isFilled: false };
            var result = IsoTriangle.prototype.setFillStyle.call(obj, 0xffffff, 0x000000, 0x808080);
            expect(result).toBe(obj);
        });

        it('should accept zero as a color value', function ()
        {
            var obj = { fillTop: 0xff0000, fillLeft: 0xff0000, fillRight: 0xff0000, isFilled: false };
            IsoTriangle.prototype.setFillStyle.call(obj, 0, 0, 0);
            expect(obj.fillTop).toBe(0);
            expect(obj.fillLeft).toBe(0);
            expect(obj.fillRight).toBe(0);
        });

        it('should accept undefined fill values', function ()
        {
            var obj = { fillTop: 0xff0000, fillLeft: 0xff0000, fillRight: 0xff0000, isFilled: false };
            IsoTriangle.prototype.setFillStyle.call(obj, undefined, undefined, undefined);
            expect(obj.fillTop).toBeUndefined();
            expect(obj.fillLeft).toBeUndefined();
            expect(obj.fillRight).toBeUndefined();
            expect(obj.isFilled).toBe(true);
        });
    });
});
