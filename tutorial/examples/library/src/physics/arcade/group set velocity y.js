var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 100 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/demoscene/ball-tlb.png');
}

function create ()
{
    var group = this.physics.add.group({
        key: 'ball',
        frameQuantity: 28,
        gridAlign: {
            x: 14,
            y: 14,
            width: 28,
            height: 1,
            cellWidth: 28
        },
        bounceY: 1,
        collideWorldBounds: true
    });

    group.setVelocityY(300, 10);
}
