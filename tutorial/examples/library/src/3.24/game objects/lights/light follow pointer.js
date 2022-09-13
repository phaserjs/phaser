var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var game = new Phaser.Game(config);

var offsets = [];
var brick;
var light;
var text;
var time = 0.0;

function preload ()
{
    this.load.image('brick', ['assets/normal-maps/brick.jpg', 'assets/normal-maps/brick_n.png']);
    this.load.image('phaser', 'assets/sprites/phaser2.png');
}

function create ()
{
    brick = this.add.sprite(0, 0, 'brick');
    brick.setOrigin(0.0);
    brick.setPipeline('Light2D');

    light = this.lights.addLight(0, 0, 200).setScrollFactor(0.0).setIntensity(2);

    this.lights.enable().setAmbientColor(0x555555);

    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });

    var scene = this;

    this.input.on('pointerdown', function (pointer) {

        if (scene.lights.active)
        {
            scene.lights.disable();
        }
        else
        {
            scene.lights.enable();
        }

    });

    this.add.image(300, 400, 'phaser').setPipeline('Light2D');

    text = this.add.text(0, 0, 'visible lights: 0').setScrollFactor(0);

    this.lights.addLight(0, 100, 100).setColor(0xff0000).setIntensity(3.0);
    this.lights.addLight(0, 200, 100).setColor(0x00ff00).setIntensity(3.0);
    this.lights.addLight(0, 300, 100).setColor(0x0000ff).setIntensity(3.0);
    this.lights.addLight(0, 400, 100).setColor(0xffff00).setIntensity(3.0);

    offsets = [Math.random()+ 1 - 2, Math.random()+ 1 - 2, Math.random()+ 1 - 2, Math.random()+ 1 - 2];
}

function update ()
{
    text.setText('visible lights: ' + this.lights.culledLights.length);

    var index = 0;

    this.lights.forEachLight(function (currLight) {
        if (light !== currLight)
        {
            currLight.x = 400 + Math.sin(offsets[index]) * 1000;
            offsets[index] += 0.02;
            index += 1;
        }
    });

    this.cameras.main.scrollX = Math.sin(time) * 400;

    time += 0.01;
}
