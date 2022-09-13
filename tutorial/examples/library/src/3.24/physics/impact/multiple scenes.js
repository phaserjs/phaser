var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });
    },

    preload: function ()
    {
        this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
    },

    create: function ()
    {
        var wallThickness = 64;
        var sides = (wallThickness * 2) + 96;
        var worldBounds = new Phaser.Geom.Rectangle(0, 0, (800), (600));
        var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(worldBounds), -sides, -sides);

        this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
        this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
        this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
        this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

        var anims = [ 'diamond', 'prism', 'ruby', 'square' ];

        for (var i = 0; i < 16; i++)
        {
            var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

            var block = this.impact.add.sprite(pos.x, pos.y, 'gems');

            block.setActiveCollision().setAvsB().setBounce(1);

            block.setVelocity(Phaser.Math.Between(200, 400), Phaser.Math.Between(200, 400));

            if (Math.random() > 0.5)
            {
                block.vel.x *= -1;
            }
            else
            {
                block.vel.y *= -1;
            }

            block.play(Phaser.Math.RND.pick(anims));
        }

        this.impact.world.setBounds(0, 0, worldBounds.width, worldBounds.height, wallThickness);
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, {
            key: 'sceneB',
            active: true,
            physics: {
                system: 'impact',
                gravity: 0
            }
        });
    },

    preload: function ()
    {
        this.load.image('block', 'assets/sprites/block.png');
    },

    create: function ()
    {
        var blockA = this.impact.add.image(300, 300, 'block');
        var blockB = this.impact.add.image(60, 300, 'block');
        var blockC = this.impact.add.image(730, 300, 'block');

        blockA.setTypeA().setCheckAgainstB().setActiveCollision().setMaxVelocity(300);
        blockB.setTypeB().setCheckAgainstA().setFixedCollision();
        blockC.setTypeB().setCheckAgainstA().setFixedCollision();

        blockA.setBounce(1).setVelocityX(300);
    }

});

var SceneC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneC ()
    {
        Phaser.Scene.call(this, {
            key: 'sceneC',
            active: true,
            physics: {
                system: 'impact',
                gravity: 100,
                setBounds: true
            }
        });

        this.ship;
    },

    preload: function ()
    {
        this.load.image('ship', 'assets/sprites/arrow.png');
    },

    create: function ()
    {
        this.ship = this.impact.add.image(320, 450, 'ship').setActiveCollision().setVelocity(200, -200).setBounce(1);

        this.add.text(0, 0, 'Press 1 to 3 to pause the scenes');

        var _this = this;

        this.input.on('KEY_DOWN_ONE', function (event) {

            (_this.scene.isActive('sceneA')) ? _this.scene.pause('sceneA') : _this.scene.resume('sceneA');

        });

        this.input.on('KEY_DOWN_TWO', function (event) {

            (_this.scene.isActive('sceneB')) ? _this.scene.pause('sceneB') : _this.scene.resume('sceneB');

        });

        this.input.on('KEY_DOWN_THREE', function (event) {

            (_this.scene.isActive('sceneC')) ? _this.scene.pause('sceneC') : _this.scene.resume('sceneC');

        });
    },

    update: function (time, delta)
    {
        this.ship.rotation = Math.atan2(this.ship.vel.y, this.ship.vel.x);
    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 50,
            maxVelocity: 500,
            debug: false
        }
    },
    scene: [ SceneA, SceneB, SceneC ]
};

var game = new Phaser.Game(config);
