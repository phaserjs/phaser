var helper = require('../../helper');

describe('Phaser.Physics.Arcade.Factory', function ()
{
    var scene;
    var physics;

    beforeEach(async function ()
    {
        scene = await helper.createGame({
            physics: {
                default: 'arcade',
                arcade: { debug: false, gravity: { y: 0 } }
            }
        });

        physics = scene.physics;
    });

    afterEach(function ()
    {
        helper.destroyGame();
    });

    describe('image', function ()
    {
        it('should create an arcade image at the given position', function ()
        {
            var img = physics.add.image(100, 200, '__DEFAULT');

            expect(img.x).toBe(100);
            expect(img.y).toBe(200);
            expect(img.body).toBeDefined();
        });

        it('should have a dynamic body by default', function ()
        {
            var img = physics.add.image(0, 0, '__DEFAULT');

            expect(img.body.physicsType).toBe(helper.Phaser.Physics.Arcade.DYNAMIC_BODY);
        });
    });

    describe('staticImage', function ()
    {
        it('should create a static arcade image', function ()
        {
            var img = physics.add.staticImage(50, 75, '__DEFAULT');

            expect(img.x).toBe(50);
            expect(img.y).toBe(75);
            expect(img.body).toBeDefined();
        });
    });

    describe('sprite', function ()
    {
        it('should create an arcade sprite at the given position', function ()
        {
            var sprite = physics.add.sprite(30, 40, '__DEFAULT');

            expect(sprite.x).toBe(30);
            expect(sprite.y).toBe(40);
            expect(sprite.body).toBeDefined();
            expect(sprite.type).toBe('Sprite');
        });

        it('should have a body by default', function ()
        {
            var sprite = physics.add.sprite(0, 0, '__DEFAULT');

            expect(sprite.body).toBeDefined();
            expect(sprite.body).not.toBeNull();
        });
    });

    describe('staticSprite', function ()
    {
        it('should create a static arcade sprite', function ()
        {
            var sprite = physics.add.staticSprite(10, 20, '__DEFAULT');

            expect(sprite.x).toBe(10);
            expect(sprite.y).toBe(20);
            expect(sprite.body).toBeDefined();
        });
    });

    describe('group', function ()
    {
        it('should create a physics group', function ()
        {
            var group = physics.add.group();

            expect(group).toBeDefined();
        });

        it('should create children from config', function ()
        {
            var group = physics.add.group({
                key: '__DEFAULT',
                repeat: 2
            });

            expect(group.getLength()).toBe(3);
        });

        it('should give children dynamic bodies', function ()
        {
            var group = physics.add.group({
                key: '__DEFAULT',
                repeat: 0
            });

            var child = group.getFirst(true);

            expect(child.body).toBeDefined();
            expect(child.body.physicsType).toBe(helper.Phaser.Physics.Arcade.DYNAMIC_BODY);
        });
    });

    describe('staticGroup', function ()
    {
        it('should create a static physics group', function ()
        {
            var group = physics.add.staticGroup();

            expect(group).toBeDefined();
        });

        it('should create children from config', function ()
        {
            var group = physics.add.staticGroup({
                key: '__DEFAULT',
                repeat: 1
            });

            expect(group.getLength()).toBe(2);
        });
    });

    describe('existing', function ()
    {
        it('should add a dynamic body to an existing game object', function ()
        {
            var img = scene.add.image(0, 0, '__DEFAULT');

            expect(img.body).toBeFalsy();

            physics.add.existing(img);

            expect(img.body).toBeDefined();
            expect(img.body.physicsType).toBe(helper.Phaser.Physics.Arcade.DYNAMIC_BODY);
        });

        it('should add a static body when isStatic is true', function ()
        {
            var img = scene.add.image(0, 0, '__DEFAULT');

            physics.add.existing(img, true);

            expect(img.body).toBeDefined();
        });
    });

    describe('collider', function ()
    {
        it('should create a collider between two objects', function ()
        {
            var a = physics.add.sprite(0, 0, '__DEFAULT');
            var b = physics.add.sprite(100, 100, '__DEFAULT');

            var collider = physics.add.collider(a, b);

            expect(collider).toBeDefined();
        });
    });

    describe('overlap', function ()
    {
        it('should create an overlap between two objects', function ()
        {
            var a = physics.add.sprite(0, 0, '__DEFAULT');
            var b = physics.add.sprite(0, 0, '__DEFAULT');

            var overlap = physics.add.overlap(a, b);

            expect(overlap).toBeDefined();
        });
    });

    describe('destroy', function ()
    {
        it('should null out references when destroyed', function ()
        {
            var factory = physics.add;

            factory.destroy();

            expect(factory.world).toBeNull();
            expect(factory.scene).toBeNull();
            expect(factory.sys).toBeNull();
        });
    });
});
