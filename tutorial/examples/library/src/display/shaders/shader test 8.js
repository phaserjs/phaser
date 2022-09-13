class Example extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {
        this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
        this.load.image('pic', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
        this.load.glsl('bundle', 'assets/shaders/bundle2.glsl.js');
    }

    create()
    {
        const shader = this.add.shader('Stripes', 400, 300, 800, 600)
            // .setVisible(false);
        shader.setUniform('size.value', 1.0);

        const mask = shader.createBitmapMask();
        const pic = this.add.image(400, 300, 'pic').setMask(mask);

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
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
