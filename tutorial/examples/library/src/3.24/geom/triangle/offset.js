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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaaaa00 } });

    var triangle = Phaser.Geom.Triangle.BuildEquilateral(100, 225, 150);

    for(var angle = 0; triangle.left < 800; angle += Math.PI / 18) {

        graphics.strokeTriangleShape(triangle);

        Phaser.Geom.Triangle.Offset(triangle, 20, Math.cos(angle) * 40);
    }
}
