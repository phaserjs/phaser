var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'SceneA' });
    },

    preload: function ()
    {
        this.load.image('box', 'assets/sprites/128x128-v2.png');
    },

    create: function ()
    {
        // this.input.setGlobalTopOnly(true);
        // this.input.setTopOnly(true);

        this.add.text(100, 100, 'SceneA');

        var image = this.add.image(100, 300, 'box').setInteractive();

        image.on('pointerdown', function () {

            image.tint = Math.random() * 0xffffff;

        });

        this.scene.launch('SceneB');
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'SceneB' });
    },

    preload: function ()
    {
        this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
    },

    create: function ()
    {
        this.add.text(300, 100, 'SceneB');

        var image = this.add.sprite(300, 300, 'eye').setInteractive();

        image.on('pointerdown', function () {

            image.tint = Math.random() * 0xffffff;

        });

        this.scene.launch('SceneC');
    }

});

var SceneC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneC ()
    {
        Phaser.Scene.call(this, { key: 'SceneC' });
    },

    preload: function ()
    {
        this.load.image('asuna', 'assets/sprites/asuna_by_vali233.png');
    },

    create: function ()
    {
        this.add.text(500, 100, 'SceneC');

        var image = this.add.sprite(500, 300, 'asuna').setInteractive();

        image.on('pointerdown', function () {

            image.tint = Math.random() * 0xffffff;

        });
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ SceneA, SceneB, SceneC ]
};

var game = new Phaser.Game(config);
