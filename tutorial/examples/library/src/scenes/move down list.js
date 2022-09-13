var DemoA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function DemoA ()
    {
        Phaser.Scene.call(this, { key: 'demoA', active: true });
    },

    preload: function ()
    {
        this.load.image('picA', 'assets/pics/lance-overdose-loader-eye.png');
    },

    create: function ()
    {
        this.add.image(400, 300, 'picA');

        this.input.on('pointerup', function () {

            this.scene.moveDown();

        }, this);
    }

});

var DemoB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function DemoB ()
    {
        Phaser.Scene.call(this, { key: 'demoB', active: true });
    },

    preload: function ()
    {
        this.load.image('picB', 'assets/pics/sukasuka-chtholly.png');
    },

    create: function ()
    {
        this.add.image(400, 500, 'picB');
    }

});

var DemoC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function DemoC ()
    {
        Phaser.Scene.call(this, { key: 'demoC', active: true });
    },

    preload: function ()
    {
        this.load.image('picC', 'assets/pics/titan-mech.png');
    },

    create: function ()
    {
        this.add.image(300, 300, 'picC');
    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ DemoB, DemoC, DemoA ]
};

var game = new Phaser.Game(config);
