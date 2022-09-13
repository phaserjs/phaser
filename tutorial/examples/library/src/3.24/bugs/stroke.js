var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

var graphics;

function create ()
{
    graphics = this.add.graphics();

    graphics.lineStyle(8, 0xffff00, 1);

    // graphics.strokeRoundedRect(100, 100, 300, 200, 32);

    var x = 100;
    var y = 100;
    var width = 300;
    var height = 200;
    var radius = 32;
    var tau = Math.PI * 0.5;

    var tl = radius;
    var tr = radius;
    var bl = radius;
    var br = radius;

    // graphics.beginPath();

    graphics.moveTo(x + tl, y);
    graphics.lineTo(x + width - tr, y);

    graphics.arc(x + width - tr, y + tr, tr, -tau, 0);

    graphics.strokePath();
}
