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

    graphics.fillGradientStyle(0xff0000, 0x00ff00, 0xff0000, 0xffff00, 1);

    graphics.beginPath();

    graphics.moveTo(400, 100);
    graphics.lineTo(200, 278);
    graphics.lineTo(340, 430);
    graphics.lineTo(650, 300);
    graphics.lineTo(700, 180);
    graphics.lineTo(600, 80);

    graphics.closePath();
    graphics.fillPath();
}
