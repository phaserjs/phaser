class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('turkey', 'assets/pics/turkey-1985086.jpg');
    }

    create ()
    {
        //  WebGL only:
        const gl = this.sys.game.renderer.gl;

        const renderer = this.sys.game.renderer;

        const modeIndex = renderer.addBlendMode([ gl.ZERO, gl.SRC_COLOR ], gl.FUNC_ADD);

        const graphics = this.add.graphics();

        const color = 0xffffff;
        const alpha = 1;

        graphics.fillStyle(color, alpha);

        graphics.fillCircle(400, 300, 256);

        this.add.image(400, 300, 'turkey').setBlendMode(modeIndex);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);

