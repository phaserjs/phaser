var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });
    },

    create: function ()
    {
        var sceneB = this.scene.get('sceneB');

        this.input.on('pointerup', function () {

            var x = Phaser.Math.Between(0, 800);
            var y = Phaser.Math.Between(0, 600);
            var frame = sceneB.getImage();

            this.add.image(x, y, frame);

        }, this);

        this.add.text(10, 10, 'Click to get image', { font: '16px Courier', fill: '#00ff00' }).setDepth(1000);
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB', active: true });

        this.frames;
    },

    preload: function ()
    {
        this.load.setPath('assets/sprites/');

        this.load.image('amiga-cursor');
        this.load.image('aqua_ball');
        this.load.image('asuna_by_vali233');
        this.load.image('atari130xe');
        this.load.image('atari400');
    },

    create: function ()
    {
        this.frames = [ 'amiga-cursor', 'aqua_ball', 'asuna_by_vali233', 'atari130xe', 'atari400' ];
    },

    getImage: function ()
    {
        return Phaser.Math.RND.pick(this.frames);
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ SceneA, SceneB ]
};

var game = new Phaser.Game(config);
