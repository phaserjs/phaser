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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } });

    var triangle = new Phaser.Geom.Triangle.BuildRight(200, 400, 300, 200);

    graphics.strokeTriangleShape(triangle);
}
