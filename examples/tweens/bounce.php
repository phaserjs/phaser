<?php
    $title = "Bounce";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload:preload,create: create });


    function preload() {

        game.load.image('ball', 'assets/sprites/yellow_ball.png');

        

    }

    var ball;

    function create() {

        ball = game.add.sprite(300, 0, 'ball');

        startBounceTween();
    }

    function startBounceTween() {

        ball.y = 0;

        var bounce=game.add.tween(ball);

        bounce.to({ y: game.world.height-ball.height }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.In);
        bounce.onComplete.add(startBounceTween, this);
        bounce.start();

    }



</script>

<?php
    require('../foot.php');
?>