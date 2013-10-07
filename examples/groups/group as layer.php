 
 <?php
    $title = "Using groups to handle indexes inside of your game";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,render:render});

        function preload() {
        game.world.setBounds(1280, 800);

        game.load.image('ground', 'assets/tests/ground-2x.png');
        game.load.image('river', 'assets/tests/river-2x.png');
        game.load.image('sky', 'assets/tests/sky-2x.png');
        game.load.image('cloud0', 'assets/tests/cloud-big-2x.png');
        game.load.image('cloud1', 'assets/tests/cloud-narrow-2x.png');
        game.load.image('cloud2', 'assets/tests/cloud-small-2x.png');

        game.load.spritesheet('ufo', 'assets/sprites/ufo.png', 24, 21);

        
    }
    function create() {
        // Create the sky layer, behind everything and donot move.
        var skyLayer = game.add.group();
        skyLayer.z = 0;
        // Create the cloud layer, only beyond the sky.
        var cloudLayer = game.add.group();
        cloudLayer.z = 1;
        // Create the ground, behind the river and beyond clouds.
        var groundLayer = game.add.group();
        groundLayer.z = 2;
        // Create the sprite layer. This should behind the river,
        // and beyond the ground, cloud and sky layer.
        var spriteLayer = game.add.group();
        spriteLayer.z = 3;
        // Create the river layer, beyond everything.
        var riverLayer = game.add.group();
        riverLayer.z = 4;

        // Add sky background to skyLayer.
        var sky = new Phaser.Sprite(game, 0, 0, 'sky');
        skyLayer.add(sky);

        // Add clouds to cloudLayer.
        var cloud0 = new Phaser.Sprite(game, 200, 120, 'cloud0');
        var cloud1 = new Phaser.Sprite(game, -60, 120, 'cloud1');
        var cloud2 = new Phaser.Sprite(game, 900, 170, 'cloud2');
        cloudLayer.add(cloud0);
        cloudLayer.add(cloud1);
        cloudLayer.add(cloud2);

        // Add ground sprite to groundLayer.
        var ground = new Phaser.Sprite(game, 0, 360, 'ground');
        groundLayer.add(ground);

        // Add river to riverLayer.
        var river = new Phaser.Sprite(game, 0, 400, 'river');
        riverLayer.add(river);

        // Add sprites to spriteLayer.
        var ufo = new Phaser.Sprite(game, 360, 240, 'ufo');
        ufo.anchor.setTo(0.5, 0.5);
        spriteLayer.add(ufo);
    }
    function render() {
        
        game.debug.renderText('sky layer:    z = 0', 16, 20);
        game.debug.renderText('cloud layer:  z = 1', 16, 36);
        game.debug.renderText('ground layer: z = 2', 16, 52);
        game.debug.renderText('sprite layer: z = 3', 16, 68);
        game.debug.renderText('river layer:  z = 4', 16, 84);
    }



</script>

<?php
    require('../foot.php');
?>
