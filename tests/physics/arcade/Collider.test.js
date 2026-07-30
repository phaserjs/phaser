var Collider = require('../../../src/physics/arcade/Collider');

describe('Collider', function ()
{
    var mockWorld;
    var obj1;
    var obj2;
    var collideCallback;
    var processCallback;
    var callbackContext;

    beforeEach(function ()
    {
        mockWorld = {
            collideObjects: vi.fn(),
            removeCollider: vi.fn()
        };

        obj1 = { id: 'object1' };
        obj2 = { id: 'object2' };
        collideCallback = vi.fn();
        processCallback = vi.fn();
        callbackContext = { scope: true };
    });

    describe('constructor', function ()
    {
        it('should assign the world reference', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.world).toBe(mockWorld);
        });

        it('should set name to empty string by default', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.name).toBe('');
        });

        it('should set active to true by default', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.active).toBe(true);
        });

        it('should set overlapOnly to false when passed false', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.overlapOnly).toBe(false);
        });

        it('should set overlapOnly to true when passed true', function ()
        {
            var collider = new Collider(mockWorld, true, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.overlapOnly).toBe(true);
        });

        it('should assign object1', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.object1).toBe(obj1);
        });

        it('should assign object2', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.object2).toBe(obj2);
        });

        it('should assign collideCallback', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.collideCallback).toBe(collideCallback);
        });

        it('should assign processCallback', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.processCallback).toBe(processCallback);
        });

        it('should assign callbackContext', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            expect(collider.callbackContext).toBe(callbackContext);
        });

        it('should accept null for optional callback arguments', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, null, null, null);
            expect(collider.collideCallback).toBeNull();
            expect(collider.processCallback).toBeNull();
            expect(collider.callbackContext).toBeNull();
        });
    });

    describe('setName', function ()
    {
        it('should set the name property', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, null, null, null);
            collider.setName('myCollider');
            expect(collider.name).toBe('myCollider');
        });

        it('should return the collider instance for chaining', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, null, null, null);
            var result = collider.setName('test');
            expect(result).toBe(collider);
        });

        it('should allow overwriting the name', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, null, null, null);
            collider.setName('first');
            collider.setName('second');
            expect(collider.name).toBe('second');
        });

        it('should allow setting an empty string name', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, null, null, null);
            collider.setName('named');
            collider.setName('');
            expect(collider.name).toBe('');
        });

        it('should support chained calls', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, null, null, null);
            collider.setName('a').setName('b');
            expect(collider.name).toBe('b');
        });
    });

    describe('update', function ()
    {
        it('should call world.collideObjects with the correct arguments', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.update();
            expect(mockWorld.collideObjects).toHaveBeenCalledOnce();
            expect(mockWorld.collideObjects).toHaveBeenCalledWith(
                obj1,
                obj2,
                collideCallback,
                processCallback,
                callbackContext,
                false
            );
        });

        it('should pass overlapOnly as true when configured', function ()
        {
            var collider = new Collider(mockWorld, true, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.update();
            expect(mockWorld.collideObjects).toHaveBeenCalledWith(
                obj1,
                obj2,
                collideCallback,
                processCallback,
                callbackContext,
                true
            );
        });

        it('should pass null callbacks when none were provided', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, null, null, null);
            collider.update();
            expect(mockWorld.collideObjects).toHaveBeenCalledWith(
                obj1,
                obj2,
                null,
                null,
                null,
                false
            );
        });

        it('should call world.collideObjects each time update is called', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, null, null, null);
            collider.update();
            collider.update();
            collider.update();
            expect(mockWorld.collideObjects).toHaveBeenCalledTimes(3);
        });
    });

    describe('destroy', function ()
    {
        it('should call world.removeCollider with itself', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.destroy();
            expect(mockWorld.removeCollider).toHaveBeenCalledWith(collider);
        });

        it('should set active to false', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.destroy();
            expect(collider.active).toBe(false);
        });

        it('should set world to null', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.destroy();
            expect(collider.world).toBeNull();
        });

        it('should set object1 to null', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.destroy();
            expect(collider.object1).toBeNull();
        });

        it('should set object2 to null', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.destroy();
            expect(collider.object2).toBeNull();
        });

        it('should set collideCallback to null', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.destroy();
            expect(collider.collideCallback).toBeNull();
        });

        it('should set processCallback to null', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.destroy();
            expect(collider.processCallback).toBeNull();
        });

        it('should set callbackContext to null', function ()
        {
            var collider = new Collider(mockWorld, false, obj1, obj2, collideCallback, processCallback, callbackContext);
            collider.destroy();
            expect(collider.callbackContext).toBeNull();
        });
    });
});
