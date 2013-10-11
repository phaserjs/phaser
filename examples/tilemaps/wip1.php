<?php
    $title = "Tilemap Layer WIP #1";
    require('../head.php');
?>

<script type="text/javascript">

    // var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        // game.load.image('snes', 'assets/maps/smb_tiles.png');
        // game.load.tilemap('nes', 'assets/maps/mario1.png', 'assets/maps/mario1.json', null, Phaser.Tilemap.JSON);
        // game.load.tilemap('snes', 'assets/maps/smb_tiles.png', 'assets/maps/smb_level1.json', null, Phaser.Tilemap.JSON);

        //  Just loads the level data and specifies the format
        // game.load.tilemap('marioLevel1', 'assets/maps/smb_level1.json', Phaser.Tilemap.JSON);

        //  What about passing in a JSON object though? Need that too. But a CSV would look like a 'string', not an object - how to tell apart from URL?
        // game.load.tilemap('marioLevel1', SMB_LEVEL_JSON, Phaser.Tilemap.JSON);

        //  Exactly the same as loading a sprite sheet :)
        game.load.tileset('marioLevel1', 'assets/maps/smb_tiles.png', 32, 32);

    }

    var layer;

    function create() {

        game.stage.backgroundColor = '#3d3d3d';



        layer = new Phaser.TilemapLayer(game, 0, 0, 500, 500, [], 'snes');

        // layer = new Phaser.TilemapLayer(game, 0, 0, 500, 500);


        //  layer.load(mapData, tileset);
        //  layer.create(mapWidth, mapHeight, [tileset]);
        //  layer.updateTileset(key); // can change on the fly

        layer.context.fillStyle = 'rgb(255,0,0)';
        layer.context.fillRect(0, 0, 200, 300);
        game.world._container.addChild(layer.sprite);

        layer.create(10, 10);

        layer.putTile(2, 2, 1);
        layer.putTile(3, 2, 1);
        layer.putTile(4, 2, 1);
        layer.putTile(5, 2, 1);
        layer.putTile(4, 6, 1);

        layer.dump();
    }

    function update() {


    }

    function render() {


    }

</script>

<?php
    require('../foot.php');
?>