var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('platform', 'assets/sprites/platform.png');
}

function create ()
{
    this.matter.add.image(325, -100, 'block');
    this.matter.add.image(400, 300, 'block');
    this.matter.add.image(450, 50, 'block');

    var platform = this.matter.add.image(400, 550, 'platform', null, { isStatic: true });

    console.log(platform);

    this.input.once('pointerup', function () {

        platform.destroy();

    });
}
