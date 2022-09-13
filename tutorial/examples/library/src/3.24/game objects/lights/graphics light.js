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
    this.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    this.load.image('bg', ['assets/textures/gold.png', 'assets/textures/gold-n.png']);
    this.load.image('metal', ['assets/textures/alien-metal.jpg', 'assets/textures/alien-metal-n.jpg']);
    this.load.image('tiles', ['assets/textures/rock-ore.jpg', 'assets/textures/rock-ore-n.jpg']);
}

function create ()
{
    this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.5);

    var graphics = this.add.graphics().setPipeline('Light2D');

    graphics.setTexture('metal');

    graphics.fillStyle(0x00ff00);
    graphics.fillTriangle(200, 200, 400, 50, 500, 300);

    graphics.fillStyle(0xff0000);
    graphics.fillTriangle(200, 200, 500, 300, 300, 300);

    graphics.setTexture('tiles');

    graphics.fillStyle(0xffffff);
    graphics.fillTriangle(30, 550, 30, 250, 470, 550);

    graphics.setTexture();

    graphics.fillGradientStyle(0xff0000, 0x00ff00, 0x0000ff, 0xffff00);
    graphics.fillTriangle(650, 50, 550, 400, 750, 400);

    this.add.sprite(660, 600, 'sonic').setOrigin(0.5, 1);

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
