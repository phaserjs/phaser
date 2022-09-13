class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('phaser', 'assets/sprites/phaser2.png');
    }

    create ()
    {
        const group = this.add.group();

        //  Add an existing Image into the group:

        const image = this.add.image(0, 0, 'phaser');

        group.add(image);

        //  Any action done to the group is now reflected by the Image
        //  For example this will set the position of the image to 400 x 300
        Phaser.Actions.SetXY(group.getChildren(), 400, 300);
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
