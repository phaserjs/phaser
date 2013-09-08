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

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {
		game.load.atlasJSONHash('bot', 'assets/sprites/running_bot.png', 'assets/sprites/running_bot.json');
		game.load.image('bunny', 'assets/sprites/mana_card.png');
	}

	var bunny;
	var wall;
	var bot;

	function create() {

		game.world._stage.backgroundColorString = '#182d3b';
		// game.physics.gravity.y = 10;

		bunny = game.add.sprite(200, 100, 'bunny');
		bunny.body.bounce.y = 0.5;
		// bunny.body.gravity.y = -10;
		// bunny.body.setSize(20, 100);
		// bunny.body.offset.setTo(25, -20);
		// bunny.anchor.setTo(0.5, 0.5);

		wall = game.add.sprite(200, 450, 'bunny');
		wall.body.immovable = true;
		wall.body.allowGravity = false;

		// bunny.body.angularVelocity = 1;
		bunny.body.velocity.x = 30;
		// bunny.body.velocity.y = 120;
		// bunny.body.velocity.y = 50;

	}

	function update() {

		// bunny.rotation += 0.01;
		game.physics.separate(bunny.body, wall.body);

	}

	function render() {

		game.debug.renderSpriteCorners(bunny, true, true);
		game.debug.renderRectangle(bunny.body);
		game.debug.renderRectangle(wall.body);

	}

})();

</script>

</body>
</html>