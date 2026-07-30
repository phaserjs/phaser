var Immovable = require('../../../../src/physics/arcade/components/Immovable');

describe('Immovable', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            body: {
                immovable: false
            }
        };

        Object.assign(gameObject, Immovable);
    });

    it('should set immovable to true by default when no argument is provided', function ()
    {
        gameObject.setImmovable();

        expect(gameObject.body.immovable).toBe(true);
    });

    it('should set immovable to true when passed true', function ()
    {
        gameObject.setImmovable(true);

        expect(gameObject.body.immovable).toBe(true);
    });

    it('should set immovable to false when passed false', function ()
    {
        gameObject.body.immovable = true;

        gameObject.setImmovable(false);

        expect(gameObject.body.immovable).toBe(false);
    });

    it('should return the game object for chaining', function ()
    {
        var result = gameObject.setImmovable();

        expect(result).toBe(gameObject);
    });

    it('should return the game object when passed true', function ()
    {
        var result = gameObject.setImmovable(true);

        expect(result).toBe(gameObject);
    });

    it('should return the game object when passed false', function ()
    {
        var result = gameObject.setImmovable(false);

        expect(result).toBe(gameObject);
    });

    it('should allow chaining multiple calls', function ()
    {
        gameObject.setImmovable(true).setImmovable(false);

        expect(gameObject.body.immovable).toBe(false);
    });

    it('should update an already immovable body to movable', function ()
    {
        gameObject.body.immovable = true;

        gameObject.setImmovable(false);

        expect(gameObject.body.immovable).toBe(false);
    });
});
