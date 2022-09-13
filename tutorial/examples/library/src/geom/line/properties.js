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
    var line = new Phaser.Geom.Line(100, 500, 700, 100);

    var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });
    graphics.strokeLineShape(line);

    graphics.lineStyle(2, 0x00aa00);

    graphics.beginPath();
    graphics.moveTo(line.left, line.top);
    graphics.lineTo(line.right, line.top);
    graphics.lineTo(line.right, line.bottom);
    graphics.lineTo(line.left, line.bottom);
    graphics.lineTo(line.left, line.top);
    graphics.strokePath();

    graphics.lineStyle(2, 0xaa0000);

    graphics.lineBetween(line.x1, line.y1 + 10, line.x2, line.y1 + 10);

    graphics.lineBetween(line.x1 - 10, line.y1, line.x1 - 10, line.y2);

}
