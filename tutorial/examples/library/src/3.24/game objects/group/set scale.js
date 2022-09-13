var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bar', 'assets/sprites/flectrum.png');
}

function create ()
{
    var group = this.add.group({
        key: 'bar',
        frameQuantity: 32,
        setXY: { x: 400, y: 300 },
        setRotation: { value: 0, step: 0.1 },
        setScale: { x: 1, y: 2, stepY: 0.1 }
    });
}
