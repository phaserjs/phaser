// TODO

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var zone;

new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    zone = this.add.zone(300, 200).setSize(200, 200);
    this.physics.world.enable(zone);
    zone.body.setAllowGravity(false);
    zone.body.moves = false;

    var group = this.physics.add.group({
        key: 'block',
        frameQuantity: 4,
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true,
        velocityX: 120,
        velocityY: 60
    });

    this.physics.add.overlap(group, zone);
}

function update ()
{
    zone.body.debugBodyColor = zone.body.touching.none ? 0x00ffff : 0xffff00;
}
