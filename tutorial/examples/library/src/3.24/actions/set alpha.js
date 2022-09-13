var config = {
    type: Phaser.WEBGL,
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
    this.load.spritesheet('diamonds', 'assets/sprites/diamonds32x24x5.png', { frameWidth: 32, frameHeight: 24 });
}

function create ()
{
    var group = this.add.group({ key: 'diamonds', frame: 0, frameQuantity: 50, setXY: { x: 32, y: 32, stepX: 14 }});

    Phaser.Actions.SetAlpha(group.getChildren(), 0, 1 / 50);
}
