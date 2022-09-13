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
    this.load.spritesheet('diamonds', 'assets/sprites/diamonds32x5.png', { frameWidth: 64 });
}

function create ()
{
    //  Create 108 sprites in a grid so we can see them vanish easily
    var group = this.make.group({
        key: 'diamonds',
        frame: [ 0, 1, 2, 3, 4 ],
        frameQuantity: 22,
        max: 108
    });

    Phaser.Actions.GridAlign(group.getChildren(), {
        width: 12,
        height: 9,
        cellWidth: 64,
        cellHeight: 64,
        x: 48,
        y: 32
    });

    //  Remove one child from the display list every half a second
    timedEvent = this.time.addEvent({ delay: 500, callback: onEvent, callbackScope: this, loop: true });
}

function onEvent ()
{
    var child = this.children.getRandom();

    if (child)
    {
        this.children.remove(child);
    }
}
