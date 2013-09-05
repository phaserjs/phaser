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

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {
		// game.load.image('piccie', 'assets/sprites/phaser_tiny.png');
		// game.load.image('piccie', 'assets/sprites/carrot.png');
		// game.load.image('piccie', 'assets/sprites/phaser-dude.png');
		game.load.image('piccie', 'assets/pics/atari_fujilogo.png');
	}

	var canvas;
	var context;

	function create() {

		var img = game.add.sprite(0, 0, 'piccie');

        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        context = canvas.getContext('2d');

        context.drawImage(game.cache.getImage('piccie'), 0, 0);

        var result = '';

        for (var y = 0; y < img.height; y++)
        {
        	var line = '';
        	var css = '';
        	var previousColor = '';

        	for (var x = 0; x < img.width; x++)
        	{
                var c = context.getImageData(x, y, 1, 1);
                var s = "#" + colorToHex(c.data[0]) + colorToHex(c.data[1]) + colorToHex(c.data[2]);

                if (s == previousColor)
                {
                	line = line + ' ';
                }
                else
                {
	                line = line + '%c ';
	                css = css + "'background: " + s + "', ";
	                previousColor = s;
                }
        	}

        	css = css.substr(0, css.length - 2);

        	result = result + "console.log('" + line + "', " + css + ");\n";
        }

		document.getElementById('output').innerHTML = result;

	}

    /**
	* Return a string containing a hex representation of the given color
	* 
    * @method colorToHexstring
	* @param {Number} color The color channel to get the hex value for, must be a value between 0 and 255)
	* @return {String} A string of length 2 characters, i.e. 255 = FF, 0 = 00
	*/
    function colorToHex(color) {

        var digits = "0123456789ABCDEF";

        var lsd = color % 16;
        var msd = (color - lsd) / 16;

        var hexified = digits.charAt(msd) + digits.charAt(lsd);

        return hexified;

    }

	function update() {
	}

	function render() {
	}

})();

</script>

</body>
</html>