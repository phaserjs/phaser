<?php
    $title = "Go fullscreen";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update,render:render});

    function preload() {

        game.load.image('atari1', 'assets/sprites/atari130xe.png');

    }
    function create() {

        var sprite = game.add.sprite(0, 0, 'atari1');

        game.stage.backgroundColor = '#e3ed49';

        // //  Testing iOS7 lack of fullscreen. Damnit.
        // document.documentElement['style'].minHeight = '2000px';
        // window.scrollTo(0, document.body.scrollHeight);

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

    function render () {

        game.debug.renderText('Tap to go fullscreen',15,150);
    }

})();
</script>

<?php
    require('../foot.php');
?>