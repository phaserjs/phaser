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
    this.load.image({
        key: 'robot', 
        url: 'assets/pics/equality-by-ragnarok.png',
        normalMap: 'assets/normal-maps/equality-by-ragnarok_n.png'
    });
}

function create ()
{
    this.add.image(-300, 0, 'robot').setOrigin(0).setPipeline('Light2D');

    var light  = this.lights.addLight(0, 0, 200);

    this.lights.enable().setAmbientColor(0x555555);

    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });
}
