var Mass = require('../../../../src/physics/arcade/components/Mass');

describe('Mass', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            body: { mass: 1 }
        };

        Object.assign(gameObject, Mass);
    });

    it('should set the mass on the body', function ()
    {
        gameObject.setMass(5);

        expect(gameObject.body.mass).toBe(5);
    });

    it('should return the game object for chaining', function ()
    {
        var result = gameObject.setMass(10);

        expect(result).toBe(gameObject);
    });

    it('should set mass to a floating point value', function ()
    {
        gameObject.setMass(2.5);

        expect(gameObject.body.mass).toBeCloseTo(2.5);
    });

    it('should set mass to a large value', function ()
    {
        gameObject.setMass(999999);

        expect(gameObject.body.mass).toBe(999999);
    });

    it('should set mass to zero', function ()
    {
        gameObject.setMass(0);

        expect(gameObject.body.mass).toBe(0);
    });

    it('should set mass to a negative value', function ()
    {
        gameObject.setMass(-1);

        expect(gameObject.body.mass).toBe(-1);
    });

    it('should overwrite a previously set mass', function ()
    {
        gameObject.setMass(10);
        gameObject.setMass(20);

        expect(gameObject.body.mass).toBe(20);
    });

    it('should support method chaining across multiple calls', function ()
    {
        var result = gameObject.setMass(3).setMass(7);

        expect(result).toBe(gameObject);
        expect(gameObject.body.mass).toBe(7);
    });
});
