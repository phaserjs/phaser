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

var blitter;
var gravity = 0.5;
var idx = 1;
var frame = 'veg01';
var numbers = [];
var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', ['assets/textures/gold.png', 'assets/textures/gold-n.png']);

    this.load.atlas({
        key: 'atlas',
        textureURL: 'assets/tests/fruit/veg2.png',
        normalMap: 'assets/tests/fruit/veg2-n.png',
        atlasURL: 'assets/tests/fruit/veg2.json'
    });
}

function launch ()
{
    //  Max of 1000 lit objects
    if (blitter.children.list.length >= 1000)
    {
        return;
    }

    idx++;

    if (idx === 38)
    {
        idx = 1;
    }

    if (idx < 10)
    {
        frame = 'veg0' + idx.toString();
    }
    else
    {
        frame = 'veg' + idx.toString();
    }

    var bob = blitter.create(0, 0, frame);

    bob.data.vx = Math.random() * 6;
    bob.data.vy = Math.random() * 2;
    bob.data.bounce = 1;
}

function create ()
{
    this.lights.enable();
    this.lights.setAmbientColor(0x808080);

    this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.5);

    blitter = this.add.blitter(0, 0, 'atlas').setPipeline('Light2D');

    for (var i = 0; i < 32; i++)
    {
        launch();
    }

    var light = this.lights.addLight(400, 300, 400);

    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });
}

function update()
{
    if (this.input.activePointer.isDown)
    {
        for (var i = 0; i < 8; i++)
        {
            launch();
        }
    }

    for (var index = 0, length = blitter.children.list.length; index < length; ++index)
    {
        var bob = blitter.children.list[index];

        bob.data.vy += gravity;

        bob.y += bob.data.vy;
        bob.x += bob.data.vx;

        if (bob.x > 780)
        {
            bob.x = 780;
            bob.data.vx *= -bob.data.bounce;
        }
        else if (bob.x < 0)
        {
            bob.x = 0;
            bob.data.vx *= -bob.data.bounce;
        }

        if (bob.y > 568)
        {
            bob.y = 568;
            bob.data.vy *= -bob.data.bounce;
        }
    }
}
