<?php
	$title = "Rotating a button";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create,update : update });

	function preload() {

		game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
		game.load.image('background','assets/misc/starfield.jpg');


	}
	var button,
		background;


	function create() {

		game.stage.backgroundColor = '#cccccc';

		// the numbers given in parameters are the indexes of the frames, in this order : 
		// over,out,down
		button = game.add.button(game.world.centerX, game.world.centerY, 'button', actionOnClick, this, 1, 0, 2);

		//set the anchor of the sprite in the center, otherwise it would rotate around the top-left corner
		button.anchor.setTo(0.5,0.5);

       

	}

	function actionOnClick () {
		
		alert("Though I'm turning around, you can still click on me");


	}

	function update () {
		
		button.angle+=1;
	}

})();

</script>

<?php
	require('../foot.php');
?>
