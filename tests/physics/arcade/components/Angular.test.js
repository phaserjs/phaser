var Angular = require('../../../../src/physics/arcade/components/Angular');

describe('Angular', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = Object.assign({}, Angular);
        gameObject.body = {
            angularVelocity: 0,
            angularAcceleration: 0,
            angularDrag: 0
        };
    });

    describe('setAngularVelocity', function ()
    {
        it('should set angularVelocity on the body', function ()
        {
            gameObject.setAngularVelocity(100);

            expect(gameObject.body.angularVelocity).toBe(100);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setAngularVelocity(100);

            expect(result).toBe(gameObject);
        });

        it('should set angularVelocity to zero', function ()
        {
            gameObject.body.angularVelocity = 200;
            gameObject.setAngularVelocity(0);

            expect(gameObject.body.angularVelocity).toBe(0);
        });

        it('should set negative angularVelocity', function ()
        {
            gameObject.setAngularVelocity(-90);

            expect(gameObject.body.angularVelocity).toBe(-90);
        });

        it('should set floating point angularVelocity', function ()
        {
            gameObject.setAngularVelocity(45.5);

            expect(gameObject.body.angularVelocity).toBeCloseTo(45.5);
        });

        it('should overwrite a previous angularVelocity value', function ()
        {
            gameObject.setAngularVelocity(100);
            gameObject.setAngularVelocity(200);

            expect(gameObject.body.angularVelocity).toBe(200);
        });
    });

    describe('setAngularAcceleration', function ()
    {
        it('should set angularAcceleration on the body', function ()
        {
            gameObject.setAngularAcceleration(50);

            expect(gameObject.body.angularAcceleration).toBe(50);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setAngularAcceleration(50);

            expect(result).toBe(gameObject);
        });

        it('should set angularAcceleration to zero', function ()
        {
            gameObject.body.angularAcceleration = 100;
            gameObject.setAngularAcceleration(0);

            expect(gameObject.body.angularAcceleration).toBe(0);
        });

        it('should set negative angularAcceleration', function ()
        {
            gameObject.setAngularAcceleration(-30);

            expect(gameObject.body.angularAcceleration).toBe(-30);
        });

        it('should set floating point angularAcceleration', function ()
        {
            gameObject.setAngularAcceleration(12.75);

            expect(gameObject.body.angularAcceleration).toBeCloseTo(12.75);
        });

        it('should overwrite a previous angularAcceleration value', function ()
        {
            gameObject.setAngularAcceleration(50);
            gameObject.setAngularAcceleration(75);

            expect(gameObject.body.angularAcceleration).toBe(75);
        });
    });

    describe('setAngularDrag', function ()
    {
        it('should set angularDrag on the body', function ()
        {
            gameObject.setAngularDrag(10);

            expect(gameObject.body.angularDrag).toBe(10);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setAngularDrag(10);

            expect(result).toBe(gameObject);
        });

        it('should set angularDrag to zero', function ()
        {
            gameObject.body.angularDrag = 50;
            gameObject.setAngularDrag(0);

            expect(gameObject.body.angularDrag).toBe(0);
        });

        it('should set negative angularDrag', function ()
        {
            gameObject.setAngularDrag(-5);

            expect(gameObject.body.angularDrag).toBe(-5);
        });

        it('should set floating point angularDrag', function ()
        {
            gameObject.setAngularDrag(3.14);

            expect(gameObject.body.angularDrag).toBeCloseTo(3.14);
        });

        it('should overwrite a previous angularDrag value', function ()
        {
            gameObject.setAngularDrag(10);
            gameObject.setAngularDrag(20);

            expect(gameObject.body.angularDrag).toBe(20);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining all three methods', function ()
        {
            var result = gameObject
                .setAngularVelocity(100)
                .setAngularAcceleration(50)
                .setAngularDrag(10);

            expect(result).toBe(gameObject);
            expect(gameObject.body.angularVelocity).toBe(100);
            expect(gameObject.body.angularAcceleration).toBe(50);
            expect(gameObject.body.angularDrag).toBe(10);
        });
    });
});
