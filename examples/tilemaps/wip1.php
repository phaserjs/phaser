<?php
    $title = "Tilemap Layer WIP #1";
    require('../head.php');
?>

<script type="text/javascript">

    // var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.tilemap('cybernoidLevel3', 'assets/maps/cybernoid.json', null, Phaser.Tilemap.JSON);
        game.load.tileset('cybernoidTiles', 'assets/maps/cybernoid.png', 16, 16);

    }

    var layer;

    function create() {

        game.stage.backgroundColor = '#3d3d3d';



        // layer = new Phaser.TilemapLayer(game, 0, 0, 500, 500, [], 'snes');

        // layer = new Phaser.TilemapLayer(game, 0, 0, 500, 500);


        //  layer.load(mapData, tileset);
        //  layer.create(mapWidth, mapHeight, [tileset]);

        // layer.updateTileset('cybernoidTiles'); // can change on the fly


        // layer.context.fillStyle = 'rgb(255,0,0)';
        // layer.context.fillRect(0, 0, 200, 300);

        /*
        game.world._container.addChild(layer.sprite);

        layer.create(10, 10);

        layer.putTile(0, 0, 3);
        layer.putTile(0, 1, 4);

        layer.render();

        layer.dump();
        */
    }

    function update() {


    }

    function render() {


    }

</script>

<?php
    require('../foot.php');
?>