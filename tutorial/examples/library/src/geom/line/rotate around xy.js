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
var x;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    line = new Phaser.Geom.Line(100, 300, 400, 300);

    this.input.on('pointermove', function(pointer) {

        x = pointer.x / 800;

    });
}

function update ()
{
    graphics.clear();

    Phaser.Geom.Line.RotateAroundXY(line, line.x1, line.y2, 0.03);

    graphics.strokeLineShape(line);
}
