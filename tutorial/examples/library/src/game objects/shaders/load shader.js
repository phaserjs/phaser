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
    this.load.glsl('fireball', 'assets/shaders/shader0.frag');
}

function create ()
{
    this.add.shader('fireball', 400, 300, 800, 600);
}
