var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
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
    this.load.image('ball', 'assets/demoscene/doc-ball.png');
}

function create ()
{
    var group = this.physics.add.group({
        key: 'ball',
        frameQuantity: 12,
        gridAlign: {
            x: 25,
            y: 25,
            width: 1,
            height: 12,
            cellWidth: 50,
            cellHeight: 50
        },
        bounceX: 1,
        collideWorldBounds: true
    });

    group.setVelocityX(200, 10);
}
