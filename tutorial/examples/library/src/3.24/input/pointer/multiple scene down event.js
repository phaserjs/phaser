var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA', active: true });
    },

    preload: function ()
    {
        this.load.image('bg', 'assets/ui/undersea-bg.png');
    },

    create: function ()
    {
        var bg = this.add.image(400, 300, 'bg').setInteractive();

        bg.on('pointerdown', function () {
            console.log('Scene A');
        });
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB', active: true });
    },

    preload: function ()
    {
        this.load.image('up', 'assets/ui/up-bubble.png');
    },

    create: function ()
    {
        var button = this.add.image(400, 300, 'up').setInteractive();

        button.on('pointerdown', function () {
            console.log('Scene B');
        });
    }

});

var SceneC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneC ()
    {
        Phaser.Scene.call(this, { key: 'sceneC', active: true });
    },

    preload: function ()
    {
        this.load.image('down', 'assets/ui/down-bubble.png');
    },

    create: function ()
    {
        var button = this.add.image(500, 300, 'down').setInteractive();

        button.on('pointerdown', function () {
            console.log('Scene C');
        });
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ SceneA, SceneB, SceneC ]
};

var game = new Phaser.Game(config);
