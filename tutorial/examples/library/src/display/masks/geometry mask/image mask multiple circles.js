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

        shape.fillStyle(0xffffff);

        shape.beginPath();

        shape.moveTo(-240, 0);
        shape.arc(-240, 0, 250, 0, Math.PI * 2);
        shape.moveTo(240, 0);
        shape.arc(240, 0, 250, 0, Math.PI * 2);

        shape.fillPath();

        const mask = shape.createGeometryMask();

        image.setMask(mask);

        this.input.on('pointermove', function (pointer) {

            shape.x = pointer.x;
            shape.y = pointer.y;

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

