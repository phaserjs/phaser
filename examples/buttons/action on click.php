<?php
	$title = "Clicking on a button ";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

	function preload() {

		game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
		game.load.image('background','assets/misc/starfield.jpg');


	}
	var button,
		background;


	function create() {

		game.stage.backgroundColor = '#182d3b';


		background=game.add.tileSprite(0, 0, 800, 600, 'background');

		button = game.add.button(game.world.centerX, 400, 'button', actionOnClick, this, 2, 1, 0);

       

	}

	function actionOnClick () {

		background.visible=!background.visible;

	}

})();

</script>

<?php
	require('../foot.php');
?>
