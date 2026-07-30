var helper = require('../../helper');

describe('SpriteFactory', function ()
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

    it('should call GameObjectFactory.register with sprite as the key', function ()
    {
        expect(typeof scene.add.sprite).toBe('function');
    });

    it('should register a function as the factory handler', function ()
    {
        expect(typeof scene.add.sprite).toBe('function');
    });

    it('should create a new Sprite with the scene, x, y, texture, and frame', function ()
    {
        var sprite = scene.add.sprite(100, 200, '__DEFAULT', 0);

        expect(sprite).toBeDefined();
        expect(sprite.x).toBe(100);
        expect(sprite.y).toBe(200);
    });

    it('should pass the scene reference from context as the first argument to Sprite', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT');

        expect(sprite.scene).toBe(scene);
    });

    it('should pass x and y coordinates to Sprite', function ()
    {
        var sprite = scene.add.sprite(512, 384, '__DEFAULT');

        expect(sprite.x).toBe(512);
        expect(sprite.y).toBe(384);
    });

    it('should support negative coordinates', function ()
    {
        var sprite = scene.add.sprite(-50, -100, '__DEFAULT');

        expect(sprite.x).toBe(-50);
        expect(sprite.y).toBe(-100);
    });

    it('should support zero coordinates', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT');

        expect(sprite.x).toBe(0);
        expect(sprite.y).toBe(0);
    });

    it('should support a numeric frame index', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT', 0);

        expect(sprite).toBeDefined();
    });

    it('should support a string frame name', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT');

        expect(sprite).toBeDefined();
    });

    it('should support undefined frame', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT', undefined);

        expect(sprite).toBeDefined();
    });

    it('should add the created Sprite instance to the display list', function ()
    {
        var sprite = scene.add.sprite(10, 20, '__DEFAULT');

        expect(scene.children.list).toContain(sprite);
    });

    it('should return the result of displayList.add', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT');

        expect(sprite).toBeDefined();
        expect(sprite.type).toBe('Sprite');
    });

    it('should work with different texture keys', function ()
    {
        var sprite1 = scene.add.sprite(0, 0, '__DEFAULT');
        var sprite2 = scene.add.sprite(0, 0, '__MISSING');

        expect(sprite1.texture.key).toBe('__DEFAULT');
        expect(sprite2.texture.key).toBe('__MISSING');
    });

    it('should support floating point coordinates', function ()
    {
        var sprite = scene.add.sprite(1.5, 2.75, '__DEFAULT');

        expect(sprite.x).toBeCloseTo(1.5);
        expect(sprite.y).toBeCloseTo(2.75);
    });
});
