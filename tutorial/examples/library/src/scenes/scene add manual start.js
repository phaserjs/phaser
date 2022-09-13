var MyGame = {};

MyGame.Boot = function ()
{
    this.face = null;
};

MyGame.Boot.prototype.constructor = MyGame.Boot;

MyGame.Boot.prototype = {

    preload: function ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
    },

    create: function ()
    {
        this.face = this.add.image(400, 300, 'face');
    }

};

var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

game.scene.add('Boot', MyGame.Boot);

game.scene.start('Boot');
