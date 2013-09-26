<?php
	$title = "Multi Touch";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {

		// game.load.image('disk', 'assets/sprites/ra_dont_crack_under_pressure.png');

	}

	function create() {

		game.stage.backgroundColor = '#454645';

	}

	function update() {
	}

	function render() {

        game.debug.renderPointer(game.input.mousePointer);
        game.debug.renderPointer(game.input.pointer1);
        game.debug.renderPointer(game.input.pointer2);
        game.debug.renderPointer(game.input.pointer3);
        game.debug.renderPointer(game.input.pointer4);

	}

})();

</script>

<?php
	require('../foot.php');
?>