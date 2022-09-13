class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('apple', 'assets/sprites/apple.png');
        this.load.glsl('bundle', 'assets/shaders/bundle.glsl.js');
    }

    create ()
    {
        const rt = this.make.renderTexture({ width: 512, height: 512 }, false);

        rt.fill(0x00066, 1, 0, 0, 512, 512);

        for (let i = 0; i < 64; i++)
        {
            rt.draw('apple', Phaser.Math.Between(50, 462), Phaser.Math.Between(50, 462));
        }

        rt.saveTexture('rt');

        const shader = this.add.shader('Tunnel', 400, 300, 800, 600, [ 'rt' ]);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Example
};

const game = new Phaser.Game(config);
