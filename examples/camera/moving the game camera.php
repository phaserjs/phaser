 
 <?php
	$title = "Moving the game camera with the keyboard";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {

        game.load.tilemap('snes', 'assets/maps/smb_tiles.png', 'assets/maps/smb_level1.json', null, Phaser.Tilemap.JSON);
	}

	function create() {


		//setting the size of the game world larger than the tilemap's size
		game.world.setSize(2000,2000);

		game.stage.backgroundColor = '#255d3b';

		// adding the tilemap
        game.add.tilemap(0, 150, 'snes');


	}

	function update() {
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= 8;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += 8;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= 8;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += 8;
        }
	}

})();

</script>

<?php
	require('../foot.php');
?>
