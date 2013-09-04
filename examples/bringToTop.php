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
		game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
	}

	var s;
	var a;
	var b;
	var c;
	var d;
	var e;
	var f;

	function create() {

		s = game.add.sprite(game.world.centerX, game.world.centerY, 'sonic');
		s.name = 'X';

		a = game.add.child(s, -50, 0, 'sonic');
		b = game.add.child(s, -100, 0, 'sonic');
		c = game.add.child(s, -150, 0, 'sonic');
		d = game.add.child(s, -200, 0, 'sonic');
		e = game.add.child(s, -250, 0, 'sonic');
		f = game.add.child(s, -300, 0, 'sonic');

		a.name = 'a';
		b.name = 'b';
		c.name = 'c';
		d.name = 'd';
		e.name = 'e';
		f.name = 'f';

		game.input.onUp.add(runChange, this);

		scanList(s);

	}

	function runChange () {
		changeOrder(a, d);
	}

	function changeOrder (node1, node2) {

		console.log('Changing order of', node1.name,'and',node2.name);

		var index1 = s.children.indexOf(node1);
		var index2 = s.children.indexOf(node2);

		if (index1 !== -1 && index2 !== -1)
		{
			//	check for neighbours (cater for any order parameters)
			if (node1._iNext == node2)
			{
				console.log('A-B neighbour swap');

				//	Pre-swap:
				// 	X 	next: a 	prev: - 	first: X 	last: d
				// 	a 	next: b 	prev: X 	first: a 	last: a
				// 	b 	next: c 	prev: a 	first: b 	last: b
				// 	c 	next: d 	prev: b 	first: c 	last: c
				// 	d 	next: - 	prev: c 	first: d 	last: d

				//	Post-swap:
				// 	X 	next: b 	prev: - 	first: X 	last: d
				// 	b 	next: a 	prev: X 	first: b 	last: b
				// 	a 	next: c 	prev: b 	first: a 	last: a
				// 	c 	next: d 	prev: a 	first: c 	last: c
				// 	d 	next: - 	prev: c 	first: d 	last: d

				var node1Prev = node1._iPrev;
				var node1Next = node1._iNext;
				var node2Prev = node2._iPrev;
				var node2Next = node2._iNext;

				//	Starting
				//	Node 1 (A)			Node 2 (B)		X 			C
				//	Next: B 			Next: C 		Next: A 	Next: D
				//	Prev: X 			Prev: A 		Prev: - 	Prev: B

				//	Ending
				//	Node 1 (A)			Node 2 (B) 		X 			C
				//	Next: C 			Next: A 		Next: B 	Next: D
				//	Prev: B 			Prev: X 		Prev: -		Prev: A

				node1._iNext = node2Next;
				node1._iPrev = node2;
				node2._iNext = node1;
				node2._iPrev = node1Prev;

				//	Notify the head and tail
				if (node1Prev)
				{
					node1Prev._iNext = node2;
				}

				if (node2Next)
				{
					node2Next._iPrev = node1;
				}
			}
			else if (node2._iNext == node1)
			{
				console.log('B-A neighbour swap');

				//	Pre-swap:
				// 	X 	next: a 	prev: - 	first: X 	last: d
				// 	a 	next: b 	prev: X 	first: a 	last: a
				// 	b 	next: c 	prev: a 	first: b 	last: b
				// 	c 	next: d 	prev: b 	first: c 	last: c
				// 	d 	next: - 	prev: c 	first: d 	last: d

				//	Post-swap:
				// 	X 	next: b 	prev: - 	first: X 	last: d
				// 	b 	next: a 	prev: X 	first: b 	last: b
				// 	a 	next: c 	prev: b 	first: a 	last: a
				// 	c 	next: d 	prev: a 	first: c 	last: c
				// 	d 	next: - 	prev: c 	first: d 	last: d

				var node1Prev = node1._iPrev;
				var node1Next = node1._iNext;
				var node2Prev = node2._iPrev;
				var node2Next = node2._iNext;

				//	Starting
				//	Node 1 (B)			Node 2 (A)		X 			C
				//	Next: C 			Next: B 		Next: A 	Next: D
				//	Prev: A 			Prev: X 		Prev: - 	Prev: B

				//	Ending
				//	Node 1 (B)			Node 2 (A) 		X 			C
				//	Next: A 			Next: C 		Next: B 	Next: D
				//	Prev: X 			Prev: B 		Prev: -		Prev: A

				node1._iNext = node2;
				node1._iPrev = node2Prev;
				node2._iNext = node1Next;
				node2._iPrev = node1;

				//	Notify the head and tail
				if (node2Prev)
				{
					node2Prev._iNext = node1;
				}

				if (node1Next)
				{
					node2Next._iPrev = node2;
				}
			}
		} 

		scanList(s);

	}

	function scanList (sprite) {

		var displayObject = sprite;

		var testObject = displayObject.last._iNext;
		displayObject = displayObject.first;
		
		do	
		{
			var name = displayObject.name || 'nuffin';
			var nameNext = '-';
			var namePrev = '-';
			var nameFirst = '-';
			var nameLast = '-';

			if (displayObject._iNext)
			{
				nameNext = displayObject._iNext.name;
			}

			if (displayObject._iPrev)
			{
				namePrev = displayObject._iPrev.name;
			}

			if (displayObject.first)
			{
				nameFirst = displayObject.first.name;
			}

			if (displayObject.last)
			{
				nameLast = displayObject.last.name;
			}

			if (typeof nameNext === 'undefined')
			{
				nameNext = '-';
			}

			if (typeof namePrev === 'undefined')
			{
				namePrev = '-';
			}

			if (typeof nameFirst === 'undefined')
			{
				nameFirst = '-';
			}

			if (typeof nameLast === 'undefined')
			{
				nameLast = '-';
			}

			console.log('node:', name, 'next:', nameNext, 'prev:', namePrev, 'first:', nameFirst, 'last:', nameLast);

			displayObject = displayObject._iNext;

		}
		while(displayObject != testObject)

	}

	function update() {
	}

	function render() {

		// game.debug.renderSpriteCorners(s, false, false);
		// game.debug.renderSpriteInfo(s, 20, 32);

	}

})();

</script>

</body>
</html>