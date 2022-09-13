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
    this.load.image('bg', 'assets/textures/gold.png');
}

function create ()
{
    this.add.sprite(400, 300, 'bg').setAlpha(0.2);

    const spectrum = Phaser.Display.Color.ColorSpectrum(256);

    console.log(spectrum);

    let light = this.lights.addPointLight(400, 300, 0xffffff, 16, 0.4);

    this.input.on('pointermove', pointer => {

        light.x = pointer.x;
        light.y = pointer.y;

        if (pointer.isDown)
        {
            let color = Phaser.Utils.Array.GetRandom(spectrum).color;

            light = this.lights.addPointLight(pointer.x, pointer.y, color, Phaser.Math.Between(8, 32), 0.4, 0.05);
        }

    });

    this.add.sprite(680, 600, 'sonic').setOrigin(0.5, 1).setDepth(1);
}
