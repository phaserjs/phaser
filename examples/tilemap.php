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

        //  CSV Tilemap Test

        //  First we load our map data (a csv file)
        game.load.text('csvtest', 'assets/maps/catastrophi_level2.csv');

        //  Then we load the actual tile sheet image
        game.load.image('csvtiles', 'assets/tiles/catastrophi_tiles_16.png');

    }

    var canvas;
    var context;
    var baseTexture;
    var texture;
    var s;
    var r;
    var t;

    function create() {

        //  game, key, mapData, format, resizeWorld, tileWidth, tileHeight

        //  This creates the tilemap using the csv and tile sheet we loaded.
        //  We tell it use to CSV format parser. The 16x16 are the tile sizes.
        //  The 4th parameter (true) tells the game world to resize itself based on the map dimensions or not.
        
        t = new Phaser.Tilemap(game, 'csvtiles', 'csvtest', Phaser.Tilemap.FORMAT_CSV, true, 16, 16);

        r = new Phaser.TilemapRenderer(game);

    }

    function update() {

        r.render(t);

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += 4;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += 4;
        }

    }

    function render() {
    }

})();
</script>

</body>
</html>