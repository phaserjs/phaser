var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', ['assets/textures/gold.png', 'assets/textures/gold-n.png']);
    this.load.spritesheet('face', [ 'assets/sprites/metalface78x92.png', 'assets/sprites/metalface78x92-n.png' ], { frameWidth: 78, frameHeight: 92 });
}

function create ()
{
    this.lights.enable();
    this.lights.setAmbientColor(0x555555);

    this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.5);

    this.add.image(200, 300, 'face', 0).setPipeline('Light2D');
    this.add.image(300, 300, 'face', 1).setPipeline('Light2D');
    this.add.image(400, 300, 'face', 2).setPipeline('Light2D');
    this.add.image(500, 300, 'face', 3).setPipeline('Light2D');

    var light = this.lights.addLight(400, 300, 200).setIntensity(2);

    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });
}
