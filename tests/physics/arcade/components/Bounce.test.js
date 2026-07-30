var Bounce = require('../../../../src/physics/arcade/components/Bounce');

describe('Bounce', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = Object.assign({}, Bounce);
        gameObject.body = {
            bounce: { x: 0, y: 0, set: function (x, y) { this.x = x; this.y = (y === undefined) ? x : y; } },
            worldBounce: null,
            setCollideWorldBounds: function (value, bounceX, bounceY, onWorldBounds)
            {
                this.collideWorldBounds = (value === undefined) ? true : value;
                if (bounceX !== undefined)
                {
                    if (!this.worldBounce) { this.worldBounce = { x: 0, y: 0 }; }
                    this.worldBounce.x = bounceX;
                }
                if (bounceY !== undefined)
                {
                    if (!this.worldBounce) { this.worldBounce = { x: 0, y: 0 }; }
                    this.worldBounce.y = bounceY;
                }
                if (onWorldBounds !== undefined) { this.onWorldBounds = onWorldBounds; }
            },
            collideWorldBounds: false,
            onWorldBounds: false
        };
    });

    describe('setBounce', function ()
    {
        it('should set both x and y bounce values', function ()
        {
            gameObject.setBounce(0.5, 0.8);

            expect(gameObject.body.bounce.x).toBeCloseTo(0.5);
            expect(gameObject.body.bounce.y).toBeCloseTo(0.8);
        });

        it('should set y to x when y is omitted', function ()
        {
            gameObject.setBounce(0.7);

            expect(gameObject.body.bounce.x).toBeCloseTo(0.7);
            expect(gameObject.body.bounce.y).toBeCloseTo(0.7);
        });

        it('should set bounce to zero', function ()
        {
            gameObject.setBounce(0, 0);

            expect(gameObject.body.bounce.x).toBe(0);
            expect(gameObject.body.bounce.y).toBe(0);
        });

        it('should set bounce to one for full restitution', function ()
        {
            gameObject.setBounce(1, 1);

            expect(gameObject.body.bounce.x).toBe(1);
            expect(gameObject.body.bounce.y).toBe(1);
        });

        it('should accept values greater than one', function ()
        {
            gameObject.setBounce(2, 3);

            expect(gameObject.body.bounce.x).toBe(2);
            expect(gameObject.body.bounce.y).toBe(3);
        });

        it('should accept floating point values', function ()
        {
            gameObject.setBounce(0.123, 0.456);

            expect(gameObject.body.bounce.x).toBeCloseTo(0.123);
            expect(gameObject.body.bounce.y).toBeCloseTo(0.456);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setBounce(0.5, 0.5);

            expect(result).toBe(gameObject);
        });
    });

    describe('setBounceX', function ()
    {
        it('should set the horizontal bounce value', function ()
        {
            gameObject.setBounceX(0.6);

            expect(gameObject.body.bounce.x).toBeCloseTo(0.6);
        });

        it('should not affect the vertical bounce value', function ()
        {
            gameObject.body.bounce.y = 0.9;
            gameObject.setBounceX(0.3);

            expect(gameObject.body.bounce.y).toBeCloseTo(0.9);
        });

        it('should set horizontal bounce to zero', function ()
        {
            gameObject.body.bounce.x = 0.5;
            gameObject.setBounceX(0);

            expect(gameObject.body.bounce.x).toBe(0);
        });

        it('should set horizontal bounce to one', function ()
        {
            gameObject.setBounceX(1);

            expect(gameObject.body.bounce.x).toBe(1);
        });

        it('should accept floating point values', function ()
        {
            gameObject.setBounceX(0.333);

            expect(gameObject.body.bounce.x).toBeCloseTo(0.333);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setBounceX(0.5);

            expect(result).toBe(gameObject);
        });
    });

    describe('setBounceY', function ()
    {
        it('should set the vertical bounce value', function ()
        {
            gameObject.setBounceY(0.4);

            expect(gameObject.body.bounce.y).toBeCloseTo(0.4);
        });

        it('should not affect the horizontal bounce value', function ()
        {
            gameObject.body.bounce.x = 0.7;
            gameObject.setBounceY(0.2);

            expect(gameObject.body.bounce.x).toBeCloseTo(0.7);
        });

        it('should set vertical bounce to zero', function ()
        {
            gameObject.body.bounce.y = 0.5;
            gameObject.setBounceY(0);

            expect(gameObject.body.bounce.y).toBe(0);
        });

        it('should set vertical bounce to one', function ()
        {
            gameObject.setBounceY(1);

            expect(gameObject.body.bounce.y).toBe(1);
        });

        it('should accept floating point values', function ()
        {
            gameObject.setBounceY(0.777);

            expect(gameObject.body.bounce.y).toBeCloseTo(0.777);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setBounceY(0.5);

            expect(result).toBe(gameObject);
        });
    });

    describe('setCollideWorldBounds', function ()
    {
        it('should enable world bounds collision when passed true', function ()
        {
            gameObject.setCollideWorldBounds(true);

            expect(gameObject.body.collideWorldBounds).toBe(true);
        });

        it('should disable world bounds collision when passed false', function ()
        {
            gameObject.body.collideWorldBounds = true;
            gameObject.setCollideWorldBounds(false);

            expect(gameObject.body.collideWorldBounds).toBe(false);
        });

        it('should set worldBounce x when bounceX is provided', function ()
        {
            gameObject.setCollideWorldBounds(true, 0.5);

            expect(gameObject.body.worldBounce).not.toBeNull();
            expect(gameObject.body.worldBounce.x).toBeCloseTo(0.5);
        });

        it('should set worldBounce y when bounceY is provided', function ()
        {
            gameObject.setCollideWorldBounds(true, 0.5, 0.8);

            expect(gameObject.body.worldBounce).not.toBeNull();
            expect(gameObject.body.worldBounce.y).toBeCloseTo(0.8);
        });

        it('should set both worldBounce x and y when both are provided', function ()
        {
            gameObject.setCollideWorldBounds(true, 0.3, 0.6);

            expect(gameObject.body.worldBounce.x).toBeCloseTo(0.3);
            expect(gameObject.body.worldBounce.y).toBeCloseTo(0.6);
        });

        it('should set onWorldBounds when the fourth parameter is provided', function ()
        {
            gameObject.setCollideWorldBounds(true, undefined, undefined, true);

            expect(gameObject.body.onWorldBounds).toBe(true);
        });

        it('should not modify onWorldBounds when the fourth parameter is omitted', function ()
        {
            gameObject.body.onWorldBounds = false;
            gameObject.setCollideWorldBounds(true);

            expect(gameObject.body.onWorldBounds).toBe(false);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setCollideWorldBounds(true);

            expect(result).toBe(gameObject);
        });

        it('should support method chaining across multiple calls', function ()
        {
            var result = gameObject.setBounce(0.5).setBounceX(0.3).setBounceY(0.7).setCollideWorldBounds(true);

            expect(result).toBe(gameObject);
            expect(gameObject.body.bounce.x).toBeCloseTo(0.3);
            expect(gameObject.body.bounce.y).toBeCloseTo(0.7);
            expect(gameObject.body.collideWorldBounds).toBe(true);
        });
    });
});
