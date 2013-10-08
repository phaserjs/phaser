<?php
	$title = "Multi Touch";
	require('../head.php');
?>

<script type="text/javascript">

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {create: create, render: render });

	function create() {

		game.stage.backgroundColor = '#454645';

		//	By default Phaser only starts 2 pointers (enough for 2 fingers at once)

		//	addPointer tells Phaser to add another pointer to Input, so here we are basically saying "allow up to 6 pointers + the mouse"

		//	Note: on iOS as soon as you use 6 fingers you'll active the minimise app gesture - and there's nothing we can do to stop that, sorry

		game.input.addPointer();
		game.input.addPointer();
		game.input.addPointer();
		game.input.addPointer();

	}

	function render() {

		//	Just renders out the pointer data when you touch the canvas
        game.debug.renderPointer(game.input.mousePointer);
        game.debug.renderPointer(game.input.pointer1);
        game.debug.renderPointer(game.input.pointer2);
        game.debug.renderPointer(game.input.pointer3);
        game.debug.renderPointer(game.input.pointer4);
        game.debug.renderPointer(game.input.pointer5);
        game.debug.renderPointer(game.input.pointer6);

	}

</script>

<?php
	require('../foot.php');
?>