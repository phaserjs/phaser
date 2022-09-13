class Example extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {
        this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
        this.load.glsl('bundle', 'assets/shaders/bundle2.glsl.js');
    }

    create()
    {
        const shader = this.add.shader('HSL', 400, 300, 512, 512);
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
