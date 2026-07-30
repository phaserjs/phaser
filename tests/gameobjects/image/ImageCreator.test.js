var helper = require('../../helper');

describe('ImageCreator', function ()
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

    it('should register the image factory with GameObjectCreator', function ()
    {
        var GameObjectCreator = helper.Phaser.GameObjects.GameObjectCreator;

        expect(typeof GameObjectCreator.prototype.image).toBe('function');
    });

    it('should register under the key "image"', function ()
    {
        var GameObjectCreator = helper.Phaser.GameObjects.GameObjectCreator;

        expect(GameObjectCreator.prototype.hasOwnProperty('image')).toBe(true);
    });

    it('should create a new Image instance with the scene at position 0, 0', function ()
    {
        var image = scene.make.image({ key: '__DEFAULT' });

        expect(image).toBeDefined();
        expect(image.x).toBe(0);
        expect(image.y).toBe(0);
        expect(image.type).toBe('Image');
    });

    it('should use an empty config object when config is undefined', function ()
    {
        var GameObjectCreator = helper.Phaser.GameObjects.GameObjectCreator;
        var factoryFn = GameObjectCreator.prototype.image;
        var context = { scene: scene };

        var image = factoryFn.call(context, undefined, undefined);

        expect(image).toBeDefined();
        expect(image.x).toBe(0);
        expect(image.y).toBe(0);
    });

    it('should extract key from config', function ()
    {
        var image = scene.make.image({ key: '__DEFAULT' });

        expect(image.texture.key).toBe('__DEFAULT');
    });

    it('should extract frame from config', function ()
    {
        var image = scene.make.image({ key: '__DEFAULT', frame: 0 });

        expect(image.texture.key).toBe('__DEFAULT');
        expect(image.frame).toBeDefined();
    });

    it('should extract numeric frame from config', function ()
    {
        var image = scene.make.image({ key: '__DEFAULT', frame: 0 });

        expect(image.texture.key).toBe('__DEFAULT');
    });

    it('should use null key when key is not in config', function ()
    {
        var GameObjectCreator = helper.Phaser.GameObjects.GameObjectCreator;
        var factoryFn = GameObjectCreator.prototype.image;
        var context = { scene: scene };

        var image = factoryFn.call(context, {}, undefined);

        expect(image).toBeDefined();
    });

    it('should call scene.make.image and return an Image type', function ()
    {
        var image = scene.make.image({ key: '__DEFAULT' });

        expect(image.type).toBe('Image');
    });

    it('should return an object with x and y at 0 by default', function ()
    {
        var image = scene.make.image({ key: '__DEFAULT' });

        expect(image.x).toBe(0);
        expect(image.y).toBe(0);
    });

    it('should set config.add from addToScene when addToScene is true', function ()
    {
        var GameObjectCreator = helper.Phaser.GameObjects.GameObjectCreator;
        var factoryFn = GameObjectCreator.prototype.image;
        var context = { scene: scene };
        var config = { key: '__DEFAULT' };

        factoryFn.call(context, config, true);

        expect(config.add).toBe(true);
    });

    it('should set config.add from addToScene when addToScene is false', function ()
    {
        var GameObjectCreator = helper.Phaser.GameObjects.GameObjectCreator;
        var factoryFn = GameObjectCreator.prototype.image;
        var context = { scene: scene };
        var config = { key: '__DEFAULT', add: true };

        factoryFn.call(context, config, false);

        expect(config.add).toBe(false);
    });

    it('should override existing config.add with addToScene parameter', function ()
    {
        var GameObjectCreator = helper.Phaser.GameObjects.GameObjectCreator;
        var factoryFn = GameObjectCreator.prototype.image;
        var context = { scene: scene };
        var config = { key: '__DEFAULT', add: false };

        factoryFn.call(context, config, true);

        expect(config.add).toBe(true);
    });

    it('should not modify config.add when addToScene is undefined', function ()
    {
        var GameObjectCreator = helper.Phaser.GameObjects.GameObjectCreator;
        var factoryFn = GameObjectCreator.prototype.image;
        var context = { scene: scene };
        var config = { key: '__DEFAULT' };

        factoryFn.call(context, config, undefined);

        expect(config.add).toBeUndefined();
    });

    it('should pass the config with addToScene set and return an Image', function ()
    {
        var GameObjectCreator = helper.Phaser.GameObjects.GameObjectCreator;
        var factoryFn = GameObjectCreator.prototype.image;
        var context = { scene: scene };
        var config = { key: '__DEFAULT' };

        var result = factoryFn.call(context, config, true);

        expect(config.add).toBe(true);
        expect(result.type).toBe('Image');
    });
});
