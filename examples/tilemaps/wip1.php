<?php
    $title = "Tilemap Layer WIP #1";
    require('../head.php');
?>

<script type="text/javascript">

    // var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.tilemap('level3', 'assets/maps/cybernoid.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tileset('tiles', 'assets/maps/cybernoid.png', 16, 16);

    }

    var layer;
    var cursors;
    var sprite2;

    function create() {

        game.stage.backgroundColor = '#3d3d3d';

        //  A Tilemap object just holds the data needed to describe the map (i.e. the json exported from Tiled, or the CSV exported from elsewhere).
        //  You can add your own data or manipulate the data (swap tiles around, etc) but in order to display it you need to create a TilemapLayer.
        var map = new Phaser.Tilemap(game, 'level3');

        var tileset = game.cache.getTileset('tiles');

        //  A TilemapLayer consists of an x,y coordinate (position), a width and height, a Tileset and a Tilemap which it uses for map data.
        //  The x/y coordinates are in World space and you can place the tilemap layer anywhere in the world.
        //  The width/height is the rendered size of the layer in pixels, not the size of the map data itself.

        //  This one gives tileset as a string, the other an object
        // layer = new Phaser.TilemapLayer(game, 0, 0, 640, 400, 'tiles', map, 0);
        layer = new Phaser.TilemapLayer(game, 0, 0, 640, 400, tileset, map, 0);

        //  To set tiles for collision you need to modify the Tileset, which is a property of the layer
        

        //  Collision is based on the layer.x/y value

        // layer.sprite.anchor.setTo(0.5, 0.5);
 
        game.world.add(layer.sprite);

        //  This is a bit nuts, ought to find a way to automate it, but it looks cool :)
        map.debugMap = [ '#000000', 
            '#e40058', '#e40058', '#e40058', '#80d010', '#bcbcbc', '#e40058', '#000000', '#0070ec', '#bcbcbc', '#bcbcbc', '#bcbcbc',
            '#bcbcbc', '#bcbcbc', '#e40058', '#e40058', '#0070ec', '#0070ec', '#80d010', '#80d010', '#80d010', '#bcbcbc', '#bcbcbc', 
            '#bcbcbc', '#80d010', '#80d010', '#80d010', '#0070ec', '#0070ec', '#80d010', '#80d010', '#80d010', '#80d010', '#0070ec',
            '#0070ec', '#24188c', '#24188c', '#80d010', '#80d010', '#80d010', '#bcbcbc', '#80d010', '#80d010', '#80d010', '#e40058',
            '#e40058', '#bcbcbc', '#e40058', '#bcbcbc', '#e40058', '#bcbcbc', '#80d010', '#bcbcbc', '#80d010', '#000000', '#80d010', 
            '#80d010', '#80d010', '#bcbcbc', '#e40058', '#80d010', '#80d010', '#e40058', '#e40058', '#bcbcbc', '#bcbcbc', '#bcbcbc',
            '#0070ec', '#0070ec', '#bcbcbc', '#bcbcbc', '#0070ec', '#0070ec', '#bcbcbc', '#bcbcbc', '#bcbcbc', '#bcbcbc', '#bcbcbc', 
            '#bcbcbc', '#bcbcbc'
        ];

        // map.dump();

        // layer.sprite.scale.setTo(2, 2);

        //  Works a treat :)
        // game.add.sprite(320, 0, layer.texture, layer.frame);
        // game.add.sprite(0, 200, layer.texture, layer.frame);
        // game.add.sprite(320, 200, layer.texture, layer.frame);

        // game.world.setBounds(0, 0, 2000, 2000);
        // game.camera.x = 400;

        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {

        // layer.sprite.angle += 0.5;

        if (cursors.up.isDown)
        {
            layer.y -= 4;
        }
        else if (cursors.down.isDown)
        {
            layer.y += 4;
        }

        if (cursors.left.isDown)
        {
            layer.x -= 4;
        }
        else if (cursors.right.isDown)
        {
            layer.x += 4;
        }

    }

    function render() {

        layer.render();

    }

</script>

<?php
    require('../foot.php');
?>