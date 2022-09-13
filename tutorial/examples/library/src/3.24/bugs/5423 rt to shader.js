function preload ()
{
    this.load.image('apple', 'assets/sprites/apple.png');
    this.load.image('metal', 'assets/textures/alien-metal.jpg');
    this.load.glsl('bundle', 'assets/shaders/bundle.glsl.js');
}

function create()
{
    const rt = this.add.renderTexture(0, 0, 512, 512).setVisible(false);

    rt.fill(0x00066, 1, 0, 0, 512, 512);

    for (var i = 0; i < 64; i++)
    {
        rt.draw('apple', Phaser.Math.Between(50, 462), Phaser.Math.Between(50, 462));
    }

    rt.saveTexture('rt');

    const shader = this.add.shader('Tunnel', 400, 300, 800, 600, [ 'rt' ]);
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
  };

const game = new Phaser.Game(config);
