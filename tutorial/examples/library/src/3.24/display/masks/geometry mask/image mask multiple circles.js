var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
}

function create ()
{
    var image = this.add.image(400, 300, 'pic');

    var shape = this.make.graphics();

    shape.fillStyle(0xffffff);

    shape.beginPath();

    shape.moveTo(-240, 0);
    shape.arc(-240, 0, 250, 0, Math.PI * 2);
    shape.moveTo(240, 0);
    shape.arc(240, 0, 250, 0, Math.PI * 2);

    shape.fillPath();

    var mask = shape.createGeometryMask();

    image.setMask(mask);

    this.input.on('pointermove', function (pointer) {

        shape.x = pointer.x;
        shape.y = pointer.y;

    });
}
