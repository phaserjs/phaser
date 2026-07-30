var helper = require('../../helper');

describe('ImageFactory', function ()
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

    it('should be registered on the GameObjectFactory', function ()
    {
        expect(typeof scene.add.image).toBe('function');
    });

    it('should create a new Image with the correct type', function ()
    {
        var image = scene.add.image(100, 200, '__DEFAULT');

        expect(image.type).toBe('Image');
    });

    it('should create a new Image with the scene, x, y coordinates', function ()
    {
        var image = scene.add.image(100, 200, '__DEFAULT');

        expect(image.x).toBe(100);
        expect(image.y).toBe(200);
    });

    it('should support negative coordinates', function ()
    {
        var image = scene.add.image(-50, -100, '__DEFAULT');

        expect(image.x).toBe(-50);
        expect(image.y).toBe(-100);
    });

    it('should support zero coordinates', function ()
    {
        var image = scene.add.image(0, 0, '__DEFAULT');

        expect(image.x).toBe(0);
        expect(image.y).toBe(0);
    });

    it('should support a numeric frame index', function ()
    {
        var image = scene.add.image(0, 0, '__DEFAULT', 0);

        expect(image).toBeDefined();
        expect(image.type).toBe('Image');
    });

    it('should support a string frame name', function ()
    {
        var image = scene.add.image(0, 0, '__DEFAULT', '__BASE');

        expect(image).toBeDefined();
        expect(image.type).toBe('Image');
    });

    it('should support undefined frame', function ()
    {
        var image = scene.add.image(0, 0, '__DEFAULT', undefined);

        expect(image).toBeDefined();
        expect(image.type).toBe('Image');
    });

    it('should add the created Image instance to the display list', function ()
    {
        var image = scene.add.image(10, 20, '__DEFAULT');

        expect(scene.children.exists(image)).toBe(true);
    });

    it('should return the Image instance', function ()
    {
        var image = scene.add.image(0, 0, '__DEFAULT');

        expect(image).toBeDefined();
        expect(image.type).toBe('Image');
    });

    it('should work with different texture keys', function ()
    {
        var image1 = scene.add.image(0, 0, '__DEFAULT');
        var image2 = scene.add.image(0, 0, '__MISSING');

        expect(image1.type).toBe('Image');
        expect(image2.type).toBe('Image');
    });

    it('should set the texture on the created Image', function ()
    {
        var image = scene.add.image(0, 0, '__DEFAULT');

        expect(image.texture).toBeDefined();
        expect(image.texture.key).toBe('__DEFAULT');
    });
});
