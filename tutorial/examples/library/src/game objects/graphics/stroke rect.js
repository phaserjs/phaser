var config = {
    width: 800,
    height: 600,
    type: Phaser.CANVAS,
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

    var color = 0xffff00;
    var thickness = 2;
    var alpha = 1;

    graphics.lineStyle(thickness, color, alpha);

    graphics.strokeRect(32, 32, 256, 256);
}
