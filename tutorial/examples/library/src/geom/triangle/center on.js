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

    var triangle = Phaser.Geom.Triangle.BuildEquilateral(400, 300, 150);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Triangle.Rotate(triangle, 0.05);

        Phaser.Geom.Triangle.CenterOn(triangle, pointer.x, pointer.y);

        redraw();
    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.fillTriangleShape(triangle);
    }
}