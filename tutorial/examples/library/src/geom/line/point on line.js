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

function create ()
{
    var graphics = this.add.graphics();

    var line = new Phaser.Geom.Line(200, 300, 700, 100);

    graphics.lineStyle(1, 0x00aa00);

    graphics.strokeLineShape(line);

    var x = line.x1 + (line.x2 - line.x1) * 0.1;
    var y = line.y1 + (line.y2 - line.y1) * 0.1;

    graphics.fillStyle(0xff0000);

    graphics.fillRect(x, y, 6, 6);
}
