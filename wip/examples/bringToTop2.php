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
		game.load.image('card', 'assets/sprites/mana_card.png');
	}

	function create() {

		game.add.sprite(game.world.randomX, game.world.randomY, 'card');
	}

	function runChange () {
		// changeOrder(a, h);
	}

	function update() {
	}

	function render() {
	}

})();

</script>

</body>
</html>