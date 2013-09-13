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
		game.load.image('ship', 'assets/sprites/mana_card.png');
	}

	var a;
	var p = new Phaser.Point;

	function create() {

		a = game.add.sprite(game.world.centerX, game.world.centerX, 'ship');
		a.name = 'sh';
		a.inputEnabled = true;
		a.angle = 30;

		a.events.onInputDown.add(clicked, this);

	}

	function clicked (sprite, pointer) {

		sprite.alpha -= 0.1;

	}

	function update() {
	}

	function render() {

		// game.debug.renderText('over: ' + a.input.checkPointerOver(game.input.activePointer), 32, 32);


		// game.debug.renderPoint(p, 'rgb(255,255,0)');
		// game.debug.renderText('px: ' + game.input.activePointer.x, 32, 32);
		// game.debug.renderText('py: ' + game.input.activePointer.y, 32, 64);
		// game.debug.renderPointer(game.input.activePointer);
		game.debug.renderSpriteInputInfo(a, 32, 32);

	}

})();

</script>

</body>
</html>