var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000066',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('brain', 'assets/sprites/brain.png');
    this.load.image('truck', 'assets/sprites/astorm-truck.png');
}

function create ()
{
    var container = this.add.container(200, 200);

    var sprite0 = this.add.sprite(0, 0, 'truck');
    var sprite1 = this.add.sprite(200, 200, 'brain');

    container.add(sprite0);
    container.add(sprite1)

    sprite1.setMask(sprite0.createBitmapMask())
}