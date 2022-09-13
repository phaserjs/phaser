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
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaaaa00 } });

    triangle = new Phaser.Geom.Triangle.BuildEquilateral(400, 25, 300);

    var points = Phaser.Geom.Triangle.Decompose(triangle);

    var angle = 0;

    while(angle < Math.PI * 2)
    {
        Phaser.Geom.Triangle.Offset(triangle, Math.cos(angle) * 15, Math.sin(angle) * 15);

        Phaser.Geom.Triangle.Rotate(triangle, Math.PI / 20);

        Phaser.Geom.Triangle.Decompose(triangle, points);

        angle += Math.PI / 20;
    }

    graphics.strokePoints(points);

}
