class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.move = 0;
        this.x = 0;
        this.y = 0;
    }

    preload ()
    {
        this.load.image('sky', 'assets/skies/deepblue.png');
        this.load.image('ball', 'assets/demoscene/ball-tlb.png');
    }

    create ()
    {
        this.add.image(0, 0, 'sky')
            .setOrigin(0);
        this.group = this.add.group({ key: 'ball', frameQuantity: 128 });

        this.input.on('pointermove', function (pointer) {
            this.x = pointer.x;
            this.y = pointer.y;
        }, this);
    }

    update (time, delta)
    {
        this.move += delta;
        if (this.move > 6)
        {
            Phaser.Actions.ShiftPosition(this.group.getChildren(), this.x, this.y);
            this.move = 0;
        }
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
