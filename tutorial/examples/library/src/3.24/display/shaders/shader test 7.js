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
    this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
    this.load.glsl('bundle', 'assets/shaders/bundle2.glsl.js');
}

function create ()
{
    var s = this.add.shader('HSL', 400, 300, 512, 512);

    this.add.image(400, 300, 'logo');
}
