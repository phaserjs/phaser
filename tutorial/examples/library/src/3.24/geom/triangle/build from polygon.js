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
    var graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00, alpha: 1 }, x: 64, y: 64 });

    var poly = [0,0, 400,0, 400,400, 0,400]; // rectangle

    var triangles = new Phaser.Geom.Triangle.BuildFromPolygon(poly);

    for (var i = 0; i < triangles.length; i++)
    {
        graphics.strokeTriangleShape(triangles[i]);
    }
}
