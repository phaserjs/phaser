var helper = require('../../helper');

describe('GraphicsCreator', function ()
{
    var scene;

    beforeEach(async function ()
    {
        scene = await helper.createGame();
    });

    afterEach(function ()
    {
        helper.destroyGame();
    });

    it('should register the graphics factory with GameObjectCreator', function ()
    {
        expect(typeof scene.make.graphics).toBe('function');
    });

    it('should register under the key "graphics"', function ()
    {
        expect(scene.make).toHaveProperty('graphics');
    });

    it('should create a new Graphics instance with the scene and config', function ()
    {
        var go = scene.make.graphics({});

        expect(go).toBeDefined();
        expect(go.type).toBe('Graphics');
    });

    it('should use an empty config object when config is undefined', function ()
    {
        var go = scene.make.graphics();

        expect(go).toBeDefined();
        expect(go.type).toBe('Graphics');
    });

    it('should return the created Graphics instance', function ()
    {
        var go = scene.make.graphics({});

        expect(go).toBeDefined();
        expect(go.type).toBe('Graphics');
    });

    it('should set config.add from addToScene when addToScene is true', function ()
    {
        var config = {};

        scene.make.graphics(config, true);

        expect(config.add).toBe(true);
    });

    it('should set config.add from addToScene when addToScene is false', function ()
    {
        var config = { add: true };

        scene.make.graphics(config, false);

        expect(config.add).toBe(false);
    });

    it('should override existing config.add with addToScene parameter', function ()
    {
        var config = { add: false };

        scene.make.graphics(config, true);

        expect(config.add).toBe(true);
    });

    it('should add the graphics object to the display list when config.add is true', function ()
    {
        var spy = vi.spyOn(scene.sys.displayList, 'add');

        var go = scene.make.graphics({ add: true });

        expect(spy).toHaveBeenCalledWith(go);

        spy.mockRestore();
    });

    it('should not add the graphics object to the display list when config.add is false', function ()
    {
        var spy = vi.spyOn(scene.sys.displayList, 'add');

        scene.make.graphics({ add: false });

        expect(spy).not.toHaveBeenCalled();

        spy.mockRestore();
    });

    it('should not add the graphics object to the display list when config.add is not set', function ()
    {
        var spy = vi.spyOn(scene.sys.displayList, 'add');

        scene.make.graphics({});

        expect(spy).not.toHaveBeenCalled();

        spy.mockRestore();
    });

    it('should add to display list when addToScene overrides config.add to true', function ()
    {
        var spy = vi.spyOn(scene.sys.displayList, 'add');

        var go = scene.make.graphics({ add: false }, true);

        expect(spy).toHaveBeenCalledWith(go);

        spy.mockRestore();
    });

    it('should not add to display list when addToScene overrides config.add to false', function ()
    {
        var spy = vi.spyOn(scene.sys.displayList, 'add');

        scene.make.graphics({ add: true }, false);

        expect(spy).not.toHaveBeenCalled();

        spy.mockRestore();
    });

    it('should pass the config object to the Graphics constructor', function ()
    {
        var go = scene.make.graphics({ x: 100, y: 200 });

        expect(go).toBeDefined();
        expect(go.type).toBe('Graphics');
    });

    it('should not modify config when addToScene is undefined', function ()
    {
        var config = { someOption: 'value' };

        scene.make.graphics(config, undefined);

        expect(config.add).toBeUndefined();
        expect(config.someOption).toBe('value');
    });
});
