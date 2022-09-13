var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('invader2', 'assets/tests/invaders/invader2.png', { frameWidth: 44, frameHeight: 32 });
}

function create ()
{
    var invaders = this.add.group([
        { key: 'invader2', frame: 0, repeat: 10, setXY: { x: 32, y: 148, stepX: 52 } },
        { key: 'invader2', frame: 0, repeat: 10, setXY: { x: 32, y: 148 + 48, stepX: 52 } }
    ]);

    invaders.runChildUpdate = true;

    Phaser.Actions.IncX(invaders.getChildren(), 100);
    Phaser.Actions.SetTint(invaders.getChildren(), 0x00ff00);

    this.input.once('pointerdown', () => {

        console.log('Group destroyed');

        invaders.destroy();

    });
}
