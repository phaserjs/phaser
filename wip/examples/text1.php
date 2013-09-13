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

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { create: create });

	function create() {

		var text = "- phaser -\nwith a sprinkle of\npixi dust";
		var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

		game.add.text(game.world.centerX, game.world.centerY, text, style).anchor.setTo(0.5, 0.5);

	}

})();

</script>

</body>
</html>