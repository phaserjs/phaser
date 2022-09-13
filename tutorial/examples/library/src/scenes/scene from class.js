var MyScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MyScene (config)
    {
        Phaser.Scene.call(this, config)
    },

    preload: function ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
    },

    create: function ()
    {
        this.face = this.add.image(400, 300, 'face');
    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: MyScene
};

var game = new Phaser.Game(config);
