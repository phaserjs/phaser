class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('pic1', 'assets/pics/alex-bear.png');
        this.load.image('pic2', 'assets/pics/coma-zero-gravity.png');
        this.load.image('pic3', 'assets/pics/cougar-face-of-nature.png');
        this.load.image('pic4', 'assets/pics/cougar-sanity-train.png');
    }

    create ()
    {
        const image1 = this.add.image(0, 0, 'pic1').setOrigin(0);
        const image2 = this.add.image(320, 0, 'pic2').setOrigin(0);
        const image3 = this.add.image(0, 256, 'pic3').setOrigin(0);
        const image4 = this.add.image(320, 256, 'pic4').setOrigin(0);

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

        image1.setMask(mask);
        image2.setMask(mask);
        image3.setMask(mask);
        image4.setMask(mask);

        this.input.on('pointermove', function (pointer) {

            shape.x = pointer.x - 140;
            shape.y = pointer.y - 140;

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 512,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
