<?php
	$title = "Test Title";
	require('../head.php');
?>

<script type="text/javascript">



	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

	function preload() {

		// game.load.image('disk', 'assets/sprites/ra_dont_crack_under_pressure.png');

	}

	function create() {

		// game.add.sprite(0, 0, 'disk');

	}

	function update() {
	}

	function render() {
	}



</script>

<?php
	require('../foot.php');
?>