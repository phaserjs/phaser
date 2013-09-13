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

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {
		game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	}

	function create() {

		//	Make our game world 2000x2000 pixels in size (the default is to match the game size)
		game.world.setSize(2000, 2000);

		for (var i = 0; i < 50; i++)
		{
			var s = game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
			s.scrollFactor.setTo(0.5, 0.5);
		}

		for (var i = 0; i < 50; i++)
		{
			game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
		}

		for (var i = 0; i < 50; i++)
		{
			var s = game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
			s.scrollFactor.setTo(2, 2);
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

</body>
</html>