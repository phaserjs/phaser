<?php
    $title = "Breakout";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.atlas('breakout', 'assets/sprites/breakout.png', 'assets/sprites/breakout.json');

    }

    var ball;
    var paddle;
    var bricks;
    var ballOnPaddle = true;

    function create() {

        var brick;
        bricks = game.add.group();

        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 15; x++)
            {
                brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
                brick.body.bounce.setTo(1, 1);
                brick.body.immovable = true;
            }
        }

        ball = game.add.sprite(game.world.centerX, 534, 'breakout', 'ball_1.png');
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(1, 1);
        ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);

        paddle = game.add.sprite(game.world.centerX, 550, 'breakout', 'paddle_big.png');
        paddle.body.collideWorldBounds = true;
        paddle.body.bounce.setTo(1, 1);
        paddle.body.immovable = true;

        game.input.onDown.add(releaseBall, this);

    }

    function update () {

        paddle.x = game.input.x;

        if (ballOnPaddle)
        {
            ball.x = paddle.x + 16;
        }
        else
        {
            game.physics.collide(paddle, ball);
            game.physics.collide(ball, bricks, ballHitBrick, null, this);
        }

    }

    function releaseBall () {

        ballOnPaddle = false;
        ball.body.velocity.y = -300;
        ball.body.velocity.x = -75;
        ball.animations.play('spin');

    }

    function ballHitBrick (_ball, _brick) {

        _brick.kill();

    }

    function render () {
    }

})();
</script>

<?php
    require('../foot.php');
?>    
