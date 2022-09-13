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
    this.load.image('brick', ['assets/normal-maps/brick.jpg', 'assets/normal-maps/brick_n.png']);
    this.load.image('brush', ['assets/tests/lights/skull.png', 'assets/tests/lights/skull-n.png']);
}

function create ()
{
    brick = this.add.sprite(0, 0, 'brick');
    brick.setOrigin(0.0);
    brick.setPipeline('Light2D');

    var rt = this.add.renderTexture(0, 0, 800, 600).setPipeline('Light2D');

    var brush = this.textures.getFrame('brush');

    light = this.lights.addLight(400, 300, 200).setIntensity(2);

    this.lights.enable().setAmbientColor(0x555555);

    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });

    this.input.on('pointerdown', function (pointer) {

        rt.draw(brush, pointer.x - 60, pointer.y - 80);

    });

    this.add.text(10, 10, 'Click to paint');
}
