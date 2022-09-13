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

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa, alpha: 0.6 } });

    line = new Phaser.Geom.Line(100, 300, 400, 300);

    lines = [];
}

function update ()
{
    Phaser.Geom.Line.Rotate(line, 0.03);

    lines.push(Phaser.Geom.Line.Clone(line));

    graphics.clear();

    graphics.strokeLineShape(line);

    for(var i = 0; i < lines.length; i++)
    {
        Phaser.Geom.Line.Offset(lines[i], 3, 0);

        if(lines[i].left > 800)
        {
            lines.splice(i--, 1);
        }
        else
        {
            graphics.strokeLineShape(lines[i]);
        }

    }

}
