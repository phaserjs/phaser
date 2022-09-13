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
    this.load.image('metal', 'assets/textures/alien-metal.jpg');
    this.load.image('grass', 'assets/textures/grass.png');
    this.load.image('tiles', 'assets/textures/tiles.jpg');
    this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
    this.load.image('pic', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
    this.load.glsl('bundle', 'assets/shaders/bundle.glsl.js');
}

function create ()
{
    this.add.image(400, 300, 'pic');

    var s = this.add.shader('Tunnel', 400, 300, 512, 512, [ 'metal' ]);

    // s.uniforms.origin.value = 1.0;

    s.setInteractive();

    s.on('pointerdown', function () {

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
