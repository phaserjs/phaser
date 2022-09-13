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
    this.load.glsl('bundle', 'assets/shaders/bundle.glsl.js');
}

function create ()
{
    var shader = this.add.shader('Tunnel', 400, 300, 800, 600, [ 'metal' ]);

    shader.setInteractive();

    shader.on('pointerdown', function () {

        var currentTexture = shader.getUniform('iChannel0').textureKey;

        if (currentTexture === 'metal')
        {
            shader.setChannel0('grass');
        }
        else if (currentTexture === 'grass')
        {
            shader.setChannel0('tiles');
        }
        else
        {
            shader.setChannel0('metal');
        }

    });

    this.add.image(400, 300, 'logo');
    
    this.add.text(10, 10, 'Click to change texture', { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1);
}
