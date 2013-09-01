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
	var r;

	function preload() {
		game.load.image('test', 'assets/sprites/mana_card.png');
	}

	function create() {

		s = game.add.sprite(game.world.centerX, game.world.centerY, 'test');
		s.anchor.setTo(0.5, 0.5);

		r = s.getBounds(r);

	}

	function update() {

		s.angle += 1;
		s.getBounds(r);

	}

	function render() {

		game.debug.renderRectangle(r);

	}

})();

</script>

</body>
</html>