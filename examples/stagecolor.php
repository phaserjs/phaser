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

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { create: create });

    function create() {

        //  You can set the stage color using a hex value:
        game.stage.backgroundColor = '#550000';

        //  Or a direct color value:
        game.stage.backgroundColor = 0xbbaa44;

    }

})();
</script>

</body>
</html>