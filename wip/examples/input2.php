<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
	<style type="text/css">
		body {
			margin: 0;
		}
	</style>
</head>
<body>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(400, 300, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {
		game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	}

	var m;

	function create() {

		// game.stage.canvas.style['-webkit-transform-origin'] = 'top left';
		// game.stage.canvas.style['-webkit-transform'] = 'scale(3,3)';

		// game.stage.scaleMode = Phaser.StageScaleMode.EXACT_FIT;
		// game.stage.scale.
		// game.stage.scale.setScreenSize();

		m = game.add.sprite(0, 0, 'mushroom');
		m.anchor.setTo(0.5, 0.5);

		// game.input.onDown.add(newMushroom, this);

	}

	function newMushroom(pointer) {
		// game.add.sprite(pointer.x, pointer.y, 'mushroom');
	}

	function update() {

		m.x = game.input.x;
		m.y = game.input.y;

	}

})();

</script>

</body>
</html>