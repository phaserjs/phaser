var Alpha = require('../../../src/gameobjects/components/Alpha');

// Helper: create a mock Game Object with Alpha mixin applied
function createGameObject ()
{
    var obj = {
        _alpha: 1,
        _alphaTL: 1,
        _alphaTR: 1,
        _alphaBL: 1,
        _alphaBR: 1,
        renderFlags: 15 // all flags set (0b1111)
    };

    // Copy plain methods
    obj.clearAlpha = Alpha.clearAlpha;
    obj.setAlpha = Alpha.setAlpha;

    // Apply getter/setter properties as actual accessors
    Object.defineProperties(obj, {
        alpha: Alpha.alpha,
        alphaTopLeft: Alpha.alphaTopLeft,
        alphaTopRight: Alpha.alphaTopRight,
        alphaBottomLeft: Alpha.alphaBottomLeft,
        alphaBottomRight: Alpha.alphaBottomRight
    });

    return obj;
}

describe('Alpha', function ()
{
    var go;

    beforeEach(function ()
    {
        go = createGameObject();
    });

    // -------------------------------------------------------------------------
    // Default values
    // -------------------------------------------------------------------------

    describe('default values', function ()
    {
        it('should have _alpha defaulting to 1', function ()
        {
            expect(Alpha._alpha).toBe(1);
        });

        it('should have _alphaTL defaulting to 1', function ()
        {
            expect(Alpha._alphaTL).toBe(1);
        });

        it('should have _alphaTR defaulting to 1', function ()
        {
            expect(Alpha._alphaTR).toBe(1);
        });

        it('should have _alphaBL defaulting to 1', function ()
        {
            expect(Alpha._alphaBL).toBe(1);
        });

        it('should have _alphaBR defaulting to 1', function ()
        {
            expect(Alpha._alphaBR).toBe(1);
        });
    });

    // -------------------------------------------------------------------------
    // clearAlpha
    // -------------------------------------------------------------------------

    describe('clearAlpha', function ()
    {
        it('should reset alpha to 1', function ()
        {
            go.alpha = 0.5;
            go.clearAlpha();

            expect(go.alpha).toBe(1);
        });

        it('should reset all corner alphas to 1', function ()
        {
            go.setAlpha(0.1, 0.2, 0.3, 0.4);
            go.clearAlpha();

            expect(go._alphaTL).toBe(1);
            expect(go._alphaTR).toBe(1);
            expect(go._alphaBL).toBe(1);
            expect(go._alphaBR).toBe(1);
        });

        it('should return the game object for chaining', function ()
        {
            var result = go.clearAlpha();

            expect(result).toBe(go);
        });

        it('should set renderFlags bit when clearing from zero', function ()
        {
            go.alpha = 0;
            go.clearAlpha();

            expect(go.renderFlags & 2).toBe(2);
        });
    });

    // -------------------------------------------------------------------------
    // setAlpha
    // -------------------------------------------------------------------------

    describe('setAlpha', function ()
    {
        it('should return the game object for chaining', function ()
        {
            var result = go.setAlpha(0.5);

            expect(result).toBe(go);
        });

        it('should set global alpha when only topLeft is provided', function ()
        {
            go.setAlpha(0.5);

            expect(go.alpha).toBe(0.5);
        });

        it('should set all four corners to the same value when only topLeft is given', function ()
        {
            go.setAlpha(0.5);

            expect(go._alphaTL).toBe(0.5);
            expect(go._alphaTR).toBe(0.5);
            expect(go._alphaBL).toBe(0.5);
            expect(go._alphaBR).toBe(0.5);
        });

        it('should default to 1 when called with no arguments', function ()
        {
            go.alpha = 0.5;
            go.setAlpha();

            expect(go.alpha).toBe(1);
        });

        it('should set individual corner alphas when all four values are given', function ()
        {
            go.setAlpha(0.1, 0.2, 0.3, 0.4);

            expect(go._alphaTL).toBeCloseTo(0.1);
            expect(go._alphaTR).toBeCloseTo(0.2);
            expect(go._alphaBL).toBeCloseTo(0.3);
            expect(go._alphaBR).toBeCloseTo(0.4);
        });

        it('should clamp corner values above 1 to 1', function ()
        {
            go.setAlpha(2, 3, 4, 5);

            expect(go._alphaTL).toBe(1);
            expect(go._alphaTR).toBe(1);
            expect(go._alphaBL).toBe(1);
            expect(go._alphaBR).toBe(1);
        });

        it('should clamp corner values below 0 to 0', function ()
        {
            go.setAlpha(-1, -2, -3, -4);

            expect(go._alphaTL).toBe(0);
            expect(go._alphaTR).toBe(0);
            expect(go._alphaBL).toBe(0);
            expect(go._alphaBR).toBe(0);
        });

        it('should not touch _alpha when setting four individual corners', function ()
        {
            go.alpha = 0.8;
            go.setAlpha(0.1, 0.2, 0.3, 0.4);

            // _alpha is not updated by the four-corner path
            expect(go._alpha).toBe(0.8);
        });

        it('should clamp global alpha above 1 to 1 via single-value path', function ()
        {
            go.setAlpha(5);

            expect(go.alpha).toBe(1);
        });

        it('should clamp global alpha below 0 to 0 via single-value path', function ()
        {
            go.setAlpha(-1);

            expect(go.alpha).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // alpha getter / setter
    // -------------------------------------------------------------------------

    describe('alpha', function ()
    {
        it('should get the current _alpha value', function ()
        {
            go._alpha = 0.75;

            expect(go.alpha).toBe(0.75);
        });

        it('should set _alpha to the clamped value', function ()
        {
            go.alpha = 0.5;

            expect(go._alpha).toBe(0.5);
        });

        it('should set all four corner values when alpha is set', function ()
        {
            go.alpha = 0.6;

            expect(go._alphaTL).toBe(0.6);
            expect(go._alphaTR).toBe(0.6);
            expect(go._alphaBL).toBe(0.6);
            expect(go._alphaBR).toBe(0.6);
        });

        it('should clamp values above 1 to 1', function ()
        {
            go.alpha = 5;

            expect(go._alpha).toBe(1);
        });

        it('should clamp values below 0 to 0', function ()
        {
            go.alpha = -5;

            expect(go._alpha).toBe(0);
        });

        it('should clear the render flag bit when set to 0', function ()
        {
            go.renderFlags = 15; // 0b1111
            go.alpha = 0;

            expect(go.renderFlags & 2).toBe(0);
        });

        it('should set the render flag bit when set to a non-zero value', function ()
        {
            go.renderFlags = 0;
            go.alpha = 0.5;

            expect(go.renderFlags & 2).toBe(2);
        });

        it('should set the render flag bit when set to 1', function ()
        {
            go.renderFlags = 0;
            go.alpha = 1;

            expect(go.renderFlags & 2).toBe(2);
        });

        it('should accept floating point values', function ()
        {
            go.alpha = 0.123;

            expect(go.alpha).toBeCloseTo(0.123);
        });
    });

    // -------------------------------------------------------------------------
    // alphaTopLeft
    // -------------------------------------------------------------------------

    describe('alphaTopLeft', function ()
    {
        it('should get the _alphaTL value', function ()
        {
            go._alphaTL = 0.4;

            expect(go.alphaTopLeft).toBe(0.4);
        });

        it('should set _alphaTL to the clamped value', function ()
        {
            go.alphaTopLeft = 0.3;

            expect(go._alphaTL).toBeCloseTo(0.3);
        });

        it('should clamp values above 1 to 1', function ()
        {
            go.alphaTopLeft = 2;

            expect(go._alphaTL).toBe(1);
        });

        it('should clamp values below 0 to 0', function ()
        {
            go.alphaTopLeft = -1;

            expect(go._alphaTL).toBe(0);
        });

        it('should set the render flag bit when set to a non-zero value', function ()
        {
            go.renderFlags = 0;
            go.alphaTopLeft = 0.5;

            expect(go.renderFlags & 2).toBe(2);
        });

        it('should not modify the render flag bit when set to 0', function ()
        {
            go.renderFlags = 13; // 0b1101 — bit 1 already clear
            go.alphaTopLeft = 0;

            expect(go.renderFlags & 2).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // alphaTopRight
    // -------------------------------------------------------------------------

    describe('alphaTopRight', function ()
    {
        it('should get the _alphaTR value', function ()
        {
            go._alphaTR = 0.7;

            expect(go.alphaTopRight).toBe(0.7);
        });

        it('should set _alphaTR to the clamped value', function ()
        {
            go.alphaTopRight = 0.6;

            expect(go._alphaTR).toBeCloseTo(0.6);
        });

        it('should clamp values above 1 to 1', function ()
        {
            go.alphaTopRight = 99;

            expect(go._alphaTR).toBe(1);
        });

        it('should clamp values below 0 to 0', function ()
        {
            go.alphaTopRight = -99;

            expect(go._alphaTR).toBe(0);
        });

        it('should set the render flag bit when set to a non-zero value', function ()
        {
            go.renderFlags = 0;
            go.alphaTopRight = 1;

            expect(go.renderFlags & 2).toBe(2);
        });

        it('should not modify the render flag bit when set to 0', function ()
        {
            go.renderFlags = 13;
            go.alphaTopRight = 0;

            expect(go.renderFlags & 2).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // alphaBottomLeft
    // -------------------------------------------------------------------------

    describe('alphaBottomLeft', function ()
    {
        it('should get the _alphaBL value', function ()
        {
            go._alphaBL = 0.2;

            expect(go.alphaBottomLeft).toBe(0.2);
        });

        it('should set _alphaBL to the clamped value', function ()
        {
            go.alphaBottomLeft = 0.25;

            expect(go._alphaBL).toBeCloseTo(0.25);
        });

        it('should clamp values above 1 to 1', function ()
        {
            go.alphaBottomLeft = 10;

            expect(go._alphaBL).toBe(1);
        });

        it('should clamp values below 0 to 0', function ()
        {
            go.alphaBottomLeft = -10;

            expect(go._alphaBL).toBe(0);
        });

        it('should set the render flag bit when set to a non-zero value', function ()
        {
            go.renderFlags = 0;
            go.alphaBottomLeft = 0.8;

            expect(go.renderFlags & 2).toBe(2);
        });

        it('should not modify the render flag bit when set to 0', function ()
        {
            go.renderFlags = 13;
            go.alphaBottomLeft = 0;

            expect(go.renderFlags & 2).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // alphaBottomRight
    // -------------------------------------------------------------------------

    describe('alphaBottomRight', function ()
    {
        it('should get the _alphaBR value', function ()
        {
            go._alphaBR = 0.9;

            expect(go.alphaBottomRight).toBe(0.9);
        });

        it('should set _alphaBR to the clamped value', function ()
        {
            go.alphaBottomRight = 0.55;

            expect(go._alphaBR).toBeCloseTo(0.55);
        });

        it('should clamp values above 1 to 1', function ()
        {
            go.alphaBottomRight = 50;

            expect(go._alphaBR).toBe(1);
        });

        it('should clamp values below 0 to 0', function ()
        {
            go.alphaBottomRight = -50;

            expect(go._alphaBR).toBe(0);
        });

        it('should set the render flag bit when set to a non-zero value', function ()
        {
            go.renderFlags = 0;
            go.alphaBottomRight = 0.1;

            expect(go.renderFlags & 2).toBe(2);
        });

        it('should not modify the render flag bit when set to 0', function ()
        {
            go.renderFlags = 13;
            go.alphaBottomRight = 0;

            expect(go.renderFlags & 2).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // Integration: setAlpha followed by clearAlpha
    // -------------------------------------------------------------------------

    describe('integration', function ()
    {
        it('should fully round-trip: setAlpha then clearAlpha restores to 1', function ()
        {
            go.setAlpha(0);
            go.clearAlpha();

            expect(go.alpha).toBe(1);
            expect(go._alphaTL).toBe(1);
            expect(go._alphaTR).toBe(1);
            expect(go._alphaBL).toBe(1);
            expect(go._alphaBR).toBe(1);
        });

        it('should support method chaining for setAlpha', function ()
        {
            var result = go.setAlpha(0.5).setAlpha(0.8);

            expect(result).toBe(go);
            expect(go.alpha).toBeCloseTo(0.8);
        });

        it('should support method chaining for clearAlpha', function ()
        {
            var result = go.clearAlpha().clearAlpha();

            expect(result).toBe(go);
            expect(go.alpha).toBe(1);
        });

        it('global alpha setter should override individually set corners', function ()
        {
            go.setAlpha(0.1, 0.2, 0.3, 0.4);
            go.alpha = 0.9;

            expect(go._alphaTL).toBeCloseTo(0.9);
            expect(go._alphaTR).toBeCloseTo(0.9);
            expect(go._alphaBL).toBeCloseTo(0.9);
            expect(go._alphaBR).toBeCloseTo(0.9);
        });

        it('should handle boundary values 0 and 1 exactly', function ()
        {
            go.alpha = 0;
            expect(go.alpha).toBe(0);

            go.alpha = 1;
            expect(go.alpha).toBe(1);
        });
    });
});
