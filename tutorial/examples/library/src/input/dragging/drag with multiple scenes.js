var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function ()
    {
        this.load.image('box', 'assets/sprites/128x128-v2.png');
    },

    create: function ()
    {
        // this.input.setGlobalTopOnly(true);

        var box = this.add.image(400, 300, 'box').setInteractive();

        box.on('pointerdown', function () {

            box.tint = Math.random() * 0xffffff;

        });
    }

});

var UIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
    },

    preload: function ()
    {
        this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
    },

    create: function ()
    {
        var image = this.add.sprite(200, 300, 'eye').setInteractive();

        this.input.setDraggable(image);

        this.input.on('dragstart', function (pointer, gameObject) {

            gameObject.setTint(0xff0000);

        });

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            gameObject.x = dragX;
            gameObject.y = dragY;

        });

        this.input.on('dragend', function (pointer, gameObject) {

            gameObject.clearTint();

        });
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ GameScene, UIScene ]
};

var game = new Phaser.Game(config);
