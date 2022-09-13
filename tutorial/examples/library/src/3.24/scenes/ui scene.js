var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function ()
    {
        this.load.image('bg', 'assets/skies/sky4.png');
        this.load.image('crate', 'assets/sprites/crate.png');
    },

    create: function ()
    {
        this.add.image(400, 300, 'bg');

        for (var i = 0; i < 64; i++)
        {
            var x = Phaser.Math.Between(0, 800);
            var y = Phaser.Math.Between(0, 600);

            var box = this.add.image(x, y, 'crate');

            //  Make them all input enabled
            box.setInteractive();
        }

        this.input.on('gameobjectup', this.clickHandler, this);
    },

    clickHandler: function (pointer, box)
    {
        //  Disable our box
        box.input.enabled = false;
        box.setVisible(false);

        //  Dispatch a Scene event
        this.events.emit('addScore');
    }

});

var UIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'UIScene', active: true });

        this.score = 0;
    },

    create: function ()
    {
        //  Our Text object to display the Score
        var info = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#000000' });

        //  Grab a reference to the Game Scene
        var ourGame = this.scene.get('GameScene');

        //  Listen for events from it
        ourGame.events.on('addScore', function () {

            this.score += 10;

            info.setText('Score: ' + this.score);

        }, this);
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
