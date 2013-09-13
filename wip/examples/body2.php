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

		bunny = game.add.sprite(500, game.world.centerY, 'bunny');
		
		bunny.body.offset.setTo();
		
		bot = game.add.sprite(150, game.world.centerY, 'bot');
		bot.anchor.setTo(0.5, 0.5);
		bot.animations.add('run');
		bot.animations.play('run', 10, true);

		game.add.tween(bot.scale).to({ x: 3, y: 3 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

	}

	function update() {

		bunny.angle += 1;
		bot.angle += 1;

	}

	function render() {

		game.debug.renderSpriteCorners(bunny, true, true);
		game.debug.renderSpriteCorners(bot, true, true);

		game.debug.renderRectangle(bunny.body.hitArea);

	}

})();

</script>

</body>
</html>