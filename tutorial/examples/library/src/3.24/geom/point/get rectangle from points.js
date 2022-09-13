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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x2266aa }, fillStyle: { color: 0x2266aa } });

    var points = [
        new Phaser.Geom.Point(Math.random() * 400 + 200, Math.random() * 300 + 150),
        new Phaser.Geom.Point(Math.random() * 400 + 200, Math.random() * 300 + 150),
        new Phaser.Geom.Point(Math.random() * 400 + 200, Math.random() * 300 + 150)
    ];

    this.input.on('pointermove', function(pointer) {

        Phaser.Geom.Point.CopyFrom(pointer, points[0]);

        redraw();
    });

    this.input.on('pointerdown', function(pointer) {

        points.push(new Phaser.Geom.Point(pointer.x, pointer.y));

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        var rect = Phaser.Geom.Point.GetRectangleFromPoints(points);

        graphics.strokeRectShape(rect);

        for(var i = 0; i < points.length; i++)
        {
            graphics.fillPointShape(points[i], 5);
        }
    }
}
