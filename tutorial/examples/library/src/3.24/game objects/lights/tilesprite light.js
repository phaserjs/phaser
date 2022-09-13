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

var tilesprite;

function preload ()
{
    this.load.image('brick', ['assets/normal-maps/brick.jpg', 'assets/normal-maps/brick_n.png']);
    this.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
}

function create ()
{
    tilesprite = this.add.tileSprite(400, 300, 800, 600, 'brick').setPipeline('Light2D');

    this.add.sprite(680, 600, 'sonic').setOrigin(0.5, 1);

    this.lights.enable();
    this.lights.setAmbientColor(0x808080);

    var spotlight = this.lights.addLight(400, 300, 280).setIntensity(3);

    this.input.on('pointermove', function (pointer) {

        spotlight.x = pointer.x;
        spotlight.y = pointer.y;

    });

    var colors = [
        0xffffff, 0xff0000, 0x00ff00, 0x00ffff, 0xff00ff, 0xffff00
    ];

    var currentColor = 0;

    this.input.on('pointerdown', function (pointer) {

        currentColor++;

        if (currentColor === colors.length)
        {
            currentColor = 0;
        }

        spotlight.setColor(colors[currentColor]);

    });
}

function update ()
{
    tilesprite.tilePositionX += 0.3;
    tilesprite.tilePositionY += 0.6;
}
