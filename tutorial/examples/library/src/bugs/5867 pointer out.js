class Demo extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        this.input.topOnly = false;

        this.add.zone(400, 300, 800, 600).setInteractive();
        this.add.zone(400, 300, 800, 600).setInteractive();
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Demo,
    backgroundColor: 0x444444
};

const game = new Phaser.Game(config);
