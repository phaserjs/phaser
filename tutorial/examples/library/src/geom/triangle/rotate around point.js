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

var triangles;
var points;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaaaa00 }, fillStyle: { color: 0x0000aa } });

    triangles = [
        Phaser.Geom.Triangle.BuildRight(175, 450, 50, 250),
        Phaser.Geom.Triangle.BuildRight(375, 450, 50, 250),
        Phaser.Geom.Triangle.BuildRight(575, 450, 50, 250),
        Phaser.Geom.Triangle.BuildEquilateral(400, 70, 50),
        Phaser.Geom.Triangle.BuildEquilateral(400, 70, 50),
        Phaser.Geom.Triangle.BuildEquilateral(400, 70, 50),
    ];

    points = [
        Phaser.Geom.Triangle.Centroid(triangles[0]),
        Phaser.Geom.Triangle.CircumCenter(triangles[1]),
        Phaser.Geom.Triangle.InCenter(triangles[2])
    ];

    Phaser.Geom.Triangle.Decompose(triangles[3], points);

}

function update ()
{

    graphics.clear();

    for(var i = 0; i < triangles.length; i++)
    {
        Phaser.Geom.Triangle.RotateAroundPoint(triangles[i], points[i], 0.02);

        graphics.strokeTriangleShape(triangles[i]);

        graphics.fillPointShape(points[i], 10);
    }
}
