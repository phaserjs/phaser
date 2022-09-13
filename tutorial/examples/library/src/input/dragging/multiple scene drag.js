var Boot = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Boot ()
    {
        Phaser.Scene.call(this, { key: 'boot', active: true });
    },

    preload: function ()
    {
        this.load.image('atari1', 'assets/sprites/atari400.png');
        this.load.image('atari2', 'assets/sprites/atari1200xl.png');
    },

    create: function ()
    {
        this.scene.start('sceneA');
        this.scene.launch('sceneB');
    }

});

var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });
    },

    create: function ()
    {
        var image = this.add.sprite(200, 300, 'atari1').setInteractive();

        this.input.setDraggable(image);

        image.on('dragstart', function (pointer) {

            this.setTint(0xff0000);

        });

        image.on('drag', function (pointer, dragX, dragY) {

            this.x = dragX;
            this.y = dragY;

        });

        image.on('dragend', function (pointer) {

            this.clearTint();

        });
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB' });
    },

    create: function ()
    {
        var image = this.add.sprite(600, 300, 'atari2').setInteractive();

        this.input.setDraggable(image);

        image.on('dragstart', function (pointer) {

            this.setTint(0xff0000);

        });

        image.on('drag', function (pointer, dragX, dragY) {

            this.x = dragX;
            this.y = dragY;

        });

        image.on('dragend', function (pointer) {

            this.clearTint();

        });
    }

});

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Boot, SceneA, SceneB ]
};

var game = new Phaser.Game(config);
