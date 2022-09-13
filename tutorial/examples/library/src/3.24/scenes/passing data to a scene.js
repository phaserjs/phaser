var Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Menu ()
    {
        Phaser.Scene.call(this, 'menu');
    },

    create: function ()
    {
        this.add.text(10, 10, 'Press 1, 2 or 3', { font: '16px Courier', fill: '#00ff00' });

        this.input.keyboard.once('keyup_ONE', function () {

            this.scene.start('demo', { id: 0, image: 'acryl-bladerunner.png' });

        }, this);

        this.input.keyboard.once('keyup_TWO', function () {

            this.scene.start('demo', { id: 1, image: 'babar-phaleon-coco.png' });

        }, this);

        this.input.keyboard.once('keyup_THREE', function () {

            this.scene.start('demo', { id: 2, image: 'babar-pym-wait.png' });

        }, this);

        this.events.on('shutdown', this.shutdown, this);
    },

    shutdown: function ()
    {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        this.input.keyboard.shutdown();
    }

});

var Demo = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Demo ()
    {
        Phaser.Scene.call(this, { key: 'demo' });
    },

    init: function (data)
    {
        console.log('init', data);

        this.imageID = data.id;
        this.imageFile = data.image;
    },

    preload: function ()
    {
        this.load.image('pic' + this.imageID, 'assets/pics/' + this.imageFile);
    },

    create: function ()
    {
        this.add.text(10, 10, 'Click to Return', { font: '16px Courier', fill: '#00ff00' });

        this.add.image(400, 300, 'pic' + this.imageID).setScale(2);

        this.input.once('pointerup', function () {

            this.scene.start('menu');

        }, this);
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d8d',
    pixelArt: true,
    parent: 'phaser-example',
    scene: [ Menu, Demo ]
};

var game = new Phaser.Game(config);
