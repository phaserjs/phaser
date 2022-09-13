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
    this.load.spritesheet('fish', ['assets/sprites/fish-136x80.png', 'assets/sprites/fish-136x80_n.png'], { frameWidth: 136, frameHeight: 80 });
}

function create ()
{
    this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.2);

    var particles = this.add.particles('fish').setPipeline('Light2D');

    particles.createEmitter({
        frame: { frames: [ 0, 1, 2 ], cycle: true, quantity: 4 },
        x: -70,
        y: { min: 100, max: 500, steps: 8 },
        lifespan: 5000,
        speedX: { min: 200, max: 400, steps: 8 },
        quantity: 4,
        frequency: 500
    });

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
