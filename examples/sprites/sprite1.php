<?php
	$title = "Display a Sprite";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {
		game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	}

	function create() {

		var test = game.add.sprite(200, 200, 'mushroom');

	}

	function update() {
	}

})();

</script>

<?php
	require('../foot.php');
?>