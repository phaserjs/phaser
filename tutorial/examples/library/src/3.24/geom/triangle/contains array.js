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
    var graphics = this.add.graphics({ fillStyle: { color: 0xaaaa00 } });

    var triangle1 = new Phaser.Geom.Triangle.BuildEquilateral(400, 25, 300);
    var triangle2 = new Phaser.Geom.Triangle.BuildEquilateral(250, 285, 300);
    var triangle3 = new Phaser.Geom.Triangle.BuildEquilateral(550, 285, 300);

    var circle = new Phaser.Geom.Circle(400, 300, 20);

    var points = [];

    while(circle.diameter < 800)
    {
        circle.getPoints(null, 15, points);

        circle.radius += 15;
    }

    var filteredPoints = [];

    Phaser.Geom.Triangle.ContainsArray(triangle1, points, false, filteredPoints);
    Phaser.Geom.Triangle.ContainsArray(triangle2, points, false, filteredPoints);
    Phaser.Geom.Triangle.ContainsArray(triangle3, points, false, filteredPoints);

    for(var i = 0; i < filteredPoints.length; i++)
    {
        graphics.fillCircle(filteredPoints[i].x, filteredPoints[i].y, 7.5);
    }
}
