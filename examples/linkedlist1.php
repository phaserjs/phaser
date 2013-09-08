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

	var a;
	var b;
	var c;
	var d;
	var e;
	var f;

	var list;

	function create() {

		a = game.add.sprite(game.world.randomX, game.world.randomY, 'ship');
		a.name = 's1';
		b = game.add.sprite(game.world.randomX, game.world.randomY, 'ship');
		b.name = 's2';
		c = game.add.sprite(game.world.randomX, game.world.randomY, 'ship');
		c.name = 's3';
		d = game.add.sprite(game.world.randomX, game.world.randomY, 'alien');
		d.name = 'a1';
		e = game.add.sprite(game.world.randomX, game.world.randomY, 'alien');
		e.name = 'a2';
		f = game.add.sprite(game.world.randomX, game.world.randomY, 'alien');
		f.name = 'a3';

		list = new Phaser.LinkedList();

		list.add(a.input);
		list.add(b.input);
		list.add(c.input);
		list.add(d.input);
		list.add(e.input);
		list.add(f.input);

		list.dump();

		list.remove(d.input);

		list.dump();

	}

	function update() {
	}

	function render() {
	}

})();

</script>

</body>
</html>