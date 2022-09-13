var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    backgroundColor: '#118eb3',
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    graphics.lineStyle(20, 0x2ECC40);

    graphics.strokeRect(50, 50, 100, 40);

    graphics.strokeCircle(600, 400, 64);

    graphics.beginPath();

    graphics.moveTo(400, 100);
    graphics.lineTo(200, 278);
    graphics.lineTo(340, 430);
    graphics.lineTo(650, 80);

    graphics.closePath();
    graphics.strokePath();
}
