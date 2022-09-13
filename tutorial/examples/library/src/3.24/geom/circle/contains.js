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
    var graphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });

    var circle = new Phaser.Geom.Circle(400, 300, 200);

    graphics.fillCircleShape(circle);

    this.input.on('pointermove', function (pointer) {

        graphics.clear();

        if(circle.contains(pointer.x, pointer.y))
        {
            graphics.fillStyle(0x00ff00);
        }
        else
        {
            graphics.fillStyle(0xff0000);
        }

        graphics.fillCircleShape(circle);

    });
}