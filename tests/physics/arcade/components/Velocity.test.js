var Velocity = require('../../../../src/physics/arcade/components/Velocity');

describe('Velocity', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            body: {
                setVelocity: vi.fn(),
                setVelocityX: vi.fn(),
                setVelocityY: vi.fn(),
                maxVelocity: {
                    set: vi.fn()
                }
            }
        };

        Object.assign(gameObject, Velocity);
    });

    describe('setVelocity', function ()
    {
        it('should call body.setVelocity with x and y values', function ()
        {
            gameObject.setVelocity(100, 200);

            expect(gameObject.body.setVelocity).toHaveBeenCalledWith(100, 200);
        });

        it('should call body.setVelocity with only x when y is omitted', function ()
        {
            gameObject.setVelocity(150);

            expect(gameObject.body.setVelocity).toHaveBeenCalledWith(150, undefined);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setVelocity(100, 100);

            expect(result).toBe(gameObject);
        });

        it('should pass zero values correctly', function ()
        {
            gameObject.setVelocity(0, 0);

            expect(gameObject.body.setVelocity).toHaveBeenCalledWith(0, 0);
        });

        it('should pass negative values correctly', function ()
        {
            gameObject.setVelocity(-100, -200);

            expect(gameObject.body.setVelocity).toHaveBeenCalledWith(-100, -200);
        });

        it('should pass floating point values correctly', function ()
        {
            gameObject.setVelocity(1.5, 2.7);

            expect(gameObject.body.setVelocity).toHaveBeenCalledWith(1.5, 2.7);
        });
    });

    describe('setVelocityX', function ()
    {
        it('should call body.setVelocityX with the given value', function ()
        {
            gameObject.setVelocityX(100);

            expect(gameObject.body.setVelocityX).toHaveBeenCalledWith(100);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setVelocityX(100);

            expect(result).toBe(gameObject);
        });

        it('should pass zero correctly', function ()
        {
            gameObject.setVelocityX(0);

            expect(gameObject.body.setVelocityX).toHaveBeenCalledWith(0);
        });

        it('should pass negative values correctly', function ()
        {
            gameObject.setVelocityX(-300);

            expect(gameObject.body.setVelocityX).toHaveBeenCalledWith(-300);
        });

        it('should pass floating point values correctly', function ()
        {
            gameObject.setVelocityX(3.14);

            expect(gameObject.body.setVelocityX).toHaveBeenCalledWith(3.14);
        });
    });

    describe('setVelocityY', function ()
    {
        it('should call body.setVelocityY with the given value', function ()
        {
            gameObject.setVelocityY(200);

            expect(gameObject.body.setVelocityY).toHaveBeenCalledWith(200);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setVelocityY(200);

            expect(result).toBe(gameObject);
        });

        it('should pass zero correctly', function ()
        {
            gameObject.setVelocityY(0);

            expect(gameObject.body.setVelocityY).toHaveBeenCalledWith(0);
        });

        it('should pass negative values correctly', function ()
        {
            gameObject.setVelocityY(-150);

            expect(gameObject.body.setVelocityY).toHaveBeenCalledWith(-150);
        });

        it('should pass floating point values correctly', function ()
        {
            gameObject.setVelocityY(9.81);

            expect(gameObject.body.setVelocityY).toHaveBeenCalledWith(9.81);
        });
    });

    describe('setMaxVelocity', function ()
    {
        it('should call body.maxVelocity.set with x and y values', function ()
        {
            gameObject.setMaxVelocity(500, 400);

            expect(gameObject.body.maxVelocity.set).toHaveBeenCalledWith(500, 400);
        });

        it('should call body.maxVelocity.set with only x when y is omitted', function ()
        {
            gameObject.setMaxVelocity(300);

            expect(gameObject.body.maxVelocity.set).toHaveBeenCalledWith(300, undefined);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setMaxVelocity(500, 500);

            expect(result).toBe(gameObject);
        });

        it('should pass zero values correctly', function ()
        {
            gameObject.setMaxVelocity(0, 0);

            expect(gameObject.body.maxVelocity.set).toHaveBeenCalledWith(0, 0);
        });

        it('should pass large values correctly', function ()
        {
            gameObject.setMaxVelocity(10000, 10000);

            expect(gameObject.body.maxVelocity.set).toHaveBeenCalledWith(10000, 10000);
        });

        it('should pass floating point values correctly', function ()
        {
            gameObject.setMaxVelocity(100.5, 200.75);

            expect(gameObject.body.maxVelocity.set).toHaveBeenCalledWith(100.5, 200.75);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining setVelocity, setVelocityX, and setVelocityY', function ()
        {
            var result = gameObject
                .setVelocity(100, 100)
                .setVelocityX(200)
                .setVelocityY(300);

            expect(result).toBe(gameObject);
            expect(gameObject.body.setVelocity).toHaveBeenCalledWith(100, 100);
            expect(gameObject.body.setVelocityX).toHaveBeenCalledWith(200);
            expect(gameObject.body.setVelocityY).toHaveBeenCalledWith(300);
        });

        it('should support chaining setMaxVelocity with setVelocity', function ()
        {
            var result = gameObject
                .setMaxVelocity(500, 500)
                .setVelocity(100, 100);

            expect(result).toBe(gameObject);
            expect(gameObject.body.maxVelocity.set).toHaveBeenCalledWith(500, 500);
            expect(gameObject.body.setVelocity).toHaveBeenCalledWith(100, 100);
        });
    });
});
