class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('block', 'assets/sprites/block.png');
    }

    create ()
    {
        //  Create a stack of blocks
        const group = this.make.group({ key: 'block', frameQuantity: 12 });
        Phaser.Actions.SetXY(group.getChildren(), 48, 500, 64, 0);

        this.input.on('pointerdown', function (pointer) {
            const child = this.children.getAt(0);
            child.y -= 32;

            this.children.bringToTop(child);

        }, this);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
