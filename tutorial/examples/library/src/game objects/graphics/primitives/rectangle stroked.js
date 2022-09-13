var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('metal', 'assets/textures/alien-metal.jpg');
    this.load.image('bunny', 'assets/sprites/bunny.png');
}

function create ()
{
    var graphics = this.add.graphics();

    graphics.setTexture('metal');

    graphics.lineStyle(1, 0x00ff00, 1);
    graphics.strokeRect(100, 100, 256, 256);

    graphics.lineStyle(1, 0xff0000, 0.5);
    graphics.strokeRect(250, 200, 400, 256);
}
