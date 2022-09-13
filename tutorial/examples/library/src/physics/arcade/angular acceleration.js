var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: { debug: true }
    },
    scene: {
        preload: preload,
        create: create
    }
};

new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var group = this.physics.add.group({ angularAcceleration: 60 });

    group.create(100, 200, 'block');
    group.create(500, 200, 'block');
    group.create(300, 400, 'block');
    group.create(600, 300, 'block');

    // After 6 seconds, slow them down again.
    this.time.delayedCall(6000, function ()
    {
        group.children.iterateLocal('setAngularAcceleration', 0);
        group.children.iterateLocal('setAngularDrag', 60);
    });
}
