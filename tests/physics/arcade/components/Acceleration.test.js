var Acceleration = require('../../../../src/physics/arcade/components/Acceleration');

describe('Acceleration', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = Object.assign({}, Acceleration);
        gameObject.body = {
            acceleration: {
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

    describe('setAcceleration', function ()
    {
        it('should set both x and y acceleration', function ()
        {
            gameObject.setAcceleration(100, 200);

            expect(gameObject.body.acceleration.x).toBe(100);
            expect(gameObject.body.acceleration.y).toBe(200);
        });

        it('should set y to x when y is not provided', function ()
        {
            gameObject.setAcceleration(150);

            expect(gameObject.body.acceleration.x).toBe(150);
            expect(gameObject.body.acceleration.y).toBe(150);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setAcceleration(100, 200);

            expect(result).toBe(gameObject);
        });

        it('should accept zero values', function ()
        {
            gameObject.setAcceleration(100, 200);
            gameObject.setAcceleration(0, 0);

            expect(gameObject.body.acceleration.x).toBe(0);
            expect(gameObject.body.acceleration.y).toBe(0);
        });

        it('should accept negative values', function ()
        {
            gameObject.setAcceleration(-100, -200);

            expect(gameObject.body.acceleration.x).toBe(-100);
            expect(gameObject.body.acceleration.y).toBe(-200);
        });

        it('should accept floating point values', function ()
        {
            gameObject.setAcceleration(1.5, 2.7);

            expect(gameObject.body.acceleration.x).toBeCloseTo(1.5);
            expect(gameObject.body.acceleration.y).toBeCloseTo(2.7);
        });
    });

    describe('setAccelerationX', function ()
    {
        it('should set the horizontal acceleration', function ()
        {
            gameObject.setAccelerationX(300);

            expect(gameObject.body.acceleration.x).toBe(300);
        });

        it('should not change the vertical acceleration', function ()
        {
            gameObject.body.acceleration.y = 99;
            gameObject.setAccelerationX(300);

            expect(gameObject.body.acceleration.y).toBe(99);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setAccelerationX(300);

            expect(result).toBe(gameObject);
        });

        it('should accept zero', function ()
        {
            gameObject.setAccelerationX(300);
            gameObject.setAccelerationX(0);

            expect(gameObject.body.acceleration.x).toBe(0);
        });

        it('should accept negative values', function ()
        {
            gameObject.setAccelerationX(-500);

            expect(gameObject.body.acceleration.x).toBe(-500);
        });

        it('should accept floating point values', function ()
        {
            gameObject.setAccelerationX(3.14);

            expect(gameObject.body.acceleration.x).toBeCloseTo(3.14);
        });
    });

    describe('setAccelerationY', function ()
    {
        it('should set the vertical acceleration', function ()
        {
            gameObject.setAccelerationY(400);

            expect(gameObject.body.acceleration.y).toBe(400);
        });

        it('should not change the horizontal acceleration', function ()
        {
            gameObject.body.acceleration.x = 88;
            gameObject.setAccelerationY(400);

            expect(gameObject.body.acceleration.x).toBe(88);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setAccelerationY(400);

            expect(result).toBe(gameObject);
        });

        it('should accept zero', function ()
        {
            gameObject.setAccelerationY(400);
            gameObject.setAccelerationY(0);

            expect(gameObject.body.acceleration.y).toBe(0);
        });

        it('should accept negative values', function ()
        {
            gameObject.setAccelerationY(-600);

            expect(gameObject.body.acceleration.y).toBe(-600);
        });

        it('should accept floating point values', function ()
        {
            gameObject.setAccelerationY(9.81);

            expect(gameObject.body.acceleration.y).toBeCloseTo(9.81);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining setAccelerationX and setAccelerationY', function ()
        {
            gameObject.setAccelerationX(100).setAccelerationY(200);

            expect(gameObject.body.acceleration.x).toBe(100);
            expect(gameObject.body.acceleration.y).toBe(200);
        });

        it('should support chaining setAcceleration multiple times', function ()
        {
            gameObject.setAcceleration(100, 200).setAcceleration(300, 400);

            expect(gameObject.body.acceleration.x).toBe(300);
            expect(gameObject.body.acceleration.y).toBe(400);
        });
    });
});
