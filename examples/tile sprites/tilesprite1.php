<?php
    $title = "Tiling Sprites";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {
		game.load.image('disk', 'assets/sprites/p2.jpeg');
	}

	var s;
	var count = 0;

	function create() {
		s = game.add.tileSprite(0, 0, 512, 512, 'disk');
	}

	function update() {

		count += 0.005

		s.tileScale.x = 2 + Math.sin(count);
		s.tileScale.y = 2 + Math.cos(count);
		
		s.tilePosition.x += 1;
		s.tilePosition.y += 1;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            s.x -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            s.x += 4;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            s.y -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            s.y += 4;
        }

	}

})();

</script>

<?php
	require('../foot.php');
?>