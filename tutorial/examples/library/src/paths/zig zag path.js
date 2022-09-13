var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var path;
var graphics;
var followers;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    graphics = this.add.graphics();

    //  Create the zig-zag path

    path = new Phaser.Curves.Path(100, -50);

    path.lineTo(100, 50);

    var max = 8;
    var h = 500 / max;

    for (var i = 0; i < max; i++)
    {
        if (i % 2 === 0)
        {
            path.lineTo(700, 50 + h * (i + 1));
        }
        else
        {
            path.lineTo(100, 50 + h * (i + 1));
        }
    }

    path.lineTo(100, 650);

    //  Create the path followers

    followers = this.add.group();

    for (var i = 0; i < 32; i++)
    {
        var ball = followers.create(0, -50, 'ball');

        ball.setData('vector', new Phaser.Math.Vector2());

        this.tweens.add({
            targets: ball,
            z: 1,
            ease: 'Linear',
            duration: 12000,
            repeat: -1,
            delay: i * 100
        });
    }
}

function update ()
{
    graphics.clear();

    graphics.lineStyle(1, 0xffffff, 1);

    path.draw(graphics);

    var balls = followers.getChildren();

    for (var i = 0; i < balls.length; i++)
    {
        var t = balls[i].z;
        var vec = balls[i].getData('vector');

        //  The vector is updated in-place
        path.getPoint(t, vec);
        
        balls[i].setPosition(vec.x, vec.y);

        balls[i].setDepth(balls[i].y);
    }
}
