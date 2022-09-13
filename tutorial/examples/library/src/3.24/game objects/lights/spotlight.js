var config = {
    type: Phaser.WEBGL,
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
    this.load.image('robot', [ 'assets/pics/equality-by-ragnarok.png', 'assets/normal-maps/equality-by-ragnarok_n.png' ]);
    this.load.image('atari', 'assets/sprites/atari400.png');
}

function create ()
{
    //  Enable lights and set a dark ambient color
    this.lights.enable().setAmbientColor(0x333333);

    //  Add an image and set it to use Lights2D
    var robot = this.add.image(-100, 0, 'robot').setOrigin(0).setScale(0.7);

    robot.setPipeline('Light2D');

    //  Our spotlight. 100px radius and white in color.
    var light = this.lights.addLight(180, 80, 200).setColor(0xffffff).setIntensity(2);

    //  Track the pointer
    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });
}