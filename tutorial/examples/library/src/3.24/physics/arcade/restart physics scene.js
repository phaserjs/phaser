var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Preloader ()
    {
        Phaser.Scene.call(this, { key: 'preloader' });
    },

    preload: function ()
    {
        this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
        this.load.image('buttonBG', 'assets/sprites/button-bg.png');
        this.load.image('buttonText', 'assets/sprites/button-text.png');
        this.load.image('ayu', 'assets/pics/ayu.png');
    },

    create: function ()
    {
        console.log('%c Preloader ', 'background: green; color: white; display: block;');

        this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
        this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
        this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
        this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

        this.scene.start('mainmenu');
    }

});

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: 'mainmenu' });
        window.MENU = this;
    },

    create: function ()
    {
        console.log('%c MainMenu ', 'background: green; color: white; display: block;');

        var bg = this.add.image(0, 0, 'buttonBG');
        var text = this.add.image(0, 0, 'buttonText');

        var container = this.add.container(400, 300, [ bg, text ]);

        bg.setInteractive();

        bg.once('pointerup', function () {

            this.scene.start('game');

        }, this);
    }

});

var Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Game ()
    {
        Phaser.Scene.call(this, { key: 'game' });
        window.GAME = this;
    
        this.controls;
        this.track;
        this.text;
    },

    create: function ()
    {
        console.log('%c Game ', 'background: green; color: white; display: block;');

        this.physics.world.setBounds(0, 0, 800 * 2, 600 * 2);

        var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -100, -100);

        //  Create loads of random sprites

        var anims = [ 'diamond', 'prism', 'ruby', 'square' ];

        for (var i = 0; i < 50; i++)
        {
            var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

            var block = this.physics.add.sprite(pos.x, pos.y, 'gems');

            block.setVelocity(Phaser.Math.Between(200, 400), Phaser.Math.Between(200, 400));
            block.setBounce(1).setCollideWorldBounds(true);

            if (Math.random() > 0.5)
            {
                block.body.velocity.x *= -1;
            }
            else
            {
                block.body.velocity.y *= -1;
            }

            block.play(Phaser.Math.RND.pick(anims));

            if (i === 0)
            {
                this.track = block;
            }
        }

        var cursors = this.input.keyboard.createCursorKeys();

        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.add.text(0, 0, 'Use Cursors to scroll camera.\nClick to Quit', { font: '18px Courier', fill: '#00ff00' }).setScrollFactor(0);

        this.text = this.add.text(400, 0, '', { font: '16px Courier', fill: '#00ff00' });

        this.input.once('pointerup', function () {

            this.scene.start('gameover');

        }, this);

    },

    update: function (time, delta)
    {
        this.controls.update(delta);

        this.text.setText([
            'x: ' + this.track.x,
            'y: ' + this.track.y
        ]);
    }

});

var GameOver = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameOver ()
    {
        Phaser.Scene.call(this, { key: 'gameover' });
        window.OVER = this;
    },

    create: function ()
    {
        console.log('%c GameOver ', 'background: green; color: white; display: block;');

        this.add.sprite(400, 300, 'ayu');

        this.add.text(300, 500, 'Game Over - Click to start restart', { font: '16px Courier', fill: '#00ff00' });

        this.input.once('pointerup', function (event) {

            this.scene.start('mainmenu');

        }, this);
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: true
        }
    },
    scene: [ Preloader, MainMenu, Game, GameOver ]
};

var game = new Phaser.Game(config);
