class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('ball', 'assets/sprites/shinyball.png');
    }

    create ()
    {
        const line = new Phaser.Geom.Line(100, 200, 600, 400);
        const group = this.add.group({ key: 'ball', frameQuantity: 32 });

        Phaser.Actions.PlaceOnLine(group.getChildren(), line);
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
