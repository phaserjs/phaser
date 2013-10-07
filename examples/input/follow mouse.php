<?php
	$title = "Follow Mouse";
	require('../head.php');
?>

<script type="text/javascript">



	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {

		game.load.image('ball', 'assets/sprites/shinyball.png');

	}

	var sprite;

	function create() {

		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');

	}

	function update() {

		//	only move when you click
		if (game.input.mousePointer.isDown)
		{
			//	400 is the speed it will move towards the mouse
			game.physics.moveTowardsMouse(sprite, 400);

			//	if it's overlapping the mouse, don't move any more
			if (Phaser.Rectangle.contains(sprite.body, game.input.x, game.input.y))
			{
				sprite.body.velocity.setTo(0, 0);
			}
		}
		else
		{
			sprite.body.velocity.setTo(0, 0);
		}

	}



</script>

<?php
	require('../foot.php');
?>