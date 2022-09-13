var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var graphics;
var line;
var text;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    line = new Phaser.Geom.Line(200, 300, 600, 300);

    text = this.add.text(100, 50, '');
}

function update ()
{
    Phaser.Geom.Line.Rotate(line, 0.02);

    graphics.clear();

    graphics.strokeLineShape(line);

    var angle = Phaser.Geom.Line.Angle(line);

    text.setText('Line Angle: ' + Phaser.Math.RadToDeg(angle));
}
