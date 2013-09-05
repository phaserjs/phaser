<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
</head>
<body>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(50, 30, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

	function preload() {
		game.load.image('background', 'assets/bd/back2.png');
		// game.load.image('piccie', 'assets/sprites/phaser_tiny.png');
		game.load.image('scroller', 'assets/bd/scroller.png');
	}

	var back;
	var logo;
	var scroller;
	var t = 0;

	function create() {

		back = game.add.sprite(0, 0, 'background');
		scroller = game.add.sprite(50, 10, 'scroller');
		// logo = game.add.sprite(0, 0, 'piccie');

		back.body.moves = false;

		// logo.body.velocity.setTo(1,1);
		// logo.body.bounce.setTo(1, 1);
		// logo.body.collideWorldBounds = true;

		game.add.tween(back).to( { y: -60 }, 20000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		game.add.tween(scroller).to( { x: -700 }, 700*250, Phaser.Easing.Linear.None, true, 0, 1000);

	}

	function update() {

		if (game.time.now > t)
		{
			canvasToConsole();
			t = game.time.now + 1000;
		}

		back.y -= 1;

	}

    function canvasToConsole() {

        console.clear();

        for (var y = 0; y < game.height; y++)
        {
        	var c = [];

        	for (var x = 0; x < game.width; x++)
        	{
                var rgb = game.renderer.context.getImageData(x, y, 1, 1);
                var s = "#" + colorToHex(rgb.data[0]) + colorToHex(rgb.data[1]) + colorToHex(rgb.data[2]);
                c.push("background: " + s + "");
        	}

        	console.log('%c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  %c  ', c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], c[12], c[13], c[14], c[15], c[16], c[17], c[18], c[19], c[20], c[21], c[22], c[23], c[24], c[25], c[26], c[27], c[28], c[29], c[30], c[31], c[32], c[33], c[34], c[35], c[36], c[37], c[38], c[39], c[40], c[41], c[42], c[43], c[44], c[45], c[46], c[47], c[48], c[49]);
        }

    }

    function colorToHex(color) {
        return "0123456789ABCDEF".charAt((color - (color % 16)) / 16) + "0123456789ABCDEF".charAt(color % 16);
    }

})();

</script>

</body>
</html>