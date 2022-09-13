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
    this.load.image('test', 'assets/sprites/128x128.png');
}

function create ()
{
    var graphics = this.add.graphics();

    graphics.setTexture('metal', null, 0);

    graphics.fillStyle(0x00ff00);
    graphics.fillTriangle(200, 200, 400, 50, 500, 300);

    graphics.fillStyle(0xff0000);
    graphics.fillTriangle(200, 200, 500, 300, 300, 300);

    graphics.setTexture('test', null, 2);

    graphics.fillStyle(0xff0000);
    graphics.fillTriangle(30, 550, 30, 250, 470, 550);

    graphics.setTexture();

    graphics.fillGradientStyle(0xff0000, 0x00ff00, 0x0000ff, 0xffff00);
    graphics.fillTriangle(650, 50, 550, 400, 750, 400);

    graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00);
    graphics.fillTriangle(600, 450, 700, 450, 650, 550);
}
