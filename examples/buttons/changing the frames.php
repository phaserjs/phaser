<?php
	$title = "Programmatically changing the frames";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

	function preload() {

		game.load.spritesheet('button', 'assets/buttons/number-buttons-90x90.png', 90,90);
		game.load.image('background','assets/misc/starfield.jpg');


	}
	var button,
		background;


	function create() {


		//setting the background colour
		game.stage.backgroundColor = '#182d3b';

		// the numbers given in parameters are the indexes of the frames, in this order : 
		// over,out,down
		button = game.add.button(game.world.centerX, game.world.centerY, 'button', actionOnClick, this, 1, 0, 2);

		//setting the anchor to the center
		button.anchor.setTo(0.5,0.5);

       

	}

	function actionOnClick () {
		
		//manually changing the frames of the button, i.e, how it will look when you play with it
		button.setFrames(4,3,5);
		console.log('You clicked on the button');


	}

})();

</script>

<?php
	require('../foot.php');
?>
