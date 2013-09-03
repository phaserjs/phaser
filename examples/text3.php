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

	var game = new Phaser.Game(800, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	var content = [
		" ",
		"photon storm presents",
		"a phaser production",
		" ",
		"Kern of Duty",
		" ",
		"directed by rich davey",
		"rendering by mat groves",
		"    ",
		"03:45, November 4th, 2014",
		"somewhere in the north pacific",
		"mission control bravo ...",
	];

	var t = 0;
	var s;
	var index = 0;
	var line = '';

	function preload() {
		game.load.image('cod', 'assets/pics/cod.jpg');
	}

	function create() {

		game.add.sprite(0, 0, 'cod');

		var style = { font: "30pt Courier", fill: "#19cb65", stroke: "#119f4e", strokeThickness: 2 };

		s = game.add.text(32, 380, '', style);
		t = game.time.now + 80;

	}

	function update() {
		
		if (game.time.now > t && index < content.length)
		{
			//	get the next character in the line
			if (line.length < content[index].length)
			{
				line = content[index].substr(0, line.length + 1);
				s.setText(line);
				t = game.time.now + 80;
			}
			else
			{
				t = game.time.now + 2000;

				if (index < content.length)
				{
					index++;
					line = '';
				}
			}
		}

	}

})();

</script>

</body>
</html>