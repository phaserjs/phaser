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

    graphics.fillStyle(0x00ff00, 1);
    graphics.setTexture('metal');

    graphics.fillCircle(400, 300, 128);
}
