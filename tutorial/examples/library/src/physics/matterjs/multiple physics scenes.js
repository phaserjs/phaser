var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });
    },

    preload: function ()
    {
        this.load.image('ball1', 'assets/sprites/pangball.png');
    },

    create: function ()
    {
        this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

        for (var i = 0; i < 64; i++)
        {
            var ball = this.matter.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(-600, 0), 'ball1');
            ball.setCircle();
            ball.setFriction(0.005);
            ball.setBounce(1);
        }

        this.input.once('pointerdown', function (event) {

            this.scene.start('sceneB');

        }, this);
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB' });
    },

    preload: function ()
    {
        this.load.image('ball2', 'assets/sprites/shinyball.png');
    },

    create: function ()
    {
        this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

        for (var i = 0; i < 64; i++)
        {
            var ball = this.matter.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(-600, 0), 'ball2');
            ball.setCircle();
            ball.setFriction(0.005);
            ball.setBounce(1);
        }

        this.input.once('pointerdown', function (event) {

            this.scene.start('sceneA');

        }, this);
    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ SceneA, SceneB ],
    physics: {
        default: 'matter'
    },
};

var game = new Phaser.Game(config);
