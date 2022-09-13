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

    //  Create a hash shape Graphics object
    shape.fillStyle(0xffffff);

    //  You have to begin a path for a Geometry mask to work
    shape.beginPath();

    shape.fillRect(50, 0, 50, 300);
    shape.fillRect(175, 0, 50, 300);
    shape.fillRect(0, 75, 275, 50);
    shape.fillRect(0, 200, 275, 50);

    var mask = shape.createGeometryMask();

    image.setMask(mask);

    this.input.on('pointermove', function (pointer) {

        shape.x = pointer.x - 140;
        shape.y = pointer.y - 140;

    });
}
