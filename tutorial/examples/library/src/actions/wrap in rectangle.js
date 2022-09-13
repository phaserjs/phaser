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
        this.rect = new Phaser.Geom.Rectangle(100, 100, 256, 256);
        this.group = this.add.group({ key: 'ball', frameQuantity: 32 });

        Phaser.Actions.RandomRectangle(this.group.getChildren(), this.rect);
    }

    update ()
    {
        this.children = this.group.getChildren();

        Phaser.Actions.IncXY(this.children, 1, 1);
        Phaser.Actions.WrapInRectangle(this.children, this.rect);
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
