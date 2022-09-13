var config = {
    type: Phaser.AUTO,
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

    //  Create an arc shape Graphics object
    shape.fillStyle(0xffffff);

    shape.slice(400, 300, 200, Phaser.Math.DegToRad(340), Phaser.Math.DegToRad(30), true);

    shape.fillPath();

    var mask = shape.createGeometryMask();

    image.setMask(mask);

    this.input.on('pointermove', function (pointer) {

        shape.x = pointer.x - 400;
        shape.y = pointer.y - 300;

    });
}
