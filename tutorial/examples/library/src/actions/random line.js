class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('orb', 'assets/sprites/orb-blue.png');
    }

    create ()
    {
        const group = this.add.group({ key: 'orb', frameQuantity: 300 });

        const line = new Phaser.Geom.Line(200, 200, 500, 400);

        //  Randomly position the sprites on the line
        Phaser.Actions.RandomLine(group.getChildren(), line);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
