class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('ball', 'assets/sprites/chunk.png');
    }

    create ()
    {
        // var triangle = new Phaser.Geom.Triangle.BuildEquilateral(400, 100, 380);
        const triangle = new Phaser.Geom.Triangle.BuildRight(200, 400, 300, 200);
        const group = this.add.group({ key: 'ball', frameQuantity: 64 });
        Phaser.Actions.PlaceOnTriangle(group.getChildren(), triangle);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
