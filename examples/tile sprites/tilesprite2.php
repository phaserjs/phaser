<?php
    $title = "Tiling Sprites";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	var s;

	function preload() {
		game.load.image('starfield', 'assets/misc/starfield.jpg');
	}

	function create() {
		s = game.add.tileSprite(0, 0, 800, 600, 'starfield');
	}

	function update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            s.tilePosition.x += 8;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            s.tilePosition.x -= 8;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            s.tilePosition.y += 8;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            s.tilePosition.y -= 8;
        }

	}

})();

</script>

<?php
    require('../foot.php');
?>