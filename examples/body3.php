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

		bunny = game.add.sprite(200, 200, 'bunny');
		bunny.body.bounce.x = 0.8;

		wall = game.add.sprite(700, 200, 'bunny');
		wall.body.immovable = true;

		bunny.body.velocity.x = 180;

	}

	function update() {

		game.physics.separateX(bunny.body, wall.body);

	}

	function render() {

		game.debug.renderSpriteCorners(bunny, true, true);
		game.debug.renderRectangle(bunny.body.hitArea);

	}

})();

</script>

</body>
</html>