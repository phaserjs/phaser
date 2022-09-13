var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var group;

function preload ()
{
    this.load.image('bar', 'assets/sprites/flectrum.png');
}

function create ()
{
    group = this.add.group({ key: 'bar', frameQuantity: 32, setXY: { x: 400, y: 300 }, setScale: { x: 2, y: 6 } });
}

function update ()
{
    Phaser.Actions.Rotate(group.getChildren(), 0.005, 0.0005);
}
