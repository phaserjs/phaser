var Gravity = require('../../../../src/physics/arcade/components/Gravity');

describe('Gravity', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = Object.assign({}, Gravity);
        gameObject.body = {
            gravity: {
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

    describe('setGravity', function ()
    {
        it('should set both x and y gravity when two values are provided', function ()
        {
            gameObject.setGravity(100, 200);

            expect(gameObject.body.gravity.x).toBe(100);
            expect(gameObject.body.gravity.y).toBe(200);
        });

        it('should use x value for both axes when only one value is provided', function ()
        {
            gameObject.setGravity(150);

            expect(gameObject.body.gravity.x).toBe(150);
            expect(gameObject.body.gravity.y).toBe(150);
        });

        it('should return this for chaining', function ()
        {
            var result = gameObject.setGravity(100, 200);

            expect(result).toBe(gameObject);
        });

        it('should accept negative values', function ()
        {
            gameObject.setGravity(-300, -400);

            expect(gameObject.body.gravity.x).toBe(-300);
            expect(gameObject.body.gravity.y).toBe(-400);
        });

        it('should accept zero values', function ()
        {
            gameObject.setGravity(100, 200);
            gameObject.setGravity(0, 0);

            expect(gameObject.body.gravity.x).toBe(0);
            expect(gameObject.body.gravity.y).toBe(0);
        });

        it('should accept floating point values', function ()
        {
            gameObject.setGravity(9.81, 3.14);

            expect(gameObject.body.gravity.x).toBeCloseTo(9.81);
            expect(gameObject.body.gravity.y).toBeCloseTo(3.14);
        });

        it('should accept mixed positive and negative values', function ()
        {
            gameObject.setGravity(100, -200);

            expect(gameObject.body.gravity.x).toBe(100);
            expect(gameObject.body.gravity.y).toBe(-200);
        });
    });

    describe('setGravityX', function ()
    {
        it('should set the x gravity', function ()
        {
            gameObject.setGravityX(500);

            expect(gameObject.body.gravity.x).toBe(500);
        });

        it('should not affect the y gravity', function ()
        {
            gameObject.body.gravity.y = 300;
            gameObject.setGravityX(500);

            expect(gameObject.body.gravity.y).toBe(300);
        });

        it('should return this for chaining', function ()
        {
            var result = gameObject.setGravityX(500);

            expect(result).toBe(gameObject);
        });

        it('should accept negative values', function ()
        {
            gameObject.setGravityX(-250);

            expect(gameObject.body.gravity.x).toBe(-250);
        });

        it('should accept zero', function ()
        {
            gameObject.setGravityX(500);
            gameObject.setGravityX(0);

            expect(gameObject.body.gravity.x).toBe(0);
        });

        it('should accept floating point values', function ()
        {
            gameObject.setGravityX(1.5);

            expect(gameObject.body.gravity.x).toBeCloseTo(1.5);
        });
    });

    describe('setGravityY', function ()
    {
        it('should set the y gravity', function ()
        {
            gameObject.setGravityY(980);

            expect(gameObject.body.gravity.y).toBe(980);
        });

        it('should not affect the x gravity', function ()
        {
            gameObject.body.gravity.x = 100;
            gameObject.setGravityY(980);

            expect(gameObject.body.gravity.x).toBe(100);
        });

        it('should return this for chaining', function ()
        {
            var result = gameObject.setGravityY(980);

            expect(result).toBe(gameObject);
        });

        it('should accept negative values to push against gravity', function ()
        {
            gameObject.setGravityY(-980);

            expect(gameObject.body.gravity.y).toBe(-980);
        });

        it('should accept zero', function ()
        {
            gameObject.setGravityY(980);
            gameObject.setGravityY(0);

            expect(gameObject.body.gravity.y).toBe(0);
        });

        it('should accept floating point values', function ()
        {
            gameObject.setGravityY(2.5);

            expect(gameObject.body.gravity.y).toBeCloseTo(2.5);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining setGravityX and setGravityY', function ()
        {
            gameObject.setGravityX(100).setGravityY(200);

            expect(gameObject.body.gravity.x).toBe(100);
            expect(gameObject.body.gravity.y).toBe(200);
        });

        it('should support chaining setGravity multiple times', function ()
        {
            gameObject.setGravity(100, 200).setGravity(300, 400);

            expect(gameObject.body.gravity.x).toBe(300);
            expect(gameObject.body.gravity.y).toBe(400);
        });

        it('should support chaining all three methods', function ()
        {
            gameObject.setGravity(100, 100).setGravityX(50).setGravityY(-50);

            expect(gameObject.body.gravity.x).toBe(50);
            expect(gameObject.body.gravity.y).toBe(-50);
        });
    });
});
