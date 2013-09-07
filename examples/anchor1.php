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

	var player;
	var aliens;

	function create() {

		player = game.add.sprite(400, 300, 'ship');
		player.anchor.setTo(0.5, 0.5);

	}

	function update() {
		player.angle++;
	}

	function render() {
		game.debug.renderSpriteCorners(player,true,true);
		game.debug.renderRectangle(player.body.bounds);
	}

})();

</script>

</body>
</html>