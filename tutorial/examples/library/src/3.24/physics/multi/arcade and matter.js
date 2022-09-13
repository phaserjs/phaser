var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        physics: {
            arcade: {
                debug: true,
                gravity: { y: 200 }
            },
            matter: {
                debug: true,
                gravity: { y: 0.5 }
            }
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('fuji', 'assets/sprites/fuji.png');
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('platform', 'assets/sprites/platform.png');
}

function create ()
{
    //  Matter JS:
    this.matter.add.image(400, -100, 'block');
    this.matter.add.image(360, -600, 'block');
    this.matter.add.image(420, -900, 'block');

    this.matter.add.image(400, 550, 'platform', null, { isStatic: true });

    //  Arcade Physics:

    var block = this.physics.add.image(400, 100, 'fuji');

    block.setVelocity(100, 200);
    block.setBounce(1, 1);
    block.setCollideWorldBounds(true);
}
