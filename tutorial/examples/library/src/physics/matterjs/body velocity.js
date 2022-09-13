var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
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
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('platform', 'assets/sprites/platform.png');
}

function create ()
{
    var block = this.matter.add.image(400, 100, 'block');

    block.setFriction(0.05);
    block.setFrictionAir(0.0005);
    block.setBounce(0.9);

    var ground = this.matter.add.image(400, 550, 'platform', null, { restitution: 0.4, isStatic: true });

    this.input.on('pointerdown', function (pointer) {

        if (pointer.y > 300)
        {
            block.setVelocity(0, -10);
        }
        else if (pointer.x < 400)
        {
            block.setVelocityX(-8);
        }
        else
        {
            block.setVelocityX(8);
        }

    });
}
