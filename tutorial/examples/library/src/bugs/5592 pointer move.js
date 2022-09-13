class Demo extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        this.input.on('pointermove', () => {
            console.log('move');
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 400,
    height: 300,
    scene: Demo,
    backgroundColor: 0x444444
};

const game = new Phaser.Game(config);
