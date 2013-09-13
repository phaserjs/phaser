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

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');

    }

    function create() {

        game.add.bitmapText(200, 100, 'Phaser\nis rocking!', { font: '64px Desyrel', align: 'center' });

    }

    function update() {
    }

    function render() {
    }

})();
</script>

</body>
</html>