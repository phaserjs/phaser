var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(100, 100, 256, 256);

    graphics.fillStyle(0xff0000, 0.5);
    graphics.fillRect(250, 200, 400, 256);
}
