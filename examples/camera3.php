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

	var s;
	var s2;

	function preload() {
		game.load.image('card', 'assets/sprites/mana_card.png');
		game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	}

	function create() {

		s = game.add.sprite(game.world.centerX, game.world.centerY, 'card');
		s2 = game.add.sprite(100, 100, 'mushroom');

		s.addChild(s2);

		// s.angle = 45;
		s.scale.x = 0.5;
		s.scale.y = 0.5;
		// s2.scale.x = 2;
		// s2.scale.y = 2;

		s.anchor.setTo(0.5, 0.5);
		s2.anchor.setTo(0.5, 0.5);

	}

	function update() {

		s.angle += 0.5;
		// s2.angle += 1;

		if (s.scale.x > -2)
		{
			// s.scale.x -= 0.01;
			// s.scale.y -= 0.01;
		}

	}

	function render() {

		var scale1X = Math.sqrt((s2.worldTransform[0] * s2.worldTransform[0]) + (s2.worldTransform[1] * s2.worldTransform[1]));
		var scale1Y = Math.sqrt((s2.worldTransform[3] * s2.worldTransform[3]) + (s2.worldTransform[4] * s2.worldTransform[4]));

		game.debug.renderText('scaleX: ' + scale1X + ' scaleY: ' + scale1Y, 500, 32);

		game.debug.renderWorldTransformInfo(s, 32, 32);
		game.debug.renderLocalTransformInfo(s, 300, 32);

		game.debug.renderWorldTransformInfo(s2, 32, 450);
		game.debug.renderLocalTransformInfo(s2, 300, 450);

		game.debug.renderPoint(s.topLeft, 'rgb(255,0,0)');
		game.debug.renderPoint(s.topRight, 'rgb(0,255,0)');
		game.debug.renderPoint(s.bottomLeft, 'rgb(0,0,255)');
		game.debug.renderPoint(s.bottomRight, 'rgb(255,0,255)');

		game.debug.renderPoint(s2.topLeft, 'rgb(255,0,0)');
		game.debug.renderPoint(s2.topRight, 'rgb(0,255,0)');
		game.debug.renderPoint(s2.bottomLeft, 'rgb(0,0,255)');
		game.debug.renderPoint(s2.bottomRight, 'rgb(255,0,255)');

	}

})();

</script>

</body>
</html>