class Example extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {
        this.load.image('metal', 'assets/textures/alien-metal.jpg');
        this.load.image('grass', 'assets/textures/grass.png');
        this.load.image('tiles', 'assets/textures/tiles.jpg');
        this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
        this.load.image('pic', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
        this.load.glsl('bundle', 'assets/shaders/bundle.glsl.js');
    }

    create()
    {
        this.add.image(400, 300, 'pic');

        const shader = this.add.shader('Tunnel', 400, 300, 512, 512, [ 'metal' ]);

        // s.uniforms.origin.value = 1.0;

        shader.setInteractive();

        shader.on('pointerdown', function () {

            if (s.uniforms.iChannel0.textureKey === 'metal')
            {
                s.setChannel0('grass');
            }
            else if (s.uniforms.iChannel0.textureKey === 'grass')
            {
                s.setChannel0('tiles');
            }
            else
            {
                s.setChannel0('metal');
            }

        });

        this.add.image(400, 300, 'logo');
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
