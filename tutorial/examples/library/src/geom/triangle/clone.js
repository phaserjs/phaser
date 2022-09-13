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
var triangle;
var triangles;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaaaa00, alpha: 0.6 } });

    triangle = new Phaser.Geom.Triangle.BuildEquilateral(200, 50, 200);

    triangles = [];
}

function update ()
{
    Phaser.Geom.Triangle.Rotate(triangle, 0.04);

    triangles.push(Phaser.Geom.Triangle.Clone(triangle));

    graphics.clear();

    graphics.strokeTriangleShape(triangle);

    for(var i = 0; i < triangles.length; i++)
    {
        Phaser.Geom.Triangle.Offset(triangles[i], 3, 1.5);

        if(triangles[i].left > 800)
        {
            triangles.splice(i--, 1);
        }
        else
        {
            graphics.strokeTriangleShape(triangles[i]);
        }
    }
}
