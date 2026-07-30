var Grid = require('../../../../src/gameobjects/shape/grid/Grid');

describe('Grid', function ()
{
    var mockGrid;

    beforeEach(function ()
    {
        mockGrid = {
            showAltCells: false,
            altFillColor: undefined,
            altFillAlpha: undefined,
            cellPadding: 0.5,
            strokeOutside: false,
            strokeOutsideIncomplete: true
        };
    });

    describe('setAltFillStyle', function ()
    {
        it('should set altFillColor and altFillAlpha and enable showAltCells', function ()
        {
            Grid.prototype.setAltFillStyle.call(mockGrid, 0xff0000, 0.5);

            expect(mockGrid.altFillColor).toBe(0xff0000);
            expect(mockGrid.altFillAlpha).toBe(0.5);
            expect(mockGrid.showAltCells).toBe(true);
        });

        it('should default fillAlpha to 1 when not provided', function ()
        {
            Grid.prototype.setAltFillStyle.call(mockGrid, 0x00ff00);

            expect(mockGrid.altFillColor).toBe(0x00ff00);
            expect(mockGrid.altFillAlpha).toBe(1);
            expect(mockGrid.showAltCells).toBe(true);
        });

        it('should disable showAltCells when called with no arguments', function ()
        {
            mockGrid.showAltCells = true;

            Grid.prototype.setAltFillStyle.call(mockGrid);

            expect(mockGrid.showAltCells).toBe(false);
        });

        it('should disable showAltCells when fillColor is undefined', function ()
        {
            mockGrid.showAltCells = true;

            Grid.prototype.setAltFillStyle.call(mockGrid, undefined, 0.8);

            expect(mockGrid.showAltCells).toBe(false);
        });

        it('should return the context object for chaining', function ()
        {
            var result = Grid.prototype.setAltFillStyle.call(mockGrid, 0xff0000);

            expect(result).toBe(mockGrid);
        });

        it('should handle a fill color of zero', function ()
        {
            Grid.prototype.setAltFillStyle.call(mockGrid, 0x000000, 1);

            expect(mockGrid.altFillColor).toBe(0);
            expect(mockGrid.showAltCells).toBe(true);
        });

        it('should handle a fill alpha of zero', function ()
        {
            Grid.prototype.setAltFillStyle.call(mockGrid, 0xff0000, 0);

            expect(mockGrid.altFillAlpha).toBe(0);
            expect(mockGrid.showAltCells).toBe(true);
        });
    });

    describe('setCellPadding', function ()
    {
        it('should set cellPadding to the given value', function ()
        {
            Grid.prototype.setCellPadding.call(mockGrid, 4);

            expect(mockGrid.cellPadding).toBe(4);
        });

        it('should set cellPadding to zero when called with no argument', function ()
        {
            mockGrid.cellPadding = 0.5;

            Grid.prototype.setCellPadding.call(mockGrid);

            expect(mockGrid.cellPadding).toBe(0);
        });

        it('should set cellPadding to zero when called with zero', function ()
        {
            mockGrid.cellPadding = 0.5;

            Grid.prototype.setCellPadding.call(mockGrid, 0);

            expect(mockGrid.cellPadding).toBe(0);
        });

        it('should accept floating point values', function ()
        {
            Grid.prototype.setCellPadding.call(mockGrid, 1.5);

            expect(mockGrid.cellPadding).toBeCloseTo(1.5);
        });

        it('should return the context object for chaining', function ()
        {
            var result = Grid.prototype.setCellPadding.call(mockGrid, 2);

            expect(result).toBe(mockGrid);
        });

        it('should accept large padding values', function ()
        {
            Grid.prototype.setCellPadding.call(mockGrid, 999);

            expect(mockGrid.cellPadding).toBe(999);
        });
    });

    describe('setStrokeOutside', function ()
    {
        it('should set strokeOutside to true', function ()
        {
            Grid.prototype.setStrokeOutside.call(mockGrid, true);

            expect(mockGrid.strokeOutside).toBe(true);
        });

        it('should set strokeOutside to false', function ()
        {
            mockGrid.strokeOutside = true;

            Grid.prototype.setStrokeOutside.call(mockGrid, false);

            expect(mockGrid.strokeOutside).toBe(false);
        });

        it('should set strokeOutsideIncomplete when provided', function ()
        {
            Grid.prototype.setStrokeOutside.call(mockGrid, true, false);

            expect(mockGrid.strokeOutside).toBe(true);
            expect(mockGrid.strokeOutsideIncomplete).toBe(false);
        });

        it('should not change strokeOutsideIncomplete when second argument is omitted', function ()
        {
            mockGrid.strokeOutsideIncomplete = true;

            Grid.prototype.setStrokeOutside.call(mockGrid, true);

            expect(mockGrid.strokeOutsideIncomplete).toBe(true);
        });

        it('should set strokeOutsideIncomplete to true', function ()
        {
            mockGrid.strokeOutsideIncomplete = false;

            Grid.prototype.setStrokeOutside.call(mockGrid, false, true);

            expect(mockGrid.strokeOutsideIncomplete).toBe(true);
        });

        it('should return the context object for chaining', function ()
        {
            var result = Grid.prototype.setStrokeOutside.call(mockGrid, true);

            expect(result).toBe(mockGrid);
        });
    });

    describe('module', function ()
    {
        it('should be importable', function ()
        {
            expect(Grid).toBeDefined();
        });

        it('should expose setAltFillStyle on the prototype', function ()
        {
            expect(typeof Grid.prototype.setAltFillStyle).toBe('function');
        });

        it('should expose setCellPadding on the prototype', function ()
        {
            expect(typeof Grid.prototype.setCellPadding).toBe('function');
        });

        it('should expose setStrokeOutside on the prototype', function ()
        {
            expect(typeof Grid.prototype.setStrokeOutside).toBe('function');
        });
    });
});
