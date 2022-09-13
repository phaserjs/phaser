class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('pic', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
    }

    create ()
    {
        const image = this.add.image(400, 300, 'pic');

        const shape = this.make.graphics();

        //  Create a hash shape Graphics object
        shape.fillStyle(0xffffff);

        //  You have to begin a path for a Geometry mask to work
        shape.beginPath();

        shape.fillRect(50, 0, 50, 300);
        shape.fillRect(175, 0, 50, 300);
        shape.fillRect(0, 75, 275, 50);
        shape.fillRect(0, 200, 275, 50);

        const mask = shape.createGeometryMask();

        image.setMask(mask);

        this.input.on('pointermove', function (pointer) {

            shape.x = pointer.x - 140;
            shape.y = pointer.y - 140;

        });
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
