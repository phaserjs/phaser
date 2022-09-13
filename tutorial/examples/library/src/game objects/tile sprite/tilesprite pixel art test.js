var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var tilesprite;
var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom16x16.png');
}

function create ()
{
    tilesprite = this.add.tileSprite(400, 300, 800, 600, 'mushroom');
}

function update ()
{
    tilesprite.rotation -= 0.01;

    tilesprite.tileScaleX = Math.sin(iter) * 10;
    tilesprite.tileScaleY = Math.sin(iter) * 10;

    iter += 0.01;
}
