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
    graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaaaa00 } });

    pointerTriangle = new Phaser.Geom.Triangle.BuildEquilateral(100, 100, 150);

    triangles = [];

    for(var i = 0; i < 45; i++)
    {
        triangles.push(new Phaser.Geom.Triangle());
    }

    var i = 0;

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Triangle.CenterOn(pointerTriangle, pointer.x, pointer.y);

        Phaser.Geom.Triangle.CopyFrom(pointerTriangle, triangles[i]);

        i = (i + 1) % triangles.length;

        graphics.clear();

        graphics.strokeTriangleShape(pointerTriangle);

        for(var j = 0; j < triangles.length; j++)
        {
            Phaser.Geom.Triangle.Rotate(triangles[j], 0.15);

            graphics.strokeTriangleShape(triangles[j]);
        }
    });
}
