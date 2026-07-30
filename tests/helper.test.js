/**
 * Tests for the test helper itself — verifies that a real headless
 * Phaser Game can be booted and used to create actual Game Objects.
 */

var helper = require('./helper');

describe('Test Helper - Headless Phaser', function ()
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

    it('should boot a real Phaser Game', function ()
    {
        var game = helper.getGame();
        expect(game).not.toBeNull();
        expect(game.isBooted).toBe(true);
        expect(game.isRunning).toBe(true);
    });

    it('should provide a real Scene', function ()
    {
        expect(scene).toBeDefined();
        expect(scene.add).toBeDefined();
        expect(scene.sys).toBeDefined();
    });

    it('should create a real Image', function ()
    {
        var img = scene.add.image(100, 200, '__DEFAULT');
        expect(img.type).toBe('Image');
        expect(img.x).toBe(100);
        expect(img.y).toBe(200);
        expect(img.width).toBe(32);
        expect(img.height).toBe(32);
    });

    it('should create a real Sprite', function ()
    {
        var sprite = scene.add.sprite(50, 75, '__DEFAULT');
        expect(sprite.type).toBe('Sprite');
        expect(sprite.x).toBe(50);
        expect(sprite.y).toBe(75);
    });

    it('should create a real Rectangle shape', function ()
    {
        var rect = scene.add.rectangle(10, 20, 64, 32, 0xff0000);
        expect(rect.type).toBe('Rectangle');
        expect(rect.x).toBe(10);
        expect(rect.y).toBe(20);
        expect(rect.width).toBe(64);
        expect(rect.height).toBe(32);
    });

    it('should support setPosition on a Sprite', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT');
        sprite.setPosition(200, 300);
        expect(sprite.x).toBe(200);
        expect(sprite.y).toBe(300);
    });

    it('should support setScale on an Image', function ()
    {
        var img = scene.add.image(0, 0, '__DEFAULT');
        img.setScale(2, 3);
        expect(img.scaleX).toBe(2);
        expect(img.scaleY).toBe(3);
    });

    it('should support setAlpha on a Sprite', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT');
        sprite.setAlpha(0.5);
        expect(sprite.alpha).toBe(0.5);
    });

    it('should support setAngle on a Sprite', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT');
        sprite.setAngle(90);
        expect(sprite.angle).toBe(90);
    });

    it('should support setVisible on a Sprite', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT');
        sprite.setVisible(false);
        expect(sprite.visible).toBe(false);
    });

    it('should support setDepth on a Sprite', function ()
    {
        var sprite = scene.add.sprite(0, 0, '__DEFAULT');
        sprite.setDepth(10);
        expect(sprite.depth).toBe(10);
    });

    it('should support setOrigin on an Image', function ()
    {
        var img = scene.add.image(0, 0, '__DEFAULT');
        img.setOrigin(0, 1);
        expect(img.originX).toBe(0);
        expect(img.originY).toBe(1);
    });

    it('should give access to Phaser namespace', function ()
    {
        var Phaser = helper.Phaser;
        expect(Phaser.VERSION).toBeDefined();
        expect(Phaser.Math).toBeDefined();
        expect(Phaser.Geom).toBeDefined();

        var vec = new Phaser.Math.Vector2(3, 4);
        expect(vec.length()).toBe(5);

        var circle = new Phaser.Geom.Circle(10, 20, 50);
        expect(circle.radius).toBe(50);
    });
});
