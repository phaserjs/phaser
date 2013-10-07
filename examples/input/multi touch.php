<?php
	$title = "Multi Touch";
	require('../head.php');
?>

<script type="text/javascript">



	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {create: create, render: render });


	function create() {

		game.stage.backgroundColor = '#454645';

	}

	function render() {

        game.debug.renderPointer(game.input.mousePointer);
        game.debug.renderPointer(game.input.pointer1);
        game.debug.renderPointer(game.input.pointer2);
        game.debug.renderPointer(game.input.pointer3);
        game.debug.renderPointer(game.input.pointer4);

	}



</script>

<?php
	require('../foot.php');
?>