var GameObjectCreator = require('../../src/gameobjects/GameObjectCreator');

describe('GameObjectCreator', function ()
{
    describe('register', function ()
    {
        afterEach(function ()
        {
            if (GameObjectCreator.prototype.hasOwnProperty('testType'))
            {
                delete GameObjectCreator.prototype['testType'];
            }
        });

        it('should add a function to the prototype', function ()
        {
            var fn = function () { return 'test'; };

            GameObjectCreator.register('testType', fn);

            expect(GameObjectCreator.prototype.hasOwnProperty('testType')).toBe(true);
            expect(GameObjectCreator.prototype['testType']).toBe(fn);
        });

        it('should not overwrite an existing method if already registered', function ()
        {
            var fn1 = function () { return 'first'; };
            var fn2 = function () { return 'second'; };

            GameObjectCreator.register('testType', fn1);
            GameObjectCreator.register('testType', fn2);

            expect(GameObjectCreator.prototype['testType']).toBe(fn1);
        });

        it('should allow registering multiple different factory types', function ()
        {
            var fn1 = function () { return 'a'; };
            var fn2 = function () { return 'b'; };

            GameObjectCreator.register('testType', fn1);
            GameObjectCreator.register('testTypeTwo', fn2);

            expect(GameObjectCreator.prototype.hasOwnProperty('testType')).toBe(true);
            expect(GameObjectCreator.prototype.hasOwnProperty('testTypeTwo')).toBe(true);

            delete GameObjectCreator.prototype['testTypeTwo'];
        });

        it('should register a function that is callable on the prototype', function ()
        {
            var called = false;
            var fn = function () { called = true; };

            GameObjectCreator.register('testType', fn);

            GameObjectCreator.prototype['testType']();

            expect(called).toBe(true);
        });
    });

    describe('remove', function ()
    {
        it('should remove a previously registered factory type', function ()
        {
            var fn = function () {};

            GameObjectCreator.prototype['testRemove'] = fn;

            GameObjectCreator.remove('testRemove');

            expect(GameObjectCreator.prototype.hasOwnProperty('testRemove')).toBe(false);
        });

        it('should not throw when removing a factory type that does not exist', function ()
        {
            expect(function ()
            {
                GameObjectCreator.remove('nonExistentType');
            }).not.toThrow();
        });

        it('should not remove inherited prototype methods', function ()
        {
            // 'toString' is inherited from Object.prototype, not an own property
            expect(GameObjectCreator.prototype.hasOwnProperty('toString')).toBe(false);

            GameObjectCreator.remove('toString');

            // remove only deletes own properties, so inherited methods remain accessible
            expect(typeof GameObjectCreator.prototype['toString']).toBe('function');
        });

        it('should allow re-registering a type after it has been removed', function ()
        {
            var fn1 = function () { return 'original'; };
            var fn2 = function () { return 'replacement'; };

            GameObjectCreator.register('testType', fn1);
            GameObjectCreator.remove('testType');

            expect(GameObjectCreator.prototype.hasOwnProperty('testType')).toBe(false);

            GameObjectCreator.register('testType', fn2);

            expect(GameObjectCreator.prototype['testType']).toBe(fn2);

            delete GameObjectCreator.prototype['testType'];
        });
    });
});
