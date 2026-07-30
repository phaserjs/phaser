var Debug = require('../../../../src/physics/arcade/components/Debug');

function createGameObject ()
{
    var body = {
        debugShowBody: false,
        debugShowVelocity: false,
        debugBodyColor: 0xff00ff
    };

    var obj = Object.defineProperties(
        { body: body },
        {
            debugShowBody: { get: Debug.debugShowBody.get, set: Debug.debugShowBody.set, enumerable: true, configurable: true },
            debugShowVelocity: { get: Debug.debugShowVelocity.get, set: Debug.debugShowVelocity.set, enumerable: true, configurable: true },
            debugBodyColor: { get: Debug.debugBodyColor.get, set: Debug.debugBodyColor.set, enumerable: true, configurable: true }
        }
    );

    obj.setDebug = Debug.setDebug;
    obj.setDebugBodyColor = Debug.setDebugBodyColor;

    return obj;
}

describe('Debug', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = createGameObject();
    });

    describe('setDebug', function ()
    {
        it('should set debugShowBody on the body', function ()
        {
            gameObject.setDebug(true, false, 0xff0000);
            expect(gameObject.body.debugShowBody).toBe(true);
        });

        it('should set debugShowVelocity on the body', function ()
        {
            gameObject.setDebug(false, true, 0xff0000);
            expect(gameObject.body.debugShowVelocity).toBe(true);
        });

        it('should set debugBodyColor on the body', function ()
        {
            gameObject.setDebug(false, false, 0x00ff00);
            expect(gameObject.body.debugBodyColor).toBe(0x00ff00);
        });

        it('should set all three values at once', function ()
        {
            gameObject.setDebug(true, true, 0xffffff);
            expect(gameObject.body.debugShowBody).toBe(true);
            expect(gameObject.body.debugShowVelocity).toBe(true);
            expect(gameObject.body.debugBodyColor).toBe(0xffffff);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setDebug(true, true, 0xff0000);
            expect(result).toBe(gameObject);
        });

        it('should set false values correctly', function ()
        {
            gameObject.body.debugShowBody = true;
            gameObject.body.debugShowVelocity = true;
            gameObject.setDebug(false, false, 0x000000);
            expect(gameObject.body.debugShowBody).toBe(false);
            expect(gameObject.body.debugShowVelocity).toBe(false);
            expect(gameObject.body.debugBodyColor).toBe(0x000000);
        });
    });

    describe('setDebugBodyColor', function ()
    {
        it('should set debugBodyColor on the body', function ()
        {
            gameObject.setDebugBodyColor(0x00ffff);
            expect(gameObject.body.debugBodyColor).toBe(0x00ffff);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setDebugBodyColor(0xff0000);
            expect(result).toBe(gameObject);
        });

        it('should overwrite a previously set color', function ()
        {
            gameObject.setDebugBodyColor(0xff0000);
            gameObject.setDebugBodyColor(0x0000ff);
            expect(gameObject.body.debugBodyColor).toBe(0x0000ff);
        });

        it('should accept zero as a color value', function ()
        {
            gameObject.setDebugBodyColor(0x000000);
            expect(gameObject.body.debugBodyColor).toBe(0x000000);
        });

        it('should accept the maximum color value', function ()
        {
            gameObject.setDebugBodyColor(0xffffff);
            expect(gameObject.body.debugBodyColor).toBe(0xffffff);
        });
    });

    describe('debugShowBody getter', function ()
    {
        it('should return the body debugShowBody value', function ()
        {
            gameObject.body.debugShowBody = true;
            expect(gameObject.debugShowBody).toBe(true);
        });

        it('should reflect false when body value is false', function ()
        {
            gameObject.body.debugShowBody = false;
            expect(gameObject.debugShowBody).toBe(false);
        });
    });

    describe('debugShowBody setter', function ()
    {
        it('should set the body debugShowBody value to true', function ()
        {
            gameObject.debugShowBody = true;
            expect(gameObject.body.debugShowBody).toBe(true);
        });

        it('should set the body debugShowBody value to false', function ()
        {
            gameObject.body.debugShowBody = true;
            gameObject.debugShowBody = false;
            expect(gameObject.body.debugShowBody).toBe(false);
        });
    });

    describe('debugShowVelocity getter', function ()
    {
        it('should return the body debugShowVelocity value', function ()
        {
            gameObject.body.debugShowVelocity = true;
            expect(gameObject.debugShowVelocity).toBe(true);
        });

        it('should reflect false when body value is false', function ()
        {
            gameObject.body.debugShowVelocity = false;
            expect(gameObject.debugShowVelocity).toBe(false);
        });
    });

    describe('debugShowVelocity setter', function ()
    {
        it('should set the body debugShowVelocity value to true', function ()
        {
            gameObject.debugShowVelocity = true;
            expect(gameObject.body.debugShowVelocity).toBe(true);
        });

        it('should set the body debugShowVelocity value to false', function ()
        {
            gameObject.body.debugShowVelocity = true;
            gameObject.debugShowVelocity = false;
            expect(gameObject.body.debugShowVelocity).toBe(false);
        });
    });

    describe('debugBodyColor getter', function ()
    {
        it('should return the body debugBodyColor value', function ()
        {
            gameObject.body.debugBodyColor = 0xff0000;
            expect(gameObject.debugBodyColor).toBe(0xff0000);
        });

        it('should reflect changes made directly to the body', function ()
        {
            gameObject.body.debugBodyColor = 0x123456;
            expect(gameObject.debugBodyColor).toBe(0x123456);
        });
    });

    describe('debugBodyColor setter', function ()
    {
        it('should set the body debugBodyColor value', function ()
        {
            gameObject.debugBodyColor = 0xaabbcc;
            expect(gameObject.body.debugBodyColor).toBe(0xaabbcc);
        });

        it('should overwrite the previous body color', function ()
        {
            gameObject.debugBodyColor = 0x112233;
            gameObject.debugBodyColor = 0x445566;
            expect(gameObject.body.debugBodyColor).toBe(0x445566);
        });
    });

    describe('chaining', function ()
    {
        it('should support chaining setDebug and setDebugBodyColor', function ()
        {
            var result = gameObject.setDebug(true, true, 0xff0000).setDebugBodyColor(0x00ff00);
            expect(result).toBe(gameObject);
            expect(gameObject.body.debugBodyColor).toBe(0x00ff00);
            expect(gameObject.body.debugShowBody).toBe(true);
            expect(gameObject.body.debugShowVelocity).toBe(true);
        });
    });
});
