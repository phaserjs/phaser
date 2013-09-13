<!DOCTYPE HTML>
<html>
<head>
    <title>phaser.js - a new beginning</title>
    <?php
        require('js.php');
    ?>
    <script src="../plugins/SamplePlugin.js"></script>
</head>
<body>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    var plugin;

    function preload() {

        game.load.image('atari1', 'assets/sprites/atari130xe.png');

    }

    function create() {

        //  Create our SamplePlugin.
        //  All the SamplePlugin does is move a sprite across the screen, 
        //  but it shows how to structure a plugin and hook it into key functions

        plugin = game.plugins.add(Phaser.Plugin.SamplePlugin);

        var tempSprite = game.add.sprite(0, 200, 'atari1');

        plugin.addSprite(tempSprite);

    }

})();
</script>

</body>
</html>