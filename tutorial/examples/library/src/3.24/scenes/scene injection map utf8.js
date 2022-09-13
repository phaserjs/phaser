var MyScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MyScene ()
    {
        var config = {
            map: {
                add: '加',
                load: '加载'
            }
        };

        Phaser.Scene.call(this, config)
    },

    preload: function ()
    {
        this.加载.image('face', 'assets/pics/bw-face.png');
    },

    create: function ()
    {
        this.加.image(400, 300, 'face');
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: MyScene
};

var game = new Phaser.Game(config);
