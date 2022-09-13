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
    this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
    this.load.image('test', 'assets/sprites/128x128.png');
}

function create ()
{
    var graphics = this.add.graphics();

    graphics.setTexture('metal', null, 2);

    graphics.fillStyle(0x00ff00);
    graphics.fillTriangle(200, 200, 400, 50, 500, 300);

    graphics.setTexture('test', null, 2);

    graphics.fillStyle(0xff0000);
    graphics.fillTriangle(60, 500, 60, 200, 500, 500);
}
