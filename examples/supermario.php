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

        game.load.tilemap('background', 'assets/maps/smb_bg.png', 'assets/maps/smb_bg.json', null, Phaser.Tilemap.JSON);
        game.load.tilemap('level1', 'assets/maps/smb_tiles.png', 'assets/maps/smb_level1.json', null, Phaser.Tilemap.JSON);

    }

    function create() {

        game.stage.backgroundColor = '#787878';

        game.add.tilemap(0, 0, 'background');
        game.add.tilemap(0, 0, 'level1');

    }

    function update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= 8;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += 8;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= 8;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += 8;
        }

    }

    function render() {
    }

})();
</script>

</body>
</html>