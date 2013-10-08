<?php
	$title = "rnd";
	require('../head.php');
?>

<script type="text/javascript">

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { create: create, update: update, render: render });

	function create() {

		game.rnd.sow([123]);
		console.log('A');
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());

		game.rnd.sow([0]);
		console.log('B');
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());

		game.rnd.sow([123]);
		console.log('C');
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
		console.log(game.rnd.integer());
	}

	function update() {
	}

	function render() {
	}

</script>

<?php
	require('../foot.php');
?>