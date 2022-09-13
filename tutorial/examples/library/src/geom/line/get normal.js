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
var normal;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa, alpha: 0.6 } });

    line = new Phaser.Geom.Line(390, 300, 410, 300);

    // if we omit a parameter, new Point instance will be created and returned
    normal = Phaser.Geom.Line.GetNormal(line);
}

function update ()
{
    if(line.y2 > -150)
    {
        graphics.strokeLineShape(line);

        // normal is a directly perpendicular vector to supplied line

        // this moves the second line point 15px away in perpendicular direction

        line.x2 += normal.x * 15;
        line.y2 += normal.y * 15;

        // we can also supply an instance of Point that will be modified
        Phaser.Geom.Line.GetNormal(line, normal);
    }
}
