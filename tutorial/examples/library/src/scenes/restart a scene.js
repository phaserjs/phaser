var MyGame = {};

MyGame.Boot = function ()
{
};

MyGame.Boot.prototype.constructor = MyGame.Boot;

MyGame.Boot.prototype = {

    preload: function ()
    {
        this.load.image('rick', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
    },

    create: function ()
    {
        this.cameras.main.fadeFrom(2000, Phaser.Math.Between(50, 255), Phaser.Math.Between(50, 255), Phaser.Math.Between(50, 255));

        this.add.image(400, 300, 'rick').setScale(0.7);

        this.cameras.main.on('camerafadeoutcomplete', function () {

            this.scene.restart();

        }, this);

        //  Every time you click, fade the camera

        this.input.once('pointerdown', function () {

            //  Get a random color
            var red = Phaser.Math.Between(50, 255);
            var green = Phaser.Math.Between(50, 255);
            var blue = Phaser.Math.Between(50, 255);

            this.cameras.main.fade(2000, red, green, blue);

        }, this);
    }

};

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

game.scene.add('Boot', MyGame.Boot, true);
