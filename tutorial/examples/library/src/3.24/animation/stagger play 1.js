var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
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
    var config = {
        key: 'flash',
        frames: this.anims.generateFrameNumbers('diamonds', { start: 0, end: 4 }),
        frameRate: 1,
        repeat: -1
    };

    this.anims.create(config);

    var group = this.add.group();

    group.createMultiple({ key: 'diamonds', frame: 0, repeat: 279 });

    Phaser.Actions.GridAlign(group.getChildren(), { width: 20, height: 20, cellWidth: 38, x: 38, y: 50 });

    this.anims.staggerPlay('flash', group.getChildren(), 60);
}
