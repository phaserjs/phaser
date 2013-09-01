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
		game.load.image('mushroom', 'assets/sprites/mana_card.png');
	}

	function create() {

		s = game.add.sprite(game.world.centerX, game.world.centerY, 'mushroom');

		s.anchor.setTo(0.5, 0.5);

	}

	function update() {

		s.angle += 0.5;

		if (s.scale.x > -2)
		{
			s.scale.x -= 0.01;
			s.scale.y -= 0.01;
		}

	}

	function render() {

		game.debug.renderPoint(s.topLeft, 'rgb(255,0,0)');
		game.debug.renderPoint(s.topRight, 'rgb(0,255,0)');
		game.debug.renderPoint(s.bottomLeft, 'rgb(0,0,255)');
		game.debug.renderPoint(s.bottomRight, 'rgb(255,0,255)');

	}

})();

</script>

</body>
</html>