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

	var tests;

	function create() {

		s = game.add.sprite(600, 100, 'sonic');
		s.name = 'X';

		a = game.add.child(s, -70, 200, 'sonic');
		b = game.add.child(s, -140, 200, 'sonic');
		c = game.add.child(s, -210, 200, 'sonic');
		d = game.add.child(s, -280, 200, 'sonic');
		e = game.add.child(s, -350, 200, 'sonic');
		f = game.add.child(s, -420, 200, 'sonic');

		a.name = 'A';
		b.name = 'B';
		c.name = 'C';
		d.name = 'D';
		e.name = 'E';
		f.name = 'F';

		tests = [a,b,c,d,e,f];

		game.input.onUp.add(runChange, this);

		scanList(game.world._stage);

	}

	function runChange () {
		changeOrder(e, f);
	}

	function changeOrder (node1, node2) {

		console.log('Changing order of', node1.name,'and',node2.name);

		var index1 = s.children.indexOf(node1);
		var index2 = s.children.indexOf(node2);

		if (index1 !== -1 && index2 !== -1)
		{
			//	Cache the node values
			var node1Prev = node1._iPrev;
			var node1Next = node1._iNext;
			var node2Prev = node2._iPrev;
			var node2Next = node2._iNext;

			//	Now deep scan search and replace
			var displayObject = this.game.world._stage;

			var testObject = displayObject.last._iNext;
			displayObject = displayObject.first;
			
			do	
			{

				displayObject = displayObject._iNext;

			}
			while(displayObject != testObject)


			//	Check for neighbours (cater for any order parameters)
			if (node1._iNext == node2)
			{
				console.log('A-B neighbour swap. Parent is', node1.parent.name, 'tail is', tail.name);

				//	Starting
				//	Node 1 (A)			Node 2 (B)		X 			C
				//	Next: B 			Next: C 		Next: A 	Next: D
				//	Prev: X 			Prev: A 		Prev: - 	Prev: B

				//	Ending
				//	Node 1 (A)			Node 2 (B) 		X 			C
				//	Next: C 			Next: A 		Next: B 	Next: D
				//	Prev: B 			Prev: X 		Prev: -		Prev: A

				//	Was node2 a tail node?
				/*
				if (node2 === tail)
				{
					node2._iNext = node1;
					node2._iPrev = node1Prev;
					node1._iNext = null;
					node1._iPrev = node2;

					//	Notify the head and tail
					if (node1Prev)
					{
						node1Prev._iNext = node2;
					}

					node1.parent.last = node1;
				}
				else
				{
				*/
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
				// }
			}
			else if (node2._iNext == node1)
			{
				console.log('B-A neighbour swap');

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
			else
			{
				//	Nodes are far apart
				console.log('Nodes are far apart');

				//	Pre-swap:
				// 	X 	next: a 	prev: - 	first: X 	last: d
				// 	a 	next: b 	prev: X 	first: a 	last: a
				// 	b 	next: c 	prev: a 	first: b 	last: b
				// 	c 	next: d 	prev: b 	first: c 	last: c
				// 	d 	next: e 	prev: c 	first: d 	last: d
				// 	e 	next: f 	prev: d 	first: e 	last: e
				// 	f 	next: - 	prev: e 	first: f 	last: f

				//	Post-swap:
				// 	X 	next: d 	prev: - 	first: X 	last: d 	***
				// 	d 	next: b 	prev: X 	first: d 	last: d 	***
				// 	b 	next: c 	prev: d 	first: b 	last: b 	***
				// 	c 	next: a 	prev: b 	first: c 	last: c 	***
				// 	a 	next: e 	prev: c 	first: a 	last: a 	***
				// 	e 	next: f 	prev: a 	first: e 	last: e 	***
				// 	f 	next: - 	prev: e 	first: f 	last: f

				//	Starting
				//	Node 1 (A)			Node 2 (D)		N1 Prev (X)		N1 Next (B)		N2 Prev (C)		N2 Next (E)
				//	Next: B 			Next: E 		Next: A 		Next: C 		Next: D			Next: F
				//	Prev: X 			Prev: C 		Prev: - 		Prev: A 		Prev: B			Prev: D

				//	Ending
				//	Node 1 (A)			Node 2 (D)		N1 Prev (X)		N1 Next (B)		N2 Prev (C)		N2 Next (E)
				//	Next: E 			Next: B 		Next: D 		Next: C 		Next: A			Next: F
				//	Prev: C 			Prev: X 		Prev: - 		Prev: D 		Prev: B			Prev: A

				//	Simple node 1-2 swap
				node1._iNext = node2Next;
				node1._iPrev = node2Prev;
				node2._iNext = node1Next;
				node2._iPrev = node1Prev;

				//	Now the head and tail for node 1.
				if (node1Prev)
				{
					node1Prev._iNext = node2;
				}

				if (node1Next)
				{
					node1Next._iPrev = node2;
				}

				//	Now the head and tail for node 2.
				if (node2Prev)
				{
					node2Prev._iNext = node1;
				}

				if (node2Next)
				{
					node2Next._iPrev = node1;
				}
			}
		} 

		scanList(game.world._stage);

	}

	function scanList (sprite) {

		console.log('Node  |  Next  |  Prev  |  First  |  Last');
		console.log('------|--------|--------|---------|---------');

		var displayObject = sprite;

		var testObject = displayObject.last._iNext;
		displayObject = displayObject.first;
		
		do	
		{
			var name = displayObject.name || '~';
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

			console.log(name + '     |   ' + nameNext + '    |   ' + namePrev + '    |   ' + nameFirst + '     |    ' + nameLast);

			displayObject = displayObject._iNext;

		}
		while(displayObject != testObject)

	}

	function update() {
	}

	function render() {

		for (var i = 0; i < tests.length; i++)
		{
			game.debug.renderText(tests[i].name, s.x + tests[i].x, s.y + tests[i].y - 20);
		}

		// game.debug.renderSpriteCorners(s, false, false);
		game.debug.renderSpriteInfo(a, 20, 32);

	}

})();

</script>

</body>
</html>