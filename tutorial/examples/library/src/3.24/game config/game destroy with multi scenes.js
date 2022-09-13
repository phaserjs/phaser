var Background = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Background ()
    {
        Phaser.Scene.call(this, { key: 'background', active: true });
    },

    preload: function ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
        this.load.image('arrow', 'assets/sprites/longarrow.png');
    },

    create: function ()
    {
        this.face = this.add.image(400, 300, 'face');

        this.arrow = this.add.image(300, 300, 'arrow').setOrigin(0, 0.5);

        this.input.on('pointerdown', function () {

            this.sys.game.destroy(true);

            document.addEventListener('mousedown', function newGame () {

                game = new Phaser.Game(config);

                document.removeEventListener('mousedown', newGame);

            });

        }, this);
    },

    update: function (time, delta)

    {
        this.arrow.rotation += 0.01;
    }

});

var Demo = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Demo ()
    {
        Phaser.Scene.call(this, { key: 'demo', active: true });
    },

    preload: function ()
    {
        this.load.image('arrow', 'assets/sprites/longarrow.png');
    },

    create: function ()
    {
        this.arrow = this.add.image(400, 300, 'arrow').setOrigin(0, 0.5);
    },

    update: function (time, delta)
    {
        this.arrow.rotation += 0.01;
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ Background, Demo ]
};

var game = new Phaser.Game(config);
