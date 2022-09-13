var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var tilesprite;
var tween;
var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tilesprite', 'assets/pics/alex-bisleys-horsy-512x512.png');
}

function create ()
{
    //  If you pass zero as the width and height it'll create a TileSprite
    //  the same size as the frame it uses
    tilesprite = this.add.tileSprite(400, 300, 0, 0, 'tilesprite');

    tween = this.tweens.addCounter({
        from: 1,
        to: 2,
        duration: 5000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    tilesprite.tilePositionX = Math.cos(iter) * 700;
    tilesprite.tilePositionY = Math.sin(iter) * 500;

    tilesprite.tileScaleX = tween.getValue();
    tilesprite.tileScaleY = tween.getValue();

    iter += 0.01;
}
