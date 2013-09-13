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
		player.alpha = 0.2;
		player.body.collideWorldBounds = true;
		player.body.bounce.setTo(1, 1);

		//	The body offset is from the ANCHOR point of the Sprite, not the top-left (or center, etc)
		player.body.setSize(60, 60, 0, 0);
		player.anchor.setTo(0.5, 0.5);
		player.body.velocity.x = 100;

	}

	function update() {
		// console.log(Math.floor(player.center.x), Math.floor(player.center.y));
		player.angle++;
		player.scale.x += 0.005;
		player.scale.y += 0.005;
	}

	function render() {
		// game.debug.renderSpriteCorners(player,true,true);
		game.debug.renderRectangle(player.body);
		game.debug.renderPixel(400, 300, 'rgb(255,0,0)');
		game.debug.renderPoint(player.center, 'rgb(255,254,0)');
	}

})();

</script>

</body>
</html>