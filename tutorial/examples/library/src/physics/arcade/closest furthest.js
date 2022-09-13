var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('cursor', 'assets/sprites/drawcursor.png');
}

var group;
var gfx;

function create ()
{
    group = this.physics.add.group({
        defaultKey: 'block',
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true
    });

    group.create(100, 200).setVelocity(100, 200);
    group.create(500, 200).setVelocity(-100, -100);
    group.create(300, 400).setVelocity(60, 100);
    group.create(600, 300).setVelocity(-30, -50);

    gfx = this.add.graphics();

    var cursor = this.add.image(0, 0, 'cursor').setVisible(false);

    // Loads the spatial tree
    this.physics.world.step(0);

    this.input.on('pointermove', function (pointer)
    {
        cursor.setVisible(true).setPosition(pointer.x, pointer.y);
    });

}

function update () {
    var pointer = this.input.activePointer;
    var closest = this.physics.closest(pointer);
    var furthest = this.physics.furthest(pointer);

    gfx.clear()
        .lineStyle(2, 0xff3300)
        .lineBetween(closest.x, closest.y, pointer.x, pointer.y)
        .lineStyle(2, 0x0099ff)
        .lineBetween(furthest.x, furthest.y, pointer.x, pointer.y);
}
