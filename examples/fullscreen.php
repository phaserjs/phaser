<!DOCTYPE HTML>
<html>
<head>
    <title>phaser.js - a new beginning</title>
    <?php
        require('js.php');
    ?>
    <style type="text/css">
        body {
            margin: 0;
        }
    </style>
</head>
<body>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.image('atari1', 'assets/sprites/atari130xe.png');

    }

    function create() {

        var tempSprite = game.add.sprite(0, 0, 'atari1');

        game.stage.backgroundColor = '#e3ed49';

        //  Testing iOS7 lack of fullscreen. Damnit.
        document.documentElement['style'].minHeight = '2000px';
        window.scrollTo(0, document.body.scrollHeight);

        game.input.onDown.add(gofull, this);

    }

    function gofull() {
        game.stage.scale.startFullScreen();
    }

    function update() {

        if (document.getElementsByTagName('body')[0].scrollTop > 1000)
        {
            game.stage.backgroundColor = '#87ff55';
            window.scrollTo(0, 0);
        }

    }

    function render() {
    }

})();
</script>

</body>
</html>