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

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create });

	function preload() {
		game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
		game.load.image('card', 'assets/sprites/mana_card.png');
	}

	var group;
	var s;
	var a;
	var b;
	var c;
	var d;
	var e;
	var f;
	var g;
	var h;
	var i;

	var group2;
	var a2;
	var b2;
	var c2;

	function create() {

		group = game.add.group(null, 'group1');

		a = group.create(70, 200, 'sonic');
		b = group.create(140, 200, 'sonic');
		c = group.create(210, 200, 'sonic');
		d = group.create(280, 200, 'sonic');
		e = group.create(350, 200, 'sonic');
		f = group.create(420, 200, 'sonic');
		g = group.create(50, 300, 'sonic');
		h = group.create(80, 300, 'sonic');
		i = group.create(110, 300, 'sonic');

		a.name = 'A';
		b.name = 'B';
		c.name = 'C';
		d.name = 'D';
		e.name = 'E';
		f.name = 'F';
		g.name = 'g';
		h.name = 'h';
		i.name = 'i';

		/*
		group2 = game.add.group(group, 'group2');

		a2 = group2.create(500, 200, 'card');
		b2 = group2.create(550, 200, 'card');
		c2 = group2.create(600, 200, 'card');
		a2.name = 'A2';
		b2.name = 'B2';
		c2.name = 'C2';
		*/

		// console.log(group2._container.parent);

		group.dump(true);

		game.input.onUp.add(runChange, this);

	}

	function runChange () {

		group.swap(a, i);
		group.dump(true);

	}

})();

</script>

</body>
</html>