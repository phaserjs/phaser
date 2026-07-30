var Friction = require('../../../../src/physics/arcade/components/Friction');

describe('Friction', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = Object.assign({}, Friction);
        gameObject.body = {
            friction: {
                x: 0,
                y: 0,
                set: function (x, y)
                {
                    this.x = x;
                    this.y = (y === undefined) ? x : y;
                }
            }
        };
    });

    describe('setFriction', function ()
    {
        it('should set both x and y friction when both values are provided', function ()
        {
            gameObject.setFriction(0.5, 0.8);

            expect(gameObject.body.friction.x).toBeCloseTo(0.5);
            expect(gameObject.body.friction.y).toBeCloseTo(0.8);
        });

        it('should set y equal to x when y is not provided', function ()
        {
            gameObject.setFriction(0.6);

            expect(gameObject.body.friction.x).toBeCloseTo(0.6);
            expect(gameObject.body.friction.y).toBeCloseTo(0.6);
        });

        it('should return this for chaining', function ()
        {
            var result = gameObject.setFriction(0.5, 0.5);

            expect(result).toBe(gameObject);
        });

        it('should set friction to zero', function ()
        {
            gameObject.setFriction(1, 1);
            gameObject.setFriction(0, 0);

            expect(gameObject.body.friction.x).toBe(0);
            expect(gameObject.body.friction.y).toBe(0);
        });

        it('should set friction to 1', function ()
        {
            gameObject.setFriction(1, 1);

            expect(gameObject.body.friction.x).toBe(1);
            expect(gameObject.body.friction.y).toBe(1);
        });

        it('should set friction with floating point values', function ()
        {
            gameObject.setFriction(0.123, 0.456);

            expect(gameObject.body.friction.x).toBeCloseTo(0.123);
            expect(gameObject.body.friction.y).toBeCloseTo(0.456);
        });
    });

    describe('setFrictionX', function ()
    {
        it('should set horizontal friction', function ()
        {
            gameObject.setFrictionX(0.7);

            expect(gameObject.body.friction.x).toBeCloseTo(0.7);
        });

        it('should not change vertical friction', function ()
        {
            gameObject.body.friction.y = 0.3;
            gameObject.setFrictionX(0.7);

            expect(gameObject.body.friction.y).toBeCloseTo(0.3);
        });

        it('should return this for chaining', function ()
        {
            var result = gameObject.setFrictionX(0.5);

            expect(result).toBe(gameObject);
        });

        it('should set horizontal friction to zero', function ()
        {
            gameObject.setFrictionX(1);
            gameObject.setFrictionX(0);

            expect(gameObject.body.friction.x).toBe(0);
        });

        it('should set horizontal friction to 1', function ()
        {
            gameObject.setFrictionX(1);

            expect(gameObject.body.friction.x).toBe(1);
        });

        it('should set horizontal friction with floating point value', function ()
        {
            gameObject.setFrictionX(0.333);

            expect(gameObject.body.friction.x).toBeCloseTo(0.333);
        });
    });

    describe('setFrictionY', function ()
    {
        it('should set vertical friction', function ()
        {
            gameObject.setFrictionY(0.4);

            expect(gameObject.body.friction.y).toBeCloseTo(0.4);
        });

        it('should not change horizontal friction', function ()
        {
            gameObject.body.friction.x = 0.6;
            gameObject.setFrictionY(0.4);

            expect(gameObject.body.friction.x).toBeCloseTo(0.6);
        });

        it('should return this for chaining', function ()
        {
            var result = gameObject.setFrictionY(0.5);

            expect(result).toBe(gameObject);
        });

        it('should set vertical friction to zero', function ()
        {
            gameObject.setFrictionY(1);
            gameObject.setFrictionY(0);

            expect(gameObject.body.friction.y).toBe(0);
        });

        it('should set vertical friction to 1', function ()
        {
            gameObject.setFrictionY(1);

            expect(gameObject.body.friction.y).toBe(1);
        });

        it('should set vertical friction with floating point value', function ()
        {
            gameObject.setFrictionY(0.777);

            expect(gameObject.body.friction.y).toBeCloseTo(0.777);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining setFriction, setFrictionX, and setFrictionY', function ()
        {
            gameObject.setFriction(0.5, 0.5).setFrictionX(0.2).setFrictionY(0.8);

            expect(gameObject.body.friction.x).toBeCloseTo(0.2);
            expect(gameObject.body.friction.y).toBeCloseTo(0.8);
        });
    });
});
