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

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {
		game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	}

	function create() {

		game.add.sprite(0, 0, 'mushroom');

		game.input.onDown.add(newMushroom, this);

	}

	function newMushroom(pointer) {
		game.add.sprite(pointer.x, pointer.y, 'mushroom');
	}

	function update() {
	}

})();

</script>

</body>
</html>