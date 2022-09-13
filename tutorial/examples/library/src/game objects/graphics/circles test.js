var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var graphics;
var balls = [];

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    for (var i = 0; i < 2000; i++)
    {
        balls.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            v: 1,
            a: Math.random() * 2 * Math.PI,
        });
    }
}

function update ()
{
    graphics.clear();
    graphics.fillStyle(0x9966ff, 1);

    for (b in balls)
    {
        var ball = balls[b];
        ball.x += ball.v * Math.cos(ball.a);
        ball.y += ball.v * Math.sin(ball.a);
        ball.a += 0.03;

        graphics.fillCircle(ball.x, ball.y, ball.a);
    }
}
