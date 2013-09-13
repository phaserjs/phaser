<!DOCTYPE HTML>
<html>
<head>
    <title>phaser.js - a new beginning</title>
    <?php
        require('js.php');
    ?>
</head>
<body>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('trsi', 'assets/pics/trsipic1_lazur.jpg');
    }

    var r;
    var pic;

    function create() {

        pic = game.add.sprite(0, 0, 'trsi');

        r = new Phaser.Rectangle(0, 0, 200, 200);

    }

    function update() {

        r.x = game.input.x;
        r.y = game.input.y;
        pic.x = game.input.x;
        pic.y = game.input.y;

        //  Apply the new crop Rectangle to the sprite
        pic.crop = r;

    }

})();
</script>

</body>
</html>