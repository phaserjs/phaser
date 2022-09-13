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
    this.load.image('pic', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
    this.load.glsl('bundle', 'assets/shaders/bundle2.glsl.js');
}

function create ()
{
    var shader = this.add.shader('Stripes', 400, 300, 800, 600).setVisible(false);

    shader.setUniform('size.value', 0.0);

    var mask = shader.createBitmapMask();

    var pic = this.add.image(400, 300, 'pic').setMask(mask);

    this.add.image(400, 300, 'logo');

    this.tweens.add({
        targets: shader.uniforms.size,
        value: 32,
        duration: 6000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });
}
