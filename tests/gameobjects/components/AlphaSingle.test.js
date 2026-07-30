var AlphaSingle = require('../../../src/gameobjects/components/AlphaSingle');

describe('AlphaSingle', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            renderFlags: 15,
            _alpha: AlphaSingle._alpha
        };

        gameObject.clearAlpha = AlphaSingle.clearAlpha.bind(gameObject);
        gameObject.setAlpha = AlphaSingle.setAlpha.bind(gameObject);

        Object.defineProperty(gameObject, 'alpha', {
            get: AlphaSingle.alpha.get.bind(gameObject),
            set: AlphaSingle.alpha.set.bind(gameObject),
            configurable: true
        });
    });

    describe('default values', function ()
    {
        it('should have a default _alpha of 1', function ()
        {
            expect(AlphaSingle._alpha).toBe(1);
        });
    });

    describe('clearAlpha', function ()
    {
        it('should reset alpha to 1', function ()
        {
            gameObject.alpha = 0.5;
            gameObject.clearAlpha();
            expect(gameObject.alpha).toBe(1);
        });

        it('should return the game object instance', function ()
        {
            var result = gameObject.clearAlpha();
            expect(result).toBe(gameObject);
        });

        it('should restore renderFlags when alpha was 0', function ()
        {
            gameObject.alpha = 0;
            gameObject.clearAlpha();
            expect(gameObject.renderFlags & 2).toBe(2);
        });
    });

    describe('setAlpha', function ()
    {
        it('should set alpha to the given value', function ()
        {
            gameObject.setAlpha(0.5);
            expect(gameObject.alpha).toBe(0.5);
        });

        it('should default to 1 when no value is provided', function ()
        {
            gameObject.alpha = 0.3;
            gameObject.setAlpha();
            expect(gameObject.alpha).toBe(1);
        });

        it('should return the game object instance', function ()
        {
            var result = gameObject.setAlpha(0.5);
            expect(result).toBe(gameObject);
        });

        it('should clamp values above 1 to 1', function ()
        {
            gameObject.setAlpha(2);
            expect(gameObject.alpha).toBe(1);
        });

        it('should clamp negative values to 0', function ()
        {
            gameObject.setAlpha(-1);
            expect(gameObject.alpha).toBe(0);
        });

        it('should accept 0 as a valid value', function ()
        {
            gameObject.setAlpha(0);
            expect(gameObject.alpha).toBe(0);
        });

        it('should accept 1 as a valid value', function ()
        {
            gameObject.setAlpha(1);
            expect(gameObject.alpha).toBe(1);
        });
    });

    describe('alpha getter', function ()
    {
        it('should return the current alpha value', function ()
        {
            gameObject._alpha = 0.75;
            expect(gameObject.alpha).toBe(0.75);
        });

        it('should return 1 by default', function ()
        {
            expect(gameObject.alpha).toBe(1);
        });
    });

    describe('alpha setter', function ()
    {
        it('should set _alpha to the clamped value', function ()
        {
            gameObject.alpha = 0.5;
            expect(gameObject._alpha).toBe(0.5);
        });

        it('should clamp values above 1', function ()
        {
            gameObject.alpha = 1.5;
            expect(gameObject._alpha).toBe(1);
        });

        it('should clamp values below 0', function ()
        {
            gameObject.alpha = -0.5;
            expect(gameObject._alpha).toBe(0);
        });

        it('should clear the render flag (bit 2) when alpha is set to 0', function ()
        {
            gameObject.renderFlags = 15;
            gameObject.alpha = 0;
            expect(gameObject.renderFlags & 2).toBe(0);
        });

        it('should set the render flag (bit 2) when alpha is above 0', function ()
        {
            gameObject.renderFlags = 0;
            gameObject.alpha = 0.5;
            expect(gameObject.renderFlags & 2).toBe(2);
        });

        it('should set the render flag (bit 2) when alpha is 1', function ()
        {
            gameObject.renderFlags = 0;
            gameObject.alpha = 1;
            expect(gameObject.renderFlags & 2).toBe(2);
        });

        it('should not affect other render flag bits when clearing bit 2', function ()
        {
            gameObject.renderFlags = 15;
            gameObject.alpha = 0;
            expect(gameObject.renderFlags & ~2).toBe(13);
        });

        it('should not affect other render flag bits when setting bit 2', function ()
        {
            gameObject.renderFlags = 13;
            gameObject.alpha = 0.5;
            expect(gameObject.renderFlags).toBe(15);
        });

        it('should accept floating point values', function ()
        {
            gameObject.alpha = 0.123;
            expect(gameObject._alpha).toBeCloseTo(0.123);
        });

        it('should handle boundary value of exactly 0', function ()
        {
            gameObject.alpha = 0;
            expect(gameObject._alpha).toBe(0);
            expect(gameObject.renderFlags & 2).toBe(0);
        });

        it('should handle boundary value of exactly 1', function ()
        {
            gameObject.alpha = 1;
            expect(gameObject._alpha).toBe(1);
            expect(gameObject.renderFlags & 2).toBe(2);
        });
    });
});
