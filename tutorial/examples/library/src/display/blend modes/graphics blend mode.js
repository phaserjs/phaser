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
        this.add.image(400, 300, 'turkey');

        const graphics = this.add.graphics();

        // var color = 0xffffff; // diff
        const color = 0x0000ff; // mult
        const thickness = 4;
        const alpha = 1;

        // graphics.lineStyle(16, 0x000000, 1);
        graphics.fillStyle(color, alpha);

        // var a = new Phaser.Geom.Point(400, 300);
        // var radius = 128;

        graphics.fillCircle(400, 300, 128);
        // graphics.strokeCircle(400, 300, 128);

        // graphics.setBlendMode(Phaser.BlendModes.MULTIPLY);
        graphics.setBlendMode(Phaser.BlendModes.SCREEN);
        // graphics.setBlendMode(Phaser.BlendModes.DIFFERENCE);
    }
}

const config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
