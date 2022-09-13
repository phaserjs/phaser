class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('ayu', 'assets/pics/ayu2.png');
    }

    create ()
    {
        //  When creating images they are added in display order.
        //  The first one created appears at the back of the display list, and so on.
        //  By default that have a depth value of 0 which means "unsorted"
        //  Click to change the depth of image3 to 1, raising it higher than the others.

        const image1 = this.add.image(100, 300, 'ayu');
        const image2 = this.add.image(200, 300, 'ayu');
        const image3 = this.add.image(300, 300, 'ayu');
        const image4 = this.add.image(400, 300, 'ayu');
        const image5 = this.add.image(500, 300, 'ayu');
        const image6 = this.add.image(600, 300, 'ayu');
        const image7 = this.add.image(700, 300, 'ayu');

        this.input.on(Phaser.Input.Events.POINTER_DOWN, function (pointer) {
            image3.setDepth(1);
        }, this);
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
