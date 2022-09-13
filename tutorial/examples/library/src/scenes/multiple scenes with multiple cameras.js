var Background = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Background ()
    {
        Phaser.Scene.call(this, { key: 'background', active: true });

        this.image;
    },

    preload: function ()
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    },

    create: function ()
    {
        this.image = this.add.image(200, 150, 'einstein');

        this.cameras.main.setSize(400, 300);

        this.cameras.add(400, 0, 400, 300);
        this.cameras.add(0, 300, 400, 300);
        this.cameras.add(400, 300, 400, 300);
    },

    update: function ()
    {
        this.image.rotation += 0.01;
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
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ Background, Demo ]
};

var game = new Phaser.Game(config);
