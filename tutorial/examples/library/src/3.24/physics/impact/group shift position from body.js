var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 200,
            debug: false,
            maxVelocity: 500
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.image('sky', 'assets/skies/deepblue.png');
    this.load.image('ball', 'assets/demoscene/ball-tlb.png');
}

function create ()
{
    //  Calling this with no arguments will set the bounds to match the game config width/height
    this.impact.world.setBounds();

    this.add.image(0, 0, 'sky').setOrigin(0);

    group = this.add.group();

    group.createMultiple({ key: 'ball', frameQuantity: 64 });

    //  If you don't set the body as active it won't collide with the world bounds
    var balls = this.impact.add.body(200, 100).setActiveCollision().setVelocity(300, 200).setBounce(0.95);

    //  Set a body size of 1x1
    balls.setBodySize(1, 1);

    balls.body.updateCallback = function (body)
    {
        group.shiftPosition(body.pos.x, body.pos.y);
    };

    //  Click to give the balls a boost :)
    this.input.on('pointerdown', function () {

        balls.setVelocityY(-300);

    });
}
