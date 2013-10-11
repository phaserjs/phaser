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

    function create() {

        game.stage.backgroundColor = '#3d3d3d';

        var map = new Phaser.Tilemap(game, 'level3');

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

        map.dump();

        layer = new Phaser.TilemapLayer(game, 200, 200, 320, 200);
        layer.updateTileset('tiles');
        layer.updateMapData(map, 0);

        layer.sprite.anchor.setTo(0.5, 0.5);

        game.world.add(layer.sprite);


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