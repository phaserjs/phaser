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
        const rect = new Phaser.Geom.Rectangle(100, 100, 256, 256);
        const group = this.add.group({ key: 'ball', frameQuantity: 32 });
        Phaser.Actions.PlaceOnRectangle(group.getChildren(), rect);
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
