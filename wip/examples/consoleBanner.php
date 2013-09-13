<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
</head>
<body>

<textarea id="output" style="width: 800px; height: 400px">xxx</textarea>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(50, 50, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {
		game.load.image('piccie', 'assets/sprites/phaser_tiny.png');
		// game.load.image('piccie', 'assets/sprites/carrot.png');
		// game.load.image('piccie', 'assets/sprites/phaser-dude.png');
		// game.load.image('piccie', 'assets/pics/atari_fujilogo.png');
	}

	var canvas;
	var context;
	var logo;

	function create() {

		logo = game.add.sprite(0, 0, 'piccie');

		logo.body.velocity = 10;

	}

    function colorToHex(color) {
        return "0123456789ABCDEF".charAt((color - (color % 16)) / 16) + "0123456789ABCDEF".charAt(color % 16);
    }

    function canvasToConsole() {

        console.clear();

        for (var y = 0; y < game.height; y++)
        {
        	// var line = '';
        	var c = [];
        	var previousColor = '';

        	for (var x = 0; x < game.width; x++)
        	{
                var rgb = game.renderer.context.getImageData(x, y, 1, 1);
                var s = "#" + colorToHex(rgb.data[0]) + colorToHex(rgb.data[1]) + colorToHex(rgb.data[2]);
                c.push("'background: " + s + "'");
        	}

        	console.log('%c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c %c ', 
        		c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], 
        		c[10], c[11], c[12], c[13], c[14], c[15], c[16], c[17], c[18], c[19], 
        		c[20], c[21], c[22], c[23], c[24], c[25], c[26], c[27], c[28], c[29], 
        		c[30], c[31], c[32], c[33], c[34], c[35], c[36], c[37], c[38], c[39], 
        		c[40], c[41], c[42], c[43], c[44], c[45], c[46], c[47], c[48], c[49], 
        		c[50]);
        }

    }

	function update() {

		canvasToConsole();

	}

	function render() {
	}

})();

</script>

</body>
</html>