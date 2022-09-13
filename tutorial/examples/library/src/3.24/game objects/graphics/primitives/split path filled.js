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

    graphics.beginPath();

    graphics.moveTo(200, 200);
    graphics.lineTo(300, 300);
    graphics.lineTo(200, 400);
    graphics.lineTo(200, 200);

    graphics.moveTo(500, 200);
    graphics.lineTo(600, 300);
    graphics.lineTo(500, 400);
    graphics.lineTo(500, 200);

    graphics.fillPath();
}
