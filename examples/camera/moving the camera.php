<?php
	$title = "Moving the Camera";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {
		game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	}

	function create() {

		game.stage.backgroundColor = '#2d2d2d';

		//	Make our game world 2000x2000 pixels in size (the default is to match the game size)
		game.world.setBounds(2000, 2000);

		for (var i = 0; i < 50; i++)
		{
			var s = game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
		}

		for (var i = 0; i < 50; i++)
		{
			game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
		}

		for (var i = 0; i < 50; i++)
		{
			var s = game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
		}

	}

	function update() {

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

})();

</script>

<?php
	require('../foot.php');
?>