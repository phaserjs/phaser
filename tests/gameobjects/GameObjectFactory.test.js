var GameObjectFactory = require('../../src/gameobjects/GameObjectFactory');

describe('GameObjectFactory', function ()
{
    var mockEvents;
    var mockScene;
    var factory;

    beforeEach(function ()
    {
        mockEvents = {
            once: vi.fn(),
            on: vi.fn(),
            off: vi.fn()
        };

        mockScene = {
            sys: {
                events: mockEvents,
                displayList: null,
                updateList: null
            }
        };

        factory = new GameObjectFactory(mockScene);
    });

    afterEach(function ()
    {
        vi.clearAllMocks();
    });

    describe('constructor', function ()
    {
        it('should store a reference to the scene', function ()
        {
            expect(factory.scene).toBe(mockScene);
        });

        it('should store a reference to the scene systems', function ()
        {
            expect(factory.systems).toBe(mockScene.sys);
        });

        it('should store a reference to the scene event emitter', function ()
        {
            expect(factory.events).toBe(mockScene.sys.events);
        });

        it('should register a BOOT listener via once', function ()
        {
            var bootCall = mockEvents.once.mock.calls.find(function (call)
            {
                return call[1] === factory.boot;
            });

            expect(bootCall).toBeDefined();
        });

        it('should register a START listener via on', function ()
        {
            var startCall = mockEvents.on.mock.calls.find(function (call)
            {
                return call[1] === factory.start;
            });

            expect(startCall).toBeDefined();
        });
    });

    describe('existing', function ()
    {
        var mockDisplayList;
        var mockUpdateList;

        beforeEach(function ()
        {
            mockDisplayList = {
                add: vi.fn()
            };

            mockUpdateList = {
                add: vi.fn()
            };

            factory.displayList = mockDisplayList;
            factory.updateList = mockUpdateList;
        });

        it('should add child to displayList when it has renderCanvas', function ()
        {
            var child = { renderCanvas: vi.fn() };

            factory.existing(child);

            expect(mockDisplayList.add).toHaveBeenCalledWith(child);
        });

        it('should add child to displayList when it has renderWebGL', function ()
        {
            var child = { renderWebGL: vi.fn() };

            factory.existing(child);

            expect(mockDisplayList.add).toHaveBeenCalledWith(child);
        });

        it('should add child to displayList when it has both render methods', function ()
        {
            var child = { renderCanvas: vi.fn(), renderWebGL: vi.fn() };

            factory.existing(child);

            expect(mockDisplayList.add).toHaveBeenCalledWith(child);
        });

        it('should not add child to displayList when it has no render methods', function ()
        {
            var child = {};

            factory.existing(child);

            expect(mockDisplayList.add).not.toHaveBeenCalled();
        });

        it('should add child to updateList when it has preUpdate', function ()
        {
            var child = { preUpdate: vi.fn() };

            factory.existing(child);

            expect(mockUpdateList.add).toHaveBeenCalledWith(child);
        });

        it('should not add child to updateList when it has no preUpdate', function ()
        {
            var child = {};

            factory.existing(child);

            expect(mockUpdateList.add).not.toHaveBeenCalled();
        });

        it('should add child to both lists when it has renderCanvas and preUpdate', function ()
        {
            var child = { renderCanvas: vi.fn(), preUpdate: vi.fn() };

            factory.existing(child);

            expect(mockDisplayList.add).toHaveBeenCalledWith(child);
            expect(mockUpdateList.add).toHaveBeenCalledWith(child);
        });

        it('should return the child', function ()
        {
            var child = { renderCanvas: vi.fn() };

            var result = factory.existing(child);

            expect(result).toBe(child);
        });

        it('should return the child even when it has no render or update methods', function ()
        {
            var child = {};

            var result = factory.existing(child);

            expect(result).toBe(child);
        });
    });

    describe('GameObjectFactory.register', function ()
    {
        afterEach(function ()
        {
            GameObjectFactory.remove('testFactory');
            GameObjectFactory.remove('anotherFactory');
        });

        it('should add the factory function to the prototype', function ()
        {
            var fn = vi.fn();

            GameObjectFactory.register('testFactory', fn);

            expect(GameObjectFactory.prototype.testFactory).toBe(fn);
        });

        it('should not overwrite an existing factory function', function ()
        {
            var fn1 = vi.fn();
            var fn2 = vi.fn();

            GameObjectFactory.register('testFactory', fn1);
            GameObjectFactory.register('testFactory', fn2);

            expect(GameObjectFactory.prototype.testFactory).toBe(fn1);
        });

        it('should allow registering multiple distinct factory types', function ()
        {
            var fn1 = vi.fn();
            var fn2 = vi.fn();

            GameObjectFactory.register('testFactory', fn1);
            GameObjectFactory.register('anotherFactory', fn2);

            expect(GameObjectFactory.prototype.testFactory).toBe(fn1);
            expect(GameObjectFactory.prototype.anotherFactory).toBe(fn2);
        });

        it('should make the factory accessible on a factory instance', function ()
        {
            var fn = vi.fn();

            GameObjectFactory.register('testFactory', fn);

            expect(factory.testFactory).toBe(fn);
        });
    });

    describe('GameObjectFactory.remove', function ()
    {
        it('should remove an existing factory function from the prototype', function ()
        {
            var fn = vi.fn();

            GameObjectFactory.register('testFactory', fn);
            expect(GameObjectFactory.prototype.testFactory).toBe(fn);

            GameObjectFactory.remove('testFactory');

            expect(GameObjectFactory.prototype.hasOwnProperty('testFactory')).toBe(false);
        });

        it('should not throw when removing a factory type that does not exist', function ()
        {
            expect(function ()
            {
                GameObjectFactory.remove('nonExistentFactory');
            }).not.toThrow();
        });

        it('should not remove a factory that was never registered', function ()
        {
            GameObjectFactory.register('testFactory', vi.fn());
            var keysBefore = Object.keys(GameObjectFactory.prototype).length;

            GameObjectFactory.remove('neverRegistered');

            expect(Object.keys(GameObjectFactory.prototype).length).toBe(keysBefore);

            GameObjectFactory.remove('testFactory');
        });

        it('should make the factory inaccessible on instances after removal', function ()
        {
            var fn = vi.fn();

            GameObjectFactory.register('testFactory', fn);
            expect(factory.testFactory).toBe(fn);

            GameObjectFactory.remove('testFactory');

            expect(factory.testFactory).toBeUndefined();
        });
    });
});
