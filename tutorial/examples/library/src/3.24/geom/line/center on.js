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

    line = new Phaser.Geom.Line(300, 300, 400, 300);

    this.input.on('pointermove', function(pointer) {

        Phaser.Geom.Line.CenterOn(line, pointer.x, pointer.y);

    });
}

function update ()
{
    Phaser.Geom.Line.Rotate(line, 0.02);

    graphics.clear();

    graphics.strokeLineShape(line);
}
