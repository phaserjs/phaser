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
var polygon;
var points;
var radius = 100;
var angle = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa6622 } });

    polygon = new Phaser.Geom.Polygon();

    points = [];
}

function update ()
{
    if(angle <= Math.PI * 2)
    {
        angle += Math.PI / 30;
        var leafSize = 150 * Math.sin((angle * 2) % Math.PI);

        points.push(400 + Math.cos(angle) * (radius + leafSize));
        points.push(300 + Math.sin(angle) * (radius + leafSize));

        polygon.setTo(points);

        graphics.clear();

        graphics.strokePoints(polygon.points);
    }
}
