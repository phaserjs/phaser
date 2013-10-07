<?php
	$title = "Fixing a Sprite to the Camera";
	require('../head.php');
?>

<script type="text/javascript">

window.onload = function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render : render });
	// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.stage.backgroundColor = '#007236';

        game.load.image('mushroom', 'assets/sprites/mushroom2.png');
        game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
        game.load.image('phaser', 'assets/sprites/phaser1.png');

    }

    var cursors;
    var logo1;
    var logo2;

    function create() {

        //  Modify the world and camera bounds
        game.world.setBounds(-1000, -1000, 2000, 2000);

        for (var i = 0; i < 200; i++)
        {
            game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
        }

        logo1 = game.add.sprite(100, 100, 'phaser');
        logo1.fixedToCamera = true;

        logo2 = game.add.sprite(500, 100, 'phaser');
        logo2.fixedToCamera = true;

        game.add.tween(logo2).to( { y: 400 }, 2000, Phaser.Easing.Back.InOut, true, 0, 2000, true);

        cursors = game.input.keyboard.createCursorKeys();

    }

    function update() {

        if (cursors.up.isDown)
        {
            game.camera.y -= 4;
        }
        else if (cursors.down.isDown)
        {
            game.camera.y += 4;
        }

        if (cursors.left.isDown)
        {
            game.camera.x -= 4;
        }
        else if (cursors.right.isDown)
        {
            game.camera.x += 4;
        }

    }

    function render() {

        game.debug.renderCameraInfo(game.camera, 32, 32);
        // game.debug.renderSpriteInfo(d, 32, 200);
        // game.debug.renderWorldTransformInfo(d, 32, 200);
        // game.debug.renderLocalTransformInfo(d, 32, 400);
        // game.debug.renderSpriteCorners(d, false, true);

    }

};

</script>

<?php
	require('../foot.php');
?>
