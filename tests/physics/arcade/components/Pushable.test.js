var Pushable = require('../../../../src/physics/arcade/components/Pushable');

describe('Pushable', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            body: {
                pushable: true
            }
        };

        Object.assign(gameObject, Pushable);
    });

    describe('setPushable', function ()
    {
        it('should set pushable to true when called with true', function ()
        {
            gameObject.body.pushable = false;
            gameObject.setPushable(true);
            expect(gameObject.body.pushable).toBe(true);
        });

        it('should set pushable to false when called with false', function ()
        {
            gameObject.setPushable(false);
            expect(gameObject.body.pushable).toBe(false);
        });

        it('should default to true when called with no arguments', function ()
        {
            gameObject.body.pushable = false;
            gameObject.setPushable();
            expect(gameObject.body.pushable).toBe(true);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setPushable(true);
            expect(result).toBe(gameObject);
        });

        it('should return this when called with false', function ()
        {
            var result = gameObject.setPushable(false);
            expect(result).toBe(gameObject);
        });

        it('should return this when called with no arguments', function ()
        {
            var result = gameObject.setPushable();
            expect(result).toBe(gameObject);
        });

        it('should allow chaining multiple calls', function ()
        {
            gameObject.setPushable(false).setPushable(true);
            expect(gameObject.body.pushable).toBe(true);
        });

        it('should set pushable to false then true via chaining', function ()
        {
            gameObject.setPushable(true).setPushable(false);
            expect(gameObject.body.pushable).toBe(false);
        });
    });
});
