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
    var graphics = this.add.graphics({ fillStyle: { color: 0x2266aa } });

    this.input.on('pointermove', function(pointer) {
        redraw(1.01 + pointer.x / 800, 1.01 + pointer.y / 600);
    });

    redraw(1.2, 1.2);

    function redraw(divX, divY)
    {
        graphics.clear();

        var point = new Phaser.Geom.Point(800, 600);

        while(point.x > 10 || point.y > 10)
        {
            graphics.fillPointShape(point, 20);

            Phaser.Geom.Point.Divide(point, divX, divY);
        }
    }
}
