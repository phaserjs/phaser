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

    graphics.fillStyle(0xffffff, 1);
    graphics.fillTriangle(200, 200, 400, 50, 500, 300);

    graphics.fillStyle(0x00ffff, 1);
    graphics.fillTriangle(60, 500, 60, 400, 500, 500);
}
