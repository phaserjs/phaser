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
}

function create ()
{
    this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.4);

    var t1 = this.add.isotriangle(150, 500, 200, 400, false, 0x00b9f2, 0x016fce, 0x028fdf).setPipeline('Light2D');

    var t2 = this.add.isotriangle(400, 500, 200, 400, true, 0xffe31f, 0xf2a022, 0xf8d80b).setPipeline('Light2D');

    var t3 = this.add.isotriangle(640, 500, 100, 100, false, 0x8dcb0e, 0x3f8403, 0x63a505).setPipeline('Light2D');

    this.tweens.add({
        targets: t3,
        height: 300,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    this.tweens.add({
        targets: [ t1, t2, t3 ],
        projection: 30,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
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
