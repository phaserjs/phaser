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
		game.load.image('alien', 'assets/sprites/space-baddie.png');
		game.load.image('ship', 'assets/sprites/shmup-ship.png');
	}

	var player;
	var aliens;

	function create() {

		player = game.add.sprite(400, 500, 'ship');
		// player.anchor.setTo(0.5, 0.5);

		aliens = game.add.group();

		for (var y = 0; y < 4; y++)
		{
			for (var x = 0; x < 10; x++)
			{
				aliens.create(x * 48, y * 64, 'alien');
			}
		}

		aliens.x = 100;

		var tween = game.add.tween(aliens).to({x: 200}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		tween.onComplete.add(descend, this);

	}

	function descend() {
		aliens.y += 10;
	}

	function update() {
	}

	function render() {
	}

})();

</script>

</body>
</html>