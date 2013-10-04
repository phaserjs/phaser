 
 <?php
	$title = "Moving around the World";
	require('../head.php');
?>

<script type="text/javascript">

window.onload = function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render : render });
	// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.stage.backgroundColor = '#007236';

        game.load.image('mushroom', 'assets/sprites/mushroom.png');
        game.load.image('phaser', 'assets/sprites/sonic_havok_sanity.png');

    }

    var cursors;
    var d;

    function create() {

        //  Modify the world and camera bounds
        game.world.setBounds(-1000, -1000, 2000, 2000);

        for (var i = 0; i < 100; i++)
        {
            var s = game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
            console.log(s.x, s.y);
        }

        d = game.add.sprite(0, 0, 'phaser');
        d.anchor.setTo(0.5, 0.5);

        cursors = game.input.keyboard.createCursorKeys();

    }

    function update() {

        if (cursors.up.isDown)
        {
            if (cursors.up.shiftKey)
            {
                d.angle++;
            }
            else
            {
                game.camera.y -= 4;
            }
        }
        else if (cursors.down.isDown)
        {
            if (cursors.down.shiftKey)
            {
                d.angle--;
            }
            else
            {
                game.camera.y += 4;
            }
        }

        if (cursors.left.isDown)
        {
            if (cursors.left.shiftKey)
            {
                game.world.rotation -= 0.05;
            }
            else
            {
                game.camera.x -= 4;
            }
        }
        else if (cursors.right.isDown)
        {
            if (cursors.right.shiftKey)
            {
                game.world.rotation += 0.05;
            }
            else
            {
                game.camera.x += 4;
            }
        }

    }

    function render() {

        game.debug.renderCameraInfo(game.camera, 32, 32);
        // game.debug.renderWorldTransformInfo(d, 32, 200);
        // game.debug.renderLocalTransformInfo(d, 32, 400);
        game.debug.renderSpriteCorners(d, false, true);

    }

};

</script>

<?php
	require('../foot.php');
?>
