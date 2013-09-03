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
	var bot;

	function create() {

		game.world._stage.backgroundColorString = '#182d3b';

		bunny = game.add.sprite(200, 200, 'bunny');

		bunny.body.acceleration.x = 10;
		// bunny.body.velocity.y = 20;

	}

	function update() {


	}

	function render() {

		game.debug.renderSpriteCorners(bunny, true, true);
		game.debug.renderRectangle(bunny.body.hitArea);

	}

})();

</script>

</body>
</html>