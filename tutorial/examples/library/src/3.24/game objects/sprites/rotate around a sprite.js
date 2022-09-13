var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var ball1;
var ball2;
var ball3;

var angle1 = 0;
var distance1 = 200;

var angle2 = 0;
var distance2 = 80;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ballRed', 'assets/demoscene/ball.png');
    this.load.image('ballBlue', 'assets/demoscene/blue_ball.png');
    this.load.image('ballSmall', 'assets/demoscene/ball-tlb.png');
}

function create ()
{
    ball1 = this.add.sprite(400, 300, 'ballRed');
    ball2 = this.add.sprite(400, 300, 'ballBlue');
    ball3 = this.add.sprite(400, 300, 'ballSmall');
}

function update ()
{
    //  Reset the position so the rotation gets the correct _new_ position
    ball2.setPosition(400, 300);
    ball3.setPosition(400, 300);

    Phaser.Math.RotateAroundDistance(ball2, ball1.x, ball1.y, angle1, distance1);
    Phaser.Math.RotateAroundDistance(ball3, ball2.x, ball2.y, angle2, distance2);

    angle1 = Phaser.Math.Angle.Wrap(angle1 + 0.02);
    angle2 = Phaser.Math.Angle.Wrap(angle2 + 0.03);
}
