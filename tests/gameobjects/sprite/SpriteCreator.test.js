var helper = require('../../helper');

describe('SpriteCreator', function ()
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

    it('should register the sprite factory with GameObjectCreator', function ()
    {
        expect(typeof scene.make.sprite).toBe('function');
    });

    it('should register under the key "sprite"', function ()
    {
        var Phaser = helper.Phaser;

        expect(Phaser.GameObjects.GameObjectCreator.prototype.hasOwnProperty('sprite')).toBe(true);
    });

    it('should create a new Sprite instance', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: false });

        expect(sprite).toBeDefined();
        expect(sprite.type).toBe('Sprite');
    });

    it('should create a Sprite at position 0, 0 by default', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: false });

        expect(sprite.x).toBe(0);
        expect(sprite.y).toBe(0);
    });

    it('should use an empty config object when config is undefined', function ()
    {
        var sprite = scene.make.sprite(undefined, false);

        expect(sprite).toBeDefined();
        expect(sprite.type).toBe('Sprite');
    });

    it('should extract key from config', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: false });

        expect(sprite.texture.key).toBe('__DEFAULT');
    });

    it('should extract string frame from config', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', frame: 0, add: false });

        expect(sprite).toBeDefined();
        expect(sprite.type).toBe('Sprite');
    });

    it('should extract numeric frame from config', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', frame: 0, add: false });

        expect(sprite.frame).toBeDefined();
    });

    it('should use null key when key is not in config', function ()
    {
        var sprite = scene.make.sprite({ add: false });

        expect(sprite).toBeDefined();
        expect(sprite.type).toBe('Sprite');
    });

    it('should return a Sprite instance', function ()
    {
        var Phaser = helper.Phaser;
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: false });

        expect(sprite instanceof Phaser.GameObjects.Sprite).toBe(true);
    });

    it('should add the sprite to the display list when addToScene is true', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT' }, true);

        expect(scene.sys.displayList.exists(sprite)).toBe(true);
    });

    it('should not add the sprite to the display list when addToScene is false', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT' }, false);

        expect(scene.sys.displayList.exists(sprite)).toBe(false);
    });

    it('should not add the sprite to the display list when config.add is false', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: false });

        expect(scene.sys.displayList.exists(sprite)).toBe(false);
    });

    it('should add the sprite to the display list when config.add is true', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: true });

        expect(scene.sys.displayList.exists(sprite)).toBe(true);
    });

    it('should override config.add with addToScene parameter when addToScene is true', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: false }, true);

        expect(scene.sys.displayList.exists(sprite)).toBe(true);
    });

    it('should override config.add with addToScene parameter when addToScene is false', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: true }, false);

        expect(scene.sys.displayList.exists(sprite)).toBe(false);
    });

    it('should not modify whether sprite is added when addToScene is undefined', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: false }, undefined);

        expect(scene.sys.displayList.exists(sprite)).toBe(false);
    });

    it('should pass animation config through BuildGameObjectAnimation', function ()
    {
        var sprite = scene.make.sprite({ key: '__DEFAULT', add: false });

        expect(sprite.anims).toBeDefined();
    });
});
