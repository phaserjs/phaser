var helper = require('../../helper');

describe('TileSpriteFactory', function ()
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

    it('should register tileSprite on the scene add factory', function ()
    {
        expect(typeof scene.add.tileSprite).toBe('function');
    });

    it('should create a TileSprite with type TileSprite', function ()
    {
        var sprite = scene.add.tileSprite(100, 200, 64, 128, '__DEFAULT');

        expect(sprite).toBeDefined();
        expect(sprite.type).toBe('TileSprite');
    });

    it('should set x and y on the created TileSprite', function ()
    {
        var sprite = scene.add.tileSprite(100, 200, 64, 128, '__DEFAULT');

        expect(sprite.x).toBe(100);
        expect(sprite.y).toBe(200);
    });

    it('should set width and height on the created TileSprite', function ()
    {
        var sprite = scene.add.tileSprite(0, 0, 320, 240, '__DEFAULT');

        expect(sprite.width).toBe(320);
        expect(sprite.height).toBe(240);
    });

    it('should use the given texture', function ()
    {
        var sprite = scene.add.tileSprite(0, 0, 64, 64, '__DEFAULT');

        expect(sprite.texture.key).toBe('__DEFAULT');
    });

    it('should support negative coordinates', function ()
    {
        var sprite = scene.add.tileSprite(-100, -200, 64, 64, '__DEFAULT');

        expect(sprite.x).toBe(-100);
        expect(sprite.y).toBe(-200);
    });

    it('should add the TileSprite to the scene display list', function ()
    {
        var sprite = scene.add.tileSprite(0, 0, 64, 64, '__DEFAULT');

        expect(scene.children.exists(sprite)).toBe(true);
    });

    it('should support a numeric frame argument', function ()
    {
        var sprite = scene.add.tileSprite(0, 0, 64, 64, '__DEFAULT', 0);

        expect(sprite).toBeDefined();
        expect(sprite.type).toBe('TileSprite');
    });

    it('should create multiple TileSprites independently', function ()
    {
        var a = scene.add.tileSprite(10, 20, 64, 64, '__DEFAULT');
        var b = scene.add.tileSprite(30, 40, 128, 128, '__DEFAULT');

        expect(a.x).toBe(10);
        expect(b.x).toBe(30);
        expect(a).not.toBe(b);
    });
});
