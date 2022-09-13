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
        //  Create 300 sprites (they all start life at 0x0)
        const group = this.add.group({ key: 'orb', frameQuantity: 300 });

        const rect = new Phaser.Geom.Rectangle(300, 300, 300, 100);

        //  Randomly position the sprites within the rectangle
        Phaser.Actions.RandomRectangle(group.getChildren(), rect);
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
